'use strict';
angular.module('keep')
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
