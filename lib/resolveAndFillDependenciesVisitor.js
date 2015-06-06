/**
 * Created by victor on 06/06/15.
 */




function ResolveAndFillDependenciesVisitor(theInstanceName, theDependencies) {
  this.lastVisitedCompositeName = null;
  this.instanceName = theInstanceName;
  this.dependencies = theDependencies;
  this.visitedComposites = {};
}

ResolveAndFillDependenciesVisitor.prototype.visitLeaf = function(component) {
  this.dependencies[component.getName()] = component.getResolvedInstance();
};

ResolveAndFillDependenciesVisitor.prototype.visitComposite = function(component) {
  this.lastVisitedCompositeName = component.getName();
  this.visitedComposites[this.lastVisitedCompositeName] = true;
  if (!this.dependencies[component.getName()]) {
    this.dependencies[component.getName()] = component.getResolvedInstance(this.dependencies)
  }
};


ResolveAndFillDependenciesVisitor.prototype.raiseIfCompositeHasAlreadyBeenVisited = function(component) {
  if (this.visitedComposites[component.getName()]) {
    throw new Error("Failed to resolve '" + this.instanceName + "': A circular dependency exists between '" + this.lastVisitedCompositeName + "' and '" + component.getName() + "'");
  }
};

module.exports = ResolveAndFillDependenciesVisitor;