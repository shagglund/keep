'use strict';

angular.module('kassa')
.directive('accountList', function(Account){
  var accountListCtrl = function(){
    this.accounts = Account.accounts;
  };

  return {
    templateUrl: '/app/accounts/account_list.html',
    controller: accountListCtrl,
    controllerAs: 'ctrl'
  };
});
