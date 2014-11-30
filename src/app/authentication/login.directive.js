'use strict';

angular.module('keep')
.directive('login', function($location, Authentication, Message){
  return {
    scope: {},
    templateUrl: 'app/authentication/login.html',
    link: function($scope){
      $scope.login = function(email, password){
        $scope.sending = true;
        return Authentication.$authWithPassword({
          email: email,
          password: password
        }).then(function(){
          var search = $location.search(),
            next = search.next;
          delete search.next;

          $location.search(search);
          $location.path(next || '/buy');
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
