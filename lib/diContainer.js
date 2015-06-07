/**
 * Created by victor on 05/06/15.
 */
var argsList = require('args-list');

var DependencyComposite = require('./dependencyComposite');
var DependencyLeaf = require('./dependencyLeaf');
var ResolveAndFillDependenciesVisitor = require('./resolveAndFillDependenciesVisitor');


function DependencyInjectionContainer() {
  var dependencies = {};
  var registeredDependencies = {};
  var verified = false;

  var throwMissingDependency = function(instanceName, dependencyName) {
    throw new Error("Cannot find dependency '" + dependencyName + "' for instance '" + dependencyName + "'");
  };

  var createDependenciesMap = function(registeredDependencies) {
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
  };

  var createComponentsMap = function(registeredDependencies, instanceNameToDependencyNamesMap) {
    var componentNameToComponentDependenciesMap = {};

    function getOrCreateComponent(dependencyName) {
      var componentDependencies = instanceNameToDependencyNamesMap[dependencyName];
      var component = componentNameToComponentDependenciesMap[dependencyName];

      if (!component) {
        if (componentDependencies.length == 0) {
          component = new DependencyLeaf(dependencyName, registeredDependencies[dependencyName]);
        }
        else {
          component = new DependencyComposite(dependencyName, registeredDependencies[dependencyName]);
        }
        componentNameToComponentDependenciesMap[dependencyName] = component;
      }

      return component;
    }

    var instanceNames = Object.keys(instanceNameToDependencyNamesMap);
    instanceNames.forEach(function(instanceName) {
      var component = getOrCreateComponent(instanceName);

      // Add direct instance dependencies to map
      var componentDependencies = instanceNameToDependencyNamesMap[instanceName];

      componentDependencies.forEach(function(dependencyName) {
        var dependencyComponent = getOrCreateComponent(dependencyName);
        component.addDependency(dependencyComponent);
      });
    });

    return componentNameToComponentDependenciesMap;
  };

  this.register = function(name, dep) {
    if (verified) {
      throw new Error("DI container does not support calls to register method after verify method was called")
    }
    registeredDependencies[name] = dep;
  };

  this.verify = function() {
    verified = false;
    dependencies = {};

    var instanceNameToDependencyNamesMap = createDependenciesMap(registeredDependencies);
    var componentNameToComponentDependenciesMap = createComponentsMap(registeredDependencies, instanceNameToDependencyNamesMap);

    var componentNames = Object.keys(componentNameToComponentDependenciesMap);
    componentNames.forEach(function(componentName) {
      var visitor = new ResolveAndFillDependenciesVisitor(componentName, dependencies);
      var component = componentNameToComponentDependenciesMap[componentName];
      component.accept(visitor);
    });

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