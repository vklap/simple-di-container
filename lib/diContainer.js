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