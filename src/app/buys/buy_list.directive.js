'use strict';

angular.module('kassa')
.directive('buyList', function($firebase, Firebase, FirebaseRootUrl, Buy){
  var buyListCtrl = function(){
    this.buys = $firebase(new Firebase(FirebaseRootUrl + '/buys/').limitToLast(25)).$asArray();
    this.buyers = $firebase(new Firebase(FirebaseRootUrl + '/accounts/')).$asArray();
    this.products = $firebase(new Firebase(FirebaseRootUrl + '/products/')).$asArray();
  };

  buyListCtrl.prototype.canDelete = Buy.canDelete;

  buyListCtrl.prototype.remove = Buy.delete;

  return {
    scope: {},
    templateUrl: '/app/buys/buy_list.html',
    controller: buyListCtrl,
    controllerAs: 'ctrl'
  };
});
