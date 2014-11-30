'use strict';

angular.module('keep')
.directive('accountList', function(Account){
  var accountListCtrl = function(){
    var self = this;
    Account.onAccounts(function(accounts){
      self.accounts = accounts;
    });
  };

  return {
    templateUrl: 'app/accounts/account_list.html',
    controller: accountListCtrl,
    controllerAs: 'ctrl'
  };
});
