'use strict';

angular.module('kassa')
.directive('buyList', function($firebase, Firebase, FirebaseRootUrl){

  var buyListCtrl = function(){
    this.buys = $firebase(new Firebase(FirebaseRootUrl + '/buys/')).$asArray();
    this.buyers = $firebase(new Firebase(FirebaseRootUrl + '/accounts/')).$asArray();
    this.products = $firebase(new Firebase(FirebaseRootUrl + '/products/')).$asArray();
  };

  return {
    scope: {},
    templateUrl: '/app/buys/buy_list.html',
    controller: buyListCtrl,
    controllerAs: 'ctrl'
  };
});