/**
 * Created by victor on 06/06/15.
 */

var expect = require('expect');
var DependencyComponent = require('../../lib/dependencyComponent');

describe("dependencyComponent", function(){
  var component;
  var name = "aName";
  var dependency = "aDep";

  beforeEach(function() {
    component = new DependencyComponent(name, dependency);
  });

  it('should getName', function() {
    expect(component.getName()).toEqual(name);
  });

  it('should getDependency', function() {
    expect(component.getDependency()).toEqual(dependency);
  });

  it('should getDependenciesCount', function() {
    expect(component.getDependenciesCount()).toEqual(0);
  });

  it('should return hasDependencies', function() {
    expect(component.hasDependencies()).toEqual(false);
  });

  it('should addDependency', function() {
    expect(component.addDependency({})).toEqual(component);
  });

  it('should getDependencies', function() {
    expect(component.getDependencies()).toEqual([]);
  });

  it('should getResolvedInstance', function() {
    expect(component.getResolvedInstance()).toEqual(null);
  });

  it('should accept', function() {
    expect(component.accept({})).toEqual(component);
  });

});