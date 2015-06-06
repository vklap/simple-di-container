/**
 * Created by victor on 06/06/15.
 */

var expect = require('expect');

var DependencyComponent = require('../../lib/dependencyComponent');
var ResolveAndFillDependenciesVisitor = require('../../lib/resolveAndFillDependenciesVisitor');

describe('resolveAndFillDependenciesVisitor', function() {
  var component;
  var visitorName = "visitorV";
  var componentName = "compK";
  var dependency = {};
  var dependencies = {};
  var visitor;

  beforeEach(function() {
    component = new DependencyComponent(componentName, dependency);
    visitor = new ResolveAndFillDependenciesVisitor(visitorName, dependencies);
  });

  it('should visitLeaf', function() {
    var getResolvedInstanceSpy = expect.spyOn(component, 'getResolvedInstance');

    visitor.visitLeaf(component);

    expect(dependencies[component.getName()]).toEqual(component.getResolvedInstance());
    expect(getResolvedInstanceSpy).toHaveBeenCalled();
  });

  it('should visitComposite', function() {
    var getResolvedInstanceSpy = expect.spyOn(component, 'getResolvedInstance');

    visitor.visitComposite(component);

    expect(dependencies[component.getName()]).toEqual(component.getResolvedInstance());
    expect(getResolvedInstanceSpy).toHaveBeenCalledWith(dependencies);
  });

  describe("raiseIfCompositeHasAlreadyBeenVisited", function() {
    it("should set visitedComposites", function() {
      visitor.raiseIfCompositeHasAlreadyBeenVisited(component);
      expect(visitor.visitedComposites[component.getName()]).toBe(true);
    });

    it("should raise given component already visited", function() {
      visitor.raiseIfCompositeHasAlreadyBeenVisited(component);
      expect(function() {
        visitor.raiseIfCompositeHasAlreadyBeenVisited(component);
      }).toThrow(/Failed to resolve 'visitorV': A circular dependency exists between 'visitorV' and 'compK'/);
    });

    it('should not set visitedComposites given visitor and dependency names are the same', function() {
      component = new DependencyComponent(visitorName, dependency);

      visitor.raiseIfCompositeHasAlreadyBeenVisited(component);

      expect(visitor.visitedComposites[component.getName()]).toBe(undefined);
    });
  });
});
