/**
 * Created by victor on 05/06/15.
 */
var argsList = require('args-list');

function DependencyInjectionContainer() {
  var dependencies = {};
  var registeredDependencies = {};
  var verified = false;

  function createObjectGraph() {
    function createSubtree(name, factory, dependencies, visited) {
      if (dependencies[name]) return dependencies[name];
      visited[name] = true;
      var depNames = argsList(factory);

      var deps = depNames.map(function (depName) {
        if (depName === name) throw new Error("Failed to resolve '" + depName + "': it cannot depend on itself");
        if (visited[depName]) throw new Error("Failed to resolve '" + depName + "': A circular dependency exists between '" + depName + "' and '" + name + "'");
        var depFactory = registeredDependencies[depName];
        if (!depFactory) throw new Error("module: " + depName + " does not exist.");
        return createSubtree(depName, depFactory, dependencies, visited);
      });

      dependencies[name] = typeof factory === "function" ? factory.apply(null, deps) : factory;
      return dependencies[name];
    }
    return Object.keys(registeredDependencies).reduce(function (map, name) {
      map[name] = createSubtree(name, registeredDependencies[name], map, {});
      return map;
    }, {});
  }

  this.register = function(name, dep) {
    if (verified) {
      throw new Error("DI container does not support calls to register method after verify method was called")
    }
    registeredDependencies[name] = dep;
  };

  this.verify = function() {
    verified = false;

    dependencies = createObjectGraph();

    verified = true;
  };

  this.get = function(name) {
    if (!verified) {
      throw new Error("Cannot get instances because DI container is not verified. Please call the verify method before calling the get method")
    }
    var dependency = dependencies[name];
    if (!dependency) {
      throw new Error('Cannot find module: ' + name);
    }
    return dependency;
  };

  this.clear = function() {
    dependencies = {};
    registeredDependencies = {};
    verified = false;
  }
}

var diContainer = new DependencyInjectionContainer();

module.exports = diContainer;