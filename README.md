# simple-di-container
Simple Dependency Injection Container for Node.js

Simple DI Container is an easy-to-use Dependency Injection container for Node.js inspired by [SimpleInjector](https://simpleinjector.org/index.html)

# Installation
```
$ npm install simple-di-container
```

# Usage
Below is an example that shows and explains how Simple Dependency Injection Container should be used.

Please note the 'register' and 'registerSingle' methods - which allows you to support both singleton and new instances:
* registerSingle: creates a single instance of the module for the whole lifetime of your application
* register: creates and returns a new instance of the module for each call to the 'get' method

### Given the following 3 modules:

```javascript
module.exports = function() {
  var obj = {};
  obj.name = "depA";
  return obj;
};
```

```javascript
module.exports = function() {
  var obj = {};
  obj.name = "depA";
  return obj;
};
```

```javascript
module.exports = function(depA, val1) {
  var obj = {};
  obj.depA = depA;
  obj.val1 = val1;
  obj.name = "depB";
  return obj;
};
```

```javascript
module.exports = function(depA, depB, strVal) {
  var obj = {};
  obj.depA = depA;
  obj.depB = depB;
  obj.strVal = strVal;
  obj.name = "depC";
  return obj;
};
```

### When you register your dependencies:

```javascript
// Get a reference to the DI Container:
var diContainer = require('./lib/diContainer');

// Get your dependencies:
var depA = require('./depA');
var depB = require('./depB');
var depC = require('./depC');

// Register your dependencies:

// Use 'registerSingle' for singleton dependencies:
diContainer.registerSingle("depA", depA);

// Use 'register' to get a new instance of your dependencies:
diContainer.register("depB", depB);

diContainer.registerSingle("depC", depC);
diContainer.register("strVal", "some value");
diContainer.registerSingle("val1", 1);

// After registering all your dependencies, call the 'verify' method.
// 'verify' throws an exception for circular dependencies or for missing dependencies
diContainer.verify();
```

### Then you should easily be able to get the desired instance:
```javascript

// Gets singleton instance for depA
var depA = diContainer.get("depA");
// Gets new instance of depB, for each call to diContainer.get("depB")
var depB = diContainer.get("depB");
var depC = diContainer.get("depC");
var strVal = diContainer.get("strVal");
var val1 = diContainer.get("val1");
```

*et voilà* - :tada:
It's really that simple... and easy!

