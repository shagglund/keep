'use strict';

angular.module('kassa')
.service('Product', function($firebase, Authentication, Firebase, FirebaseRootUrl){
  var products = products,
    productCallbacks = [];

  Authentication.handleAuth(function(authData){
    if (authData) {
      products = $firebase(new Firebase(FirebaseRootUrl + '/products')).$asArray();
    } else {
      products = null;
    }
  });

  return {
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
    onProducts: function(cb){
      productCallbacks.push(cb);
      if (products) {
        cb(products);
      }
      return function(){
        productCallbacks.splice(productCallbacks.indexOf(cb), 1);
      };
    }
  };
});
