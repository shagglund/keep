'use strict';

angular.module('keep')
.directive('productList', function(Product){
  var productListCtrl = function(){
    var self = this;
    Product.onProducts(function(products){
      self.products = products;
    });
  };

  return {
    templateUrl: 'app/products/product_list.html',
    controller: productListCtrl,
    controllerAs: 'ctrl'
  };
});
