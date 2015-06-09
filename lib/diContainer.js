/**
 * Created by victor on 05/06/15.
 */
var argsList = require('args-list');

function DependencyInjectionContainer() {
  var dependencies = {};
  var registeredDependencies = {};
  var singletons = {};
  var hasDependencies = {};
  var verified = false;

  function createObjectGraph() {
    return Object.keys(registeredDependencies).reduce(function (map, name) {
      map[name] = resolveDependency(name, registeredDependencies[name], map, {});
      return map;
    }, {});
  }

  function resolveDependency(name, factory, dependencies, visited) {
    if (singletons[name] && dependencies[name]) return dependencies[name];
    visited[name] = true;
    var depNames = argsList(factory);
    hasDependencies[name] = (depNames.length > 0);
    var deps = depNames.map(function (depName) {
      if (depName === name) throw new Error("Failed to resolve '" + depName + "': it cannot depend on itself");
      if (visited[depName] && hasDependencies[depName]) throw new Error("Failed to resolve '" + depName + "': A circular dependency exists between '" + depName + "' and '" + name + "'");
      var depFactory = registeredDependencies[depName];
      if (!depFactory) throw new Error("module: " + depName + " does not exist.");
      return resolveDependency(depName, depFactory, dependencies, visited);
    });

    dependencies[name] = typeof factory === "function" ? factory.apply(null, deps) : factory;
    return dependencies[name];
  }


  function throwIfNotVerified() {
    if (verified) {
      throw new Error("DI container does not support calls to registerSingle method after verify method was called")
    }
  }

  this.registerSingle = function(name, dep) {
    throwIfNotVerified();
    singletons[name] = true;
    registeredDependencies[name] = dep;
  };

  this.register = function(name, dep) {
    throwIfNotVerified();
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
    if (singletons[name]) {
      return dependency;
    }
    return resolveDependency(name, registeredDependencies[name], dependencies, {});
  };

  this.clear = function() {
    dependencies = {};
    registeredDependencies = {};
    singletons = {};
    hasDependencies = {};
    verified = false;
  }
}

var diContainer = new DependencyInjectionContainer();

module.exports = diContainer;