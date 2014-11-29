'use strict';

angular.module('kassa')
.service('Account', function(
  $firebase,
  Authentication,
  Firebase,
  FirebaseRootUrl){

  var accounts = null,
    accountChangeCallbacks = [];

  var service = {
    current: null,
    create: function(account){
      account.createdAt = Firebase.ServerValue.TIMESTAMP;
      account.updatedAt = Firebase.ServerValue.TIMESTAMP;
      account.balance = 0;
      account.buyCount = 0;

      //use default as a password placeholder until user is created -> resets password right after
      return Authentication.$createUser(account.email, 'default').then(function(authData){
        account.identifiers = {};
        account.identifiers[authData.user.uid] = authData.user.email;
        //reset and send a new password link to act as an auto generated password & email validation
        Authentication.$sendPasswordResetEmail(authData.user.email);
        return accounts.$add(account);
      });
    },
    update: function(account){
      account.updatedAt = Firebase.ServerValue.TIMESTAMP;
      return accounts.$save(account);
    },
    getBalanceChanges: function(account){
      if (account) {
        return $firebase(new Firebase(FirebaseRootUrl + '/balanceChanges/' + account.$id)).$asArray();
      } else {
        return null;
      }
    },
    changeBalance: function(account, change){
      change.createdAt = Firebase.ServerValue.TIMESTAMP;

      return this.getBalanceChanges(account)
        .$add(change)
        .then(function(){
          account.balance = account.balance + change.amount;
          account.updatedAt = Firebase.ServerValue.TIMESTAMP;
          accounts.$save(account);
        });
    },
    onAccounts: function(cb){
      accountChangeCallbacks.push(cb);
      if (accounts) {
        cb(accounts);
      }
      return function(){
        accountChangeCallbacks.splice(accountChangeCallbacks.indexOf(cb),1);
      };
    }
  };

  Authentication.handleAuth(function(authData){
    if (authData) {
      accounts = $firebase(new Firebase(FirebaseRootUrl + '/accounts/')).$asArray();
      accounts.$loaded(function(resolvedAccounts){
        angular.forEach(resolvedAccounts, function(account){
          if (account.identifiers && account.identifiers[authData.uid]) {
            service.current = account;
          }
        });
        //notify accounts changed
        angular.forEach(accountChangeCallbacks, function(cb){ cb(accounts); });
      });
      service.accounts = accounts;
    } else {
      service.current = null;
    }
  });

  return service;
});
