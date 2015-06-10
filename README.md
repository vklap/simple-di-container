# simple-di-container
Simple Dependency Injection Container for Node.js

Simple DI Container is an easy-to-use Dependency Injection container for Node.js inspired by [SimpleInjector](https://simpleinjector.org/index.html)

# Installation
```
$ npm install simple-di-container
```

# Usage

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
var diContainer = require('./lib/diContainer');
var depA = require('./depA');
var depB = require('./depB');
var depC = require('./depC');



```