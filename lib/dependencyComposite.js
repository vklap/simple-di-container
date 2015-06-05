/**
 * Created by victor on 05/06/15.
 */

var util = require('util');
var DependencyComponent = require('./dependencyComponent');

var dependencies = [];

function DependencyComposite(name, dependency) {
  DependencyComponent.call(this, name, dependency);
}

util.inherits(DependencyComposite, DependencyComponent);

DependencyComposite.prototype.getDependenciesCount = function() {
  return dependencies.length;
};

DependencyComposite.prototype.addDependency = function(dependency) {
  dependency.push(dependency);
  return this;
};

DependencyComposite.prototype.hasDependencies = function() {
  return this.getDependenciesCount() > 0;
};

DependencyComposite.prototype.getDependencies = function() {
  return dependencies;
};

DependencyComposite.prototype.getResolvedInstance = function(theDependencies) {
  var factory = this.getDependency();
  var resolvedDependencies = this.getDependencies().map(function(dependencyComponent){
    return dependencyComponent.getResolvedInstance(theDependencies);
  });
  return factory.apply(null, resolvedDependencies);
};

DependencyComposite.prototype.accept = function(visitor) {
  visitor.raiseIfCompositeHasAlreadyBeenVisited(this);

  dependencies.forEach(function(dependencyComponent){
    dependencyComponent.accept(visitor);
  });

  visitor.visitComposite(this);
};

module.exports = DependencyComposite;

