'use strict';

angular.module('kassa')
.directive('productList', function(Product){
  var productListCtrl = function(){
    this.products = Product.products;
  };

  return {
    templateUrl: '/app/products/product_list.html',
    controller: productListCtrl,
    controllerAs: 'ctrl'
  };
});
