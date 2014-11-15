'use strict';

angular.module('kassa')
.directive('logout', function($state, $firebaseSimpleLogin, Firebase, FirebaseRootUrl){
  var authenticator = $firebaseSimpleLogin(new Firebase(FirebaseRootUrl));

  return {
    scope: {},
    templateUrl: '/app/authentication/logout.html',
    replace: true,
    link: function($scope){
      $scope.logout = function(){
        authenticator.$logout();
        return $state.go('auth.login');
      };
    }
  };
});
