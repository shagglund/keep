'use strict';
angular.module('kassa')
.service('Message', function($window){
  return {
    error: function(msg){
      $window.alert(msg);
    },
    success: function(msg){
      $window.alert(msg);
    }
  };
});