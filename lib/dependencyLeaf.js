/**
 * Created by victor on 05/06/15.
 */

var util = require('util');
var DependencyComponent = require('./dependencyComponent');

function DependencyLeaf(name, dependency) {
  DependencyComponent.call(this, name, dependency);
}

util.inherits(DependencyLeaf, DependencyComponent);

DependencyLeaf.prototype.getResolvedInstance = function(theDependencies) {
  var dependency = this.getDependency();
  if (typeof dependency == 'function') {
    return dependency.apply(null);
  }
  return this.getDependency();
};

DependencyLeaf.prototype.accept = function(visitor) {
  visitor.visitLeaf(this);

  return this;
};


module.exports = DependencyLeaf;