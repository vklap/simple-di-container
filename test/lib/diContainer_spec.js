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

  describe("Self singleton dependency", function(){
    beforeEach(function() {
      diContainer.registerSingle("depF", depF);
    });

    it("verify should throw", function() {
      expect(function() {
        diContainer.verify();
      }).toThrow(/Failed to resolve 'depF': it cannot depend on itself/);
    });
  });

  describe("Circular singleton dependencies", function(){
    beforeEach(function() {
      diContainer.registerSingle("depD", depD);
      diContainer.registerSingle("depE", depE);
    });

    it("verify should throw", function() {
      expect(function() {
        diContainer.verify();
      }).toThrow(/Failed to resolve 'depD': A circular dependency exists between 'depD' and 'depE'/);
    });
  });

  describe('Valid singleton dependencies', function() {

    beforeEach(function() {
      diContainer.registerSingle("depA", depA);
      diContainer.registerSingle("depB", depB);
      diContainer.registerSingle("depC", depC);
      diContainer.registerSingle("strVal", "some value");
      diContainer.registerSingle("val1", 1);
    });

    it('verify should succeed', function(){
      expect(function() {
        diContainer.verify()
      }).toNotThrow();
    });

    it('should return val1', function() {
      diContainer.verify();

      var result1 = diContainer.get("depA");
      var result2 = diContainer.get("depA");

      expect(result1.name).toEqual("depA");
      expect(result2.name).toEqual("depA");
      expect(result1).toBe(result2);
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

      var result1 = diContainer.get("depC");
      var result2 = diContainer.get("depC");

      expect(result1.name).toEqual("depC");
      expect(result1.strVal).toEqual("some value");
      expect(result1.depA.name).toEqual("depA");
      expect(result1.depB.name).toEqual("depB");
      expect(result1).toBe(result2);
    });
  });

  describe("Self instance dependency", function(){
    beforeEach(function() {
      diContainer.register("depF", depF);
    });

    it("verify should throw", function() {
      expect(function() {
        diContainer.verify();
      }).toThrow(/Failed to resolve 'depF': it cannot depend on itself/);
    });
  });

  describe("Circular instance dependencies", function(){
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

  describe('Valid instance dependencies', function() {

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

      var result1 = diContainer.get("depA");
      var result2 = diContainer.get("depA");

      expect(result1.name).toEqual("depA");
      expect(result2.name).toEqual("depA");
      expect(result1).toNotBe(result2);
    });

    it('should return depB', function() {
      diContainer.verify();

      var result = diContainer.get("depB");

      expect(result.name).toEqual("depB");
    });

    it('should return depC', function() {
      diContainer.verify();

      var result1 = diContainer.get("depC");
      var result2 = diContainer.get("depC");

      expect(result1.name).toEqual("depC");
      expect(result1.strVal).toEqual("some value");
      expect(result1.depA.name).toEqual("depA");
      expect(result1.depB.name).toEqual("depB");
      expect(result1).toNotBe(result2);
    });
  });



  describe('Valid mixed dependencies - with scenario 1', function() {

    beforeEach(function() {
      diContainer.register("depA", depA);
      diContainer.registerSingle("depB", depB);
      diContainer.register("depC", depC);
      diContainer.registerSingle("strVal", "some value");
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

      var result1 = diContainer.get("depA");
      var result2 = diContainer.get("depA");

      expect(result1.name).toEqual("depA");
      expect(result2.name).toEqual("depA");
      expect(result1).toNotBe(result2);
    });

    it('should return depB', function() {
      diContainer.verify();

      var result = diContainer.get("depB");

      expect(result.name).toEqual("depB");
    });

    it('should return depC', function() {
      diContainer.verify();

      var result1 = diContainer.get("depC");
      var result2 = diContainer.get("depC");

      expect(result1.name).toEqual("depC");
      expect(result1.strVal).toEqual("some value");
      expect(result1.depA.name).toEqual("depA");
      expect(result1.depB.name).toEqual("depB");
      expect(result1).toNotBe(result2);
    });
  });


  describe('Valid mixed dependencies - with scenario 2', function() {

    beforeEach(function() {
      diContainer.registerSingle("depA", depA);
      diContainer.register("depB", depB);
      diContainer.registerSingle("depC", depC);
      diContainer.register("strVal", "some value");
      diContainer.registerSingle("val1", 1);
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

      var result1 = diContainer.get("depA");
      var result2 = diContainer.get("depA");

      expect(result1.name).toEqual("depA");
      expect(result2.name).toEqual("depA");
      expect(result1).toBe(result2);
    });

    it('should return depB', function() {
      diContainer.verify();

      var result = diContainer.get("depB");

      expect(result.name).toEqual("depB");
    });

    it('should return depC', function() {
      diContainer.verify();

      var result1 = diContainer.get("depC");
      var result2 = diContainer.get("depC");

      expect(result1.name).toEqual("depC");
      expect(result1.strVal).toEqual("some value");
      expect(result1.depA.name).toEqual("depA");
      expect(result1.depB.name).toEqual("depB");
      expect(result1).toBe(result2);
    });
  });
});