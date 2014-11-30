'use strict';

angular.module('keep')
.directive('currentAccount', function(Account){
  return {
    scope: {},
    templateUrl: 'app/authentication/current_account.html',
    replace: true,
    link: function($scope){
      $scope.account = Account;
    }
  };
});
