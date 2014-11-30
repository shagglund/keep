'use strict';

angular.module('keep')
.directive('resetPassword', function(Authentication){

  return {
    scope: {},
    templateUrl: 'app/authentication/reset_password.html',
    link: function($scope){
      $scope.sending = false;
      $scope.reset = function(email){
        $scope.sending = true;
        return Authentication.$sendPasswordResetEmail(email).then(function(){
          $scope.emailSent = true;
        })
        .finally(function(){
          $scope.sending = false;
        });
      };
    }
  };
});
