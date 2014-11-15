'use strict';

angular.module('kassa')
.directive('resetPassword', function($location, $firebase, $firebaseSimpleLogin, Firebase, FirebaseRootUrl){
  var authenticator = $firebaseSimpleLogin(new Firebase(FirebaseRootUrl));

  return {
    scope: {},
    templateUrl: '/app/authentication/reset_password.html',
    link: function($scope){
      $scope.reset = function(email){
        return authenticator.$sendPasswordResetEmail(email).then(function(){
          $scope.emailSent = true;
        });
      };
    }
  };
});
