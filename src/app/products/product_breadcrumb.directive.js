'use strict';

angular.module('kassa')
.directive('productBreadcrumb', function($stateParams, Product){
  var productBreadcrumbCtrl = function(){
    var self = this;
    if ($stateParams.productId) {
      Product.onProducts(function(products){
        self.product = products.$getRecord($stateParams.productId);
      });
    }
  };

  return {
    templateUrl: '/app/products/product_breadcrumb.html',
    controller: productBreadcrumbCtrl,
    controllerAs: 'ctrl'
  };
});
