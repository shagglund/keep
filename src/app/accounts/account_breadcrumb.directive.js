'use strict';

angular.module('keep')
.directive('accountBreadcrumb', function($stateParams, Account){
  var accountBreadcrumbCtrl = function(){
    var self = this;
    if ($stateParams.accountId) {
      Account.onAccounts(function(accounts){
        self.account = accounts.$getRecord($stateParams.accountId);
      });
    }
  };

  return {
    templateUrl: 'app/accounts/account_breadcrumb.html',
    controller: accountBreadcrumbCtrl,
    controllerAs: 'ctrl'
  };
});
