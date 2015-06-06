/**
 * Created by victor on 06/06/15.
 */

var expect = require('expect');
var DependencyLeaf = require('../../lib/dependencyLeaf');

describe("dependencyLeaf", function() {
  var component;
  beforeEach(function() {
    component = new DependencyLeaf('leaf', 'dep');
  });

  it('should getResolvedInstance', function() {
    expect(component.getResolvedInstance({})).toEqual('dep');
  });

  it('should getResolvedInstance', function() {
    var service = function() { return this; };
    component = new DependencyLeaf('dep', service);

    expect(component.getResolvedInstance({})).toEqual(service());
  });

  it('should accept', function() {
    var visitor = {
      visitLeaf: function(component) {}
    };

    var visitLeafSpy = expect.spyOn(visitor, 'visitLeaf');

    component.accept(visitor);

    expect(visitLeafSpy).toHaveBeenCalledWith(component);
  });

});