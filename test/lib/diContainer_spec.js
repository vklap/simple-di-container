/**
 * Created by victor on 06/06/15.
 */

var expect = require('expect');
var diContainer = require('../../lib/diContainer');

var depA = require('../fixtures/depA');
var depB = require('../fixtures/depB');
var depC = require('../fixtures/depC');
var depD = require('../fixtures/depD');
var depE = require('../fixtures/depE');
var depF = require('../fixtures/depF');


describe("diContainer", function() {
  beforeEach(function() {
    diContainer.clear();
  });

  describe("Self Dependency", function(){
    beforeEach(function() {
      diContainer.register("depF", depF);
    });

    it("verify should throw", function() {
      expect(function() {
        diContainer.verify();
      }).toThrow(/Failed to resolve 'depF': it cannot depend on itself/);
    });
  });

  describe("Circular Dependencies", function(){
    beforeEach(function() {
      diContainer.register("depD", depD);
      diContainer.register("depE", depE);
    });

    it("verify should throw", function() {
      expect(function() {
        diContainer.verify();
      }).toThrow(/Failed to resolve 'depD': A circular dependency exists between 'depD' and 'depE'/);
    });
  });

  describe('Valid dependencies', function() {

    beforeEach(function() {
      diContainer.register("depA", depA);
      diContainer.register("depB", depB);
      diContainer.register("depC", depC);
      diContainer.register("strVal", "some value");
      diContainer.register("val1", 1);
    });

    it('verify should succeed', function(){
      expect(function() {
        diContainer.verify()
      }).toNotThrow();
    });

    it('should return val1', function() {
      diContainer.verify();

      var result = diContainer.get("val1");

      expect(result).toEqual(1);
    });

    it('should return depA', function() {
      diContainer.verify();

      var result = diContainer.get("depA");

      expect(result.name).toEqual("depA");
    });

    it('should return depB', function() {
      diContainer.verify();

      var result = diContainer.get("depB");

      expect(result.name).toEqual("depB");
    });

    it('should return depC', function() {
      diContainer.verify();

      var result = diContainer.get("depC");

      expect(result.name).toEqual("depC");
      expect(result.strVal).toEqual("some value");
      expect(result.depA.name).toEqual("depA");
      expect(result.depB.name).toEqual("depB");
    });
  });
});