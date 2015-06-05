/**
 * Created by victor on 06/06/15.
 */



var dependencies;
var instanceName;
var visitedComposites;
var lastVisitedCompositeName = null;

function ResolveAndFillDependenciesVisitor(theInstanceName, theDependencies) {
  instanceName = theInstanceName;
  dependencies = theDependencies;
  visitedComposites = {};
}

ResolveAndFillDependenciesVisitor.prototype.visitLeaf = function(component) {
  dependencies[component.getName()] = component.getResolvedInstance();
};

ResolveAndFillDependenciesVisitor.prototype.visitComposite = function(component) {
  lastVisitedCompositeName = component.getName();
  visitedComposites[lastVisitedCompositeName] = true;
  if (!dependencies[component.getName()]) {
    dependencies[component.getName()] = component.getResolvedInstance(dependencies)
  }
};


ResolveAndFillDependenciesVisitor.prototype.raiseIfCompositeHasAlreadyBeenVisited = function(component) {
  if (visitedComposites[component.getName()]) {
    throw new Error("Failed to resolve '" + instanceName + "': A circular dependency exists between '" + lastVisitedCompositeName + "' and '" + component.getName() + "'");
  }
};

module.exports = ResolveAndFillDependenciesVisitor;