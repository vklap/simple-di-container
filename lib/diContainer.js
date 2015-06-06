/**
 * Created by victor on 05/06/15.
 */
var argsList = require('args-list');

var DependencyComposite = require('./dependencyComposite');
var DependencyLeaf = require('./dependencyLeaf');
var ResolveAndFillDependenciesVisitor = require('./resolveAndFillDependenciesVisitor');

var DependencyInjectionContainer = function() {
  this.dependencies = {};
  this.registeredDependencies = {};
}


DependencyInjectionContainer.prototype = {
    register: function(name, dep) {
      if (this.verified) {
        throw new Error("DI container does not support calls to register method after verify method was called")
      }
      this.registeredDependencies[name] = dep;
    },
    verify: function() {
      var self = this;
      self.verified = false;
      self.dependencies = {};

      var instanceNameToDependencyNamesMap = createDependenciesMap(self.registeredDependencies);
      var componentNameToComponentDependenciesMap = createComponentsMap(self.registeredDependencies, instanceNameToDependencyNamesMap);

      var componentNames = Object.keys(componentNameToComponentDependenciesMap);
      componentNames.forEach(function(componentName) {
        var visitor = new ResolveAndFillDependenciesVisitor(componentName, self.dependencies);
        var component = componentNameToComponentDependenciesMap[componentName];
        component.accept(visitor);
      });

      this.verified = true;
    },
    get: function(name) {
      if (!this.verified) {
        throw new Error("Cannot get instances because DI container is not verified. Please call the verify method before calling the get method")
      }
      var dependency = this.dependencies[name];
      if (!dependency) {
        throw new Error('Cannot find module: ' + name);
      }
      return dependency;
    },
    clear: function() {
      this.dependencies = {};
      this.registeredDependencies = {};
      this.verified = false;
    }
};


function throwMissingDependency(instanceName, dependencyName) {
  throw new Error("Cannot find dependency '" + dependencyName + "' for instance '" + dependencyName + "'");
}

function createDependenciesMap(registeredDependencies) {
  var instanceNameToDependencyNamesMap = {};
  var dependencyNames = Object.keys(registeredDependencies);
  dependencyNames.forEach(function(instanceName) {
    var dependency = registeredDependencies[instanceName];

    if (!instanceNameToDependencyNamesMap[instanceName]) {
      instanceNameToDependencyNamesMap[instanceName] = [];
    }

    if (typeof dependency === "function") {
      var args = argsList(dependency);
      args.forEach(function(dependencyName) {
        if (!registeredDependencies[dependencyName]) {
          throwMissingDependency(instanceName, dependencyName);
        }
        instanceNameToDependencyNamesMap[instanceName].push(dependencyName);
      });
    }
  });
  return instanceNameToDependencyNamesMap;
}

function createComponentsMap(registeredDependencies, instanceNameToDependencyNamesMap) {

  var componentNameToComponentDependenciesMap = {};
  var instanceNames = Object.keys(instanceNameToDependencyNamesMap);
  instanceNames.forEach(function(instanceName) {
    var instanceDependencies = instanceNameToDependencyNamesMap[instanceName];
    var component = componentNameToComponentDependenciesMap[instanceName];

    // Add current instance to map
    if (!component) {
      if (instanceDependencies.length == 0) {
        component = new DependencyLeaf(instanceName, registeredDependencies[instanceName]);
      }
      else {
        component = new DependencyComposite(instanceName, registeredDependencies[instanceName]);
      }
      componentNameToComponentDependenciesMap[instanceName] = component;
    }

    // Add direct instance dependencies to map
    if (instanceDependencies.length > 0) {
      instanceDependencies.forEach(function(dependencyName) {
        var dependencyDependencies = instanceNameToDependencyNamesMap[dependencyName];
        var dependencyComponent = componentNameToComponentDependenciesMap[dependencyName];
        if (!dependencyComponent) {
          if (dependencyDependencies.length == 0) {
            dependencyComponent = new DependencyLeaf(dependencyName, registeredDependencies[dependencyName]);
          }
          else {
            dependencyComponent = new DependencyComposite(dependencyName, registeredDependencies[dependencyName]);
          }
          componentNameToComponentDependenciesMap[dependencyName] = dependencyComponent;
        }
        component.addDependency(dependencyComponent);
      });
    }
  });

  return componentNameToComponentDependenciesMap;
}

var diContainer = new DependencyInjectionContainer();

module.exports = diContainer;