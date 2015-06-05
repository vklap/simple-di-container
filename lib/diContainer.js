/**
 * Created by victor on 05/06/15.
 */
var argsList = require('args-list');

module.exports = function() {
  var dependencies = {};
  var factories = {};
  var diContainer = {};

  diContainer.factory = function (name, factory) {
    factories[name] = factory;
  };

  diContainer.register = function(name, dep) {
    dependencies[name] = dep;
  };

  diContainer.inject = function(factory) {
    var args = argsList(factory)
        .map(function(dependency) {
          return diContainer.get(dependency);
        });
    return factory.apply(null, args);
  };

  diContainer.get = function(name) {
    if (!dependencies[name]) {
      var factory = factories[name];
      dependencies[name] = factory && diContainer.inject(factory);
      if (!dependencies[name]) {
        throw new Error('Cannot find module: ' + name);
      }
    }

    return dependencies[name];
  };
}