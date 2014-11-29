'use strict';

angular.module('kassa')
.directive('buyProductList', function(Product, Basket){

  var buyProductListCtrl = function(){
    var self = this;
    Product.onProducts(function(products){
      self.products = products;
    });
  };

  buyProductListCtrl.prototype.basket = Basket;

  return {
    scope: {},
    templateUrl: '/app/buys/buy_product_list.html',
    controller: buyProductListCtrl,
    controllerAs: 'ctrl'
  };
});
