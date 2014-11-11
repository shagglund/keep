'use strict';

angular.module('kassa')
.filter('first', function(){
  return function(array, property){
    if (angular.isUndefined(array)) { return array; }
    if (array.length === 0) { return null; }
    return array[0][property];
  };
});