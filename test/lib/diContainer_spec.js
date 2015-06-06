/**
 * Created by victor on 06/06/15.
 */

var expect = require('expect');
var diContainer = require('../../lib/diContainer');

var depA = require('../fixtures/depA');
var depB = require('../fixtures/depB');

describe("diContainer", function() {
  //function depA() {
  //  return this;
  //};
  //
  //function depB(depA, val1) {
  //  this.depA = depA;
  //  this.val1 = val1;
  //  return this;
  //};

  beforeEach(function() {
    diContainer.clear();
  });

  describe('Valid dependencies', function() {

    beforeEach(function() {
      diContainer.register("depA", depA);
      diContainer.register("depB", depB);
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
  });
});