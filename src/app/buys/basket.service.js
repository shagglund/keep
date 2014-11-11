'use strict';

angular.module('kassa')
.service('Basket', function($q, $firebase, Firebase, FirebaseRootUrl){
  var firebase = $firebase(new Firebase(FirebaseRootUrl + '/buys')),
    productCollectionFirebase = $firebase(new Firebase(FirebaseRootUrl + '/products')),
    products = productCollectionFirebase.$asArray(),
    accountCollectionFirebase = $firebase(new Firebase(FirebaseRootUrl + '/accounts')),
    accounts = accountCollectionFirebase.$asArray();

  function calculateNewBalance(account, total){
    return account.balance - total;
  }

  return {
    buyerId: null,
    products: {},
    buy: function(){
      var self = this,
        buy = {
          buyerId: this.buyerId,
          products: this.products
        };

      return $firebase(accountCollectionFirebase.$ref().child(this.buyerId)).$transaction(function(account){
        account.balance = calculateNewBalance(account, self.total());
        account.buyCount += 1;
        account.lastBuyAt = Firebase.ServerValue.TIMESTAMP;
        return account;
      }).then(function(){
        return productCollectionFirebase.$transaction(function(products){
          angular.forEach(products, function(product, productId){
            if (self.products[productId]){
              product.buyCount = product.buyCount + self.products[productId];
              product.lastBoughtAt = Firebase.ServerValue.TIMESTAMP;
              console.log(product, self.products[productId]);
            }
          });
          return products;
        });
      }).then(function(){
        return firebase.$push(buy);
      });
    },
    reset: function(){
      this.products = {};
      this.buyerId = null;
    },
    isEmpty: function(){
      return Object.keys(this.products).length === 0;
    },
    getResolvedBuyer: function(){
      return accounts.$getRecord(this.buyerId);
    },
    getResolvedProduct: function(productId){
      return products.$getRecord(productId);
    },
    total: function(){
      var self = this;
      return products
        .filter(function(product){ return angular.isDefined(self.products[product.$id]); })
        .map(function(product){ return product.price * self.products[product.$id]; })
        .reduce(function(total, price){ return total + price; }, 0);
    },
    getNewBalance: function(){
      if (this.buyerId && !this.isEmpty()){
        return calculateNewBalance(this.getResolvedBuyer(), this.total());
      }
    }

  };
});
