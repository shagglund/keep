'use strict';

angular.module('kassa')
.directive('accountList', function(Firebase, FirebaseRootUrl, $firebase){
  var accountListCtrl = function(){
    this.accounts = $firebase(new Firebase(FirebaseRootUrl + '/accounts')).$asArray();
  };

  return {
    templateUrl: '/app/accounts/account_list.html',
    controller: accountListCtrl,
    controllerAs: 'ctrl'
  };
});