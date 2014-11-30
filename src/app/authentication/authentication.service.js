'use strict';

angular.module('keep')
.factory('Authentication', function($location, $state, $firebaseAuth, Firebase, FirebaseRootUrl){
  var authenticator = $firebaseAuth(new Firebase(FirebaseRootUrl)),
    authCallbacks = [],
    loadedAuth = authenticator.$getAuth();

  authenticator.$onAuth(function(authData){
    loadedAuth = authData;
    angular.forEach(authCallbacks, function(cb){ cb(authData); });
  });

  var AuthenticationService = function(){
    //singleton so bind all functions to this instance
    this.handleAuth = function(cb){
      authCallbacks.push(cb);
      cb(loadedAuth);
      return function(){
        authCallbacks.splice(authCallbacks.indexOf(cb),1);
      };
    };
  };
  //set prototype to firebase authenticator to allow transparent use of methods
  AuthenticationService.prototype = authenticator;

  var instance = new AuthenticationService();
  instance.handleAuth(function(authData){
    if (!authData) {
      $state.go('auth.login', {next: $location.path()});
    }
  });

  return instance;
});
