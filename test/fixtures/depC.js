/**
 * Created by victor on 06/06/15.
 */

module.exports = function(depA, depB, strVal) {
  var obj = {};
  obj.depA = depA;
  obj.depB = depB;
  obj.strVal = strVal;
  obj.name = "depC";
  return obj;
};