'use strict';

angular.module('keep')
.directive('logout', function($state, Authentication){
  return {
    scope: {},
    templateUrl: 'app/authentication/logout.html',
    replace: true,
    link: function($scope){
      $scope.logout = function(){
        Authentication.$unauth();
        return $state.go('auth.login');
      };
    }
  };
});
