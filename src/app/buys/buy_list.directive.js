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
  buyListCtrl.prototype.buyAgain = function(buy){
    return Buy.create({ buyerId: buy.buyerId, products: buy.products });
  };

  return {
    scope: {},
    templateUrl: '/app/buys/buy_list.html',
    controller: buyListCtrl,
    controllerAs: 'ctrl'
  };
});
