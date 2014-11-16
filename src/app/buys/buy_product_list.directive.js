'use strict';

angular.module('kassa')
.directive('buyProductList', function(Product, Basket){

  var buyProductListCtrl = function(){
    this.products = Product.products;
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
