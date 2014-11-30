'use strict';

angular.module('kassa')
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
