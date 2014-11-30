'use strict';

angular.module('kassa')
.directive('changePassword', function($state, $stateParams, Authentication, Message){
  return {
    scope: {},
    templateUrl: '/app/authentication/change_password.html',
    link: function($scope){
      $scope.email = $stateParams.email;
      $scope.oldPassword = $stateParams.password;

      $scope.change = function(email, oldPassword, newPassword){
        $scope.sending = true;
        return Authentication
          .$changePassword(email, oldPassword, newPassword)
          .then(function(){
            Authentication.$unauth();
            return Authentication.$authWithPassword({
              email: email,
              password: newPassword
            }).then(function(){
              $state.go('root.buy');
            }, function(error){
              Message.error('Login failed: ' + error);
            });
          }, function(error){
            Message.error('Change of password failed: ' + error);
          })
          .finally(function(){
            $scope.sending = false;
          });
      };
    }
  };
});
