/**
 * Created by victor on 05/06/15.
 */

var util = require('util');
var DependencyComponent = require('./dependencyComponent');

function DependencyComposite(name, dependency) {
  DependencyComponent.call(this, name, dependency);
  this.dependencies = [];
}

util.inherits(DependencyComposite, DependencyComponent);

DependencyComposite.prototype.getDependenciesCount = function() {
  return this.dependencies.length;
};

DependencyComposite.prototype.addDependency = function(dependency) {
  if (dependency.getName() == this.getName()) {
    throw new Error("Failed to resolve '" + this.getName() + "': it cannot depend on itself");
  }
  this.dependencies.push(dependency);
  return this;
};

DependencyComposite.prototype.hasDependencies = function() {
  return this.getDependenciesCount() > 0;
};

DependencyComposite.prototype.getDependencies = function() {
  return this.dependencies;
};

DependencyComposite.prototype.getResolvedInstance = function(theDependencies) {
  var factory = this.getDependency();
  var resolvedDependencies = this.getDependencies().map(function(dependencyComponent){
    var dependency = theDependencies[dependencyComponent.getName()];
    if (!dependency) {
      dependency = dependencyComponent.getResolvedInstance(theDependencies);
      theDependencies[dependency.getName()] = dependency;
    }
    return dependency;
  });
  var instance = factory.apply(null, resolvedDependencies);
  return instance;
};

DependencyComposite.prototype.accept = function(visitor) {
  visitor.raiseIfCompositeHasAlreadyBeenVisited(this);

  this.dependencies.forEach(function(dependencyComponent){
    dependencyComponent.accept(visitor);
  });

  visitor.visitComposite(this);
};

module.exports = DependencyComposite;

