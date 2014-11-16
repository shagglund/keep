'use strict';

angular.module('kassa')
.service('Account', function(
  $firebase,
  $firebaseSimpleLogin,
  Firebase,
  FirebaseRootUrl){

  var accounts = $firebase(new Firebase(FirebaseRootUrl + '/accounts/')).$asArray(),
    authenticator = $firebaseSimpleLogin(new Firebase(FirebaseRootUrl));

  return {
    accounts: accounts,
    create: function(account){
      account.createdAt = Firebase.ServerValue.TIMESTAMP;
      account.updatedAt = Firebase.ServerValue.TIMESTAMP;
      account.balance = 0;
      account.buyCount = 0;

      //use default as a password placeholder until user is created -> resets password right after
      return authenticator.$createUser(account.email, 'default').then(function(authData){
        account.identifiers = {};
        account.identifiers[authData.user.uid] = authData.user.email;
        //reset and send a new password link to act as an auto generated password & email validation
        authenticator.$sendPasswordResetEmail(authData.user.email);
        return accounts.$add(account);
      });
    },
    update: function(account){
      account.updatedAt = Firebase.ServerValue.TIMESTAMP;
      return accounts.$save(account);
    },
    getBalanceChanges: function(account){
      return $firebase(new Firebase(FirebaseRootUrl + '/balanceChanges/' + account.$id)).$asArray();
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
    }
  };
});
