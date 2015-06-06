/**
 * Created by victor on 06/06/15.
 */




function ResolveAndFillDependenciesVisitor(theInstanceName, theDependencies) {
  this.instanceName = theInstanceName;
  this.dependencies = theDependencies;
  this.visitedComposites = {};
}

ResolveAndFillDependenciesVisitor.prototype.visitLeaf = function(component) {
  this.dependencies[component.getName()] = component.getResolvedInstance();
};

ResolveAndFillDependenciesVisitor.prototype.visitComposite = function(component) {
  if (!this.dependencies[component.getName()]) {
    this.dependencies[component.getName()] = component.getResolvedInstance(this.dependencies)
  }
};

ResolveAndFillDependenciesVisitor.prototype.raiseIfCompositeHasAlreadyBeenVisited = function(component) {
  if (component.getName() == this.instanceName) {
    return;
  }

  if (this.visitedComposites[component.getName()]) {
    throw new Error("Failed to resolve '" + this.instanceName + "': A circular dependency exists between '" + this.instanceName + "' and '" + component.getName() + "'");
  }
  this.visitedComposites[component.getName()] = true;
};

module.exports = ResolveAndFillDependenciesVisitor;