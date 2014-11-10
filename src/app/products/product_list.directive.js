'use strict';

angular.module('kassa')
.directive('productList', function(Firebase, FirebaseRootUrl, $firebase){
  var productListCtrl = function(){
    this.products = $firebase(new Firebase(FirebaseRootUrl + '/products')).$asArray();
  };

  return {
    templateUrl: '/app/products/product_list.html',
    controller: productListCtrl,
    controllerAs: 'ctrl'
  };
});