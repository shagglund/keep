'use strict';

angular.module('kassa')
.directive('resetPassword', function(Authentication){

  return {
    scope: {},
    templateUrl: '/app/authentication/reset_password.html',
    link: function($scope){
      $scope.reset = function(email){
        return Authentication.$sendPasswordResetEmail(email).then(function(){
          $scope.emailSent = true;
        });
      };
    }
  };
});
