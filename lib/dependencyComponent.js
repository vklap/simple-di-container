/**
 * Created by victor on 05/06/15.
 */




function DependencyComponent(aName, aDependency) {
  this.name = aName;
  this.dependency = aDependency;
}

DependencyComponent.prototype.getName = function() {
  return this.name;
};

DependencyComponent.prototype.getDependency = function() {
  return this.dependency;
};

DependencyComponent.prototype.getDependenciesCount = function() {
  return 0;
};

DependencyComponent.prototype.hasDependencies = function() {
  return false;
};

DependencyComponent.prototype.addDependency = function(dependency) {
  return this;
};

DependencyComponent.prototype.getDependencies = function() {
  return [];
};

DependencyComponent.prototype.getResolvedInstance = function(theDependencies) {
  return null;
};

DependencyComponent.prototype.accept = function(visitor) {

};


module.exports = DependencyComponent;