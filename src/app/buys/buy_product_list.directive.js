'use strict';

angular.module('kassa')
.directive('buyProductList', function($firebase, Firebase, FirebaseRootUrl, Basket){

  var buyProductListCtrl = function(){
    this.products = $firebase(new Firebase(FirebaseRootUrl + '/products/')).$asArray();
  };

  buyProductListCtrl.prototype.basket = Basket;

  buyProductListCtrl.prototype.remove = function(obj, property){
    delete obj[property];
  };

  return {
    scope: {},
    templateUrl: '/app/buys/buy_product_list.html',
    controller: buyProductListCtrl,
    controllerAs: 'ctrl'
  };
});
