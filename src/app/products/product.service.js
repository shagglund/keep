'use strict';

angular.module('kassa')
.service('Product', function($firebase, Firebase, FirebaseRootUrl){
  var products = $firebase(new Firebase(FirebaseRootUrl + '/products')).$asArray();

  return {
    products: products,
    create: function(product){
      product.createdAt = Firebase.ServerValue.TIMESTAMP;
      product.updatedAt = Firebase.ServerValue.TIMESTAMP;
      product.buyCount = 0;
      return products.$add(product);
    },
    update: function(product){
      product.updatedAt = Firebase.ServerValue.TIMESTAMP;
      return products.$save(product);
    },
  };
});
