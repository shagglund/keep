'use strict';

angular.module('kassa')
.directive('account', function(
  $q,
  $state,
  $stateParams,
  $firebase,
  $firebaseSimpleLogin,
  Firebase,
  FirebaseRootUrl,
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
      account.createdAt = Firebase.ServerValue.TIMESTAMP;
      account.updatedAt = Firebase.ServerValue.TIMESTAMP;
      account.balance = 0;
      account.buyCount = 0;
      var authenticator = $firebaseSimpleLogin(new Firebase(FirebaseRootUrl));
      //use default as a password placeholder until user is created -> resets password right after
      promise = authenticator.$createUser(account.email, 'default').then(function(authData){
        account.identifiers = {};
        account.identifiers[authData.user.uid] = authData.user.email;
        //reset and send a new password link to act as an auto generated password & email validation
        authenticator.$sendPasswordResetEmail(authData.user.email);
        return ctrl._firebase.$push(account);
      });
    } else {
      account.updatedAt = Firebase.ServerValue.TIMESTAMP;
      promise = account.$save();
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
    var accountCollectionRef = new Firebase(FirebaseRootUrl + '/accounts/');
    if (angular.isDefined($stateParams.id)) {
      var accountRef = accountCollectionRef.child($stateParams.id);
      this.accounts = $firebase(accountCollectionRef).$asArray();
      this._firebase = $firebase(accountRef);
      this.account = this._firebase.$asObject();
      this.balanceChanges = $firebase(new Firebase(FirebaseRootUrl + '/balanceChanges/' + $stateParams.id)).$asArray();
    } else {
      this._firebase = $firebase(accountCollectionRef);
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
  accountCtrl.prototype.changeBalance = function(balanceChanges, change){
    var self = this;
    change.createdAt = Firebase.ServerValue.TIMESTAMP;
    this._firebase.$transaction(function(account){
      account.balance = account.balance + change.amount;
      account.updatedAt = Firebase.ServerValue.TIMESTAMP;
      return account;
    })
    .then(function(){
      return balanceChanges.$add(change);
    })
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
