/**
 * Created by victor on 06/06/15.
 */

var expect = require('expect');
var DependencyComposite = require('../../lib/dependencyComposite');
var DependencyLeaf = require('../../lib/dependencyLeaf');

describe("dependencyComposite", function() {
  var component;
  var name = "compV";
  var dependency = {};
  beforeEach(function() {
    component = new DependencyComposite(name, dependency);
  });

  it('should return getDependenciesCount', function() {
    expect(component.getDependenciesCount()).toEqual(0);
  });

  it('should addDependency', function() {
    var anotherComposite = new DependencyComposite("another", {});

    component.addDependency(anotherComposite);

    expect(component.getDependencies()[0]).toEqual(anotherComposite);
  });

  it('should throw for addDependency given component and dependency are the same', function() {
    expect(function() {
      component.addDependency(component);
    }).toThrow(/Failed to resolve 'compV': it cannot depend on itself/);
  });

  it('should return hasDependencies', function() {
    var anotherComposite = new DependencyComposite("another", {});

    component.addDependency(anotherComposite);

    expect(component.hasDependencies()).toBe(true);
  });

  it('should getDependencies', function() {
    expect(component.getDependencies()).toEqual([]);
  });

  it('should getResolvedInstance', function() {
    function service(anohter){ this.another = anohter; return this;};
    component = new DependencyComposite(name, service);
    var anotherComponent = new DependencyLeaf("another", "a-value");
    var theDependencies = {};
    component.addDependency(anotherComponent);

    var instance = component.getResolvedInstance(theDependencies);

    expect(instance.another).toEqual(anotherComponent.getDependency());
  });

  it('should accept', function() {
    var visitor = {
      raiseIfCompositeHasAlreadyBeenVisited: function() {},
      visitComposite: function(component) {}
    };

    var anotherComponent = {
        accept: function(visitor){},
        getName: function() {return '';}
    };

    component.addDependency(anotherComponent);

    var raiseIfCompositeHasAlreadyBeenVisitedSpy = expect.spyOn(visitor, 'raiseIfCompositeHasAlreadyBeenVisited');
    var visitCompositeSpy = expect.spyOn(visitor, 'visitComposite');
    var acceptSpy = expect.spyOn(anotherComponent, 'accept');

    var result = component.accept(visitor);

    expect(raiseIfCompositeHasAlreadyBeenVisitedSpy).toHaveBeenCalledWith(component);
    expect(acceptSpy).toHaveBeenCalledWith(visitor);
    expect(visitCompositeSpy).toHaveBeenCalledWith(component);
    expect(result).toEqual(component);
  });

});