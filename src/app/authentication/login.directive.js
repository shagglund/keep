'use strict';

angular.module('kassa')
.directive('login', function($location, $firebaseSimpleLogin, Firebase, FirebaseRootUrl, Message){
  var authenticator = $firebaseSimpleLogin(new Firebase(FirebaseRootUrl));

  return {
    scope: {},
    templateUrl: '/app/authentication/login.html',
    link: function($scope){
      $scope.login = function(email, password){
        $scope.sending = true;
        return authenticator.$login('password', {
          email: email,
          password: password
        }).then(function(){
          var search = $location.search(),
            next = search.next;
          delete search.next;

          $location.search(search);
          $location.path(next || '');
        }, function(error){
          Message.error('Login failed: ' + error);
        })
        .finally(function(){
          $scope.sending = false;
        });
      };
    }
  };
});
