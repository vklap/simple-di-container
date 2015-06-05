/**
 * Created by victor on 05/06/15.
 */



var dependency;
var name;

function DependencyComponent(aName, aDependency) {
  name = aName;
  dependency = aDependency;
}

DependencyComponent.prototype.getName = function() {
  return name;
};

DependencyComponent.prototype.getDependency = function() {
  return dependency;
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