'use strict';

angular.module('kassa')
.directive('account', function(
  $q,
  $state,
  $stateParams,
  Account,
  Message){

  var CREATE_SUCCESS_MSG = 'Account created successfully',
    UPDATE_SUCCESS_MSG = 'Account updated successfully',
    CREATE_FAIL_MSG = 'Account create failed: ',
    UPDATE_FAIL_MSG = 'Account update failed: ',
    BALANCE_SUCCESS_MSG = 'Balance changed successfully',
    BALANCE_FAIL_MSG = 'Balance change failed';


  function createOrUpdate(ctrl, account, create){
    var promise = null;

    if (create) {
      promise = Account.create(account);
    } else {
      promise = Account.update(account);
    }

    ctrl.saving = true;

    return promise.then(function(){
      Message.success(create ? CREATE_SUCCESS_MSG : UPDATE_SUCCESS_MSG);
    }, function(error){
      Message.error((create ? CREATE_FAIL_MSG : UPDATE_FAIL_MSG) +  error);
    }).finally(function(){
      ctrl.saving = false;
    });
  }

  var accountCtrl = function(){
    if (angular.isDefined($stateParams.accountId)) {
      var self = this;
      this.accounts = Account.accounts;
      this.accounts.$loaded(function(){
        self.account = self.accounts.$getRecord($stateParams.accountId);
        self.balanceChanges = Account.getBalanceChanges(self.account);
      });
    } else {
      this.account = {};
    }
  };

  accountCtrl.prototype.save = function(account){
    var isCreate = angular.isUndefined(account.$id);
    createOrUpdate(this, account, isCreate).then(function(){
      $state.go('root.accounts');
    });
  };

  accountCtrl.prototype.cancel = function(){
    $state.go('root.accounts');
  };

  //Note: Only usable in update context
  accountCtrl.prototype.changeBalance = function(account, change){
    var self = this;

    return Account.changeBalance(account, change)
      .then(function(){
        self.change = {};
        Message.success(BALANCE_SUCCESS_MSG);
      }, function(error){
        Message.error(BALANCE_FAIL_MSG + error);
      });
  };

  return {
    templateUrl: '/app/accounts/account.html',
    controller: accountCtrl,
    controllerAs: 'ctrl'
  };
});
