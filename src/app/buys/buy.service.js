'use strict';

angular.module('kassa')
.service('Buy', function($q, $firebase, Firebase, FirebaseRootUrl){
  var DELETE_TIME_THRESHOLD = 5*60*1000, //5 minutes
    TYPE_CREATE = 1,
    TYPE_DELETE = 2;

  var firebase = $firebase(new Firebase(FirebaseRootUrl + '/buys')),
    products = $firebase(new Firebase(FirebaseRootUrl + '/products')).$asArray(),
    accounts = $firebase(new Firebase(FirebaseRootUrl + '/accounts')).$asArray();

  function productCount(buy){
    return Object.keys(buy.products)
            .map(function(key){ return buy.products[key]; })
            .reduce(function(sum, amount){ return sum + amount; }, 0);
  }

  function updateAccount(buy, account, type){
    if (type === TYPE_CREATE){
      account.balance -= total(buy.products);
      account.buyCount += productCount(buy);
      account.lastBuyAt = Firebase.ServerValue.TIMESTAMP;
    } else if(type === TYPE_DELETE) {
      account.balance += total(buy.products);
      account.buyCount -= productCount(buy);
      //TODO get previous last buy at timestamp from accounts buys
    }
    accounts.$save(account);
  }

  function updateProducts(buy, serverProducts, add, type){
    angular.forEach(serverProducts, function(product, productId){
      if (buy.products[productId]){
        if (type === TYPE_CREATE){
          product.buyCount += buy.products[productId];
          product.lastBoughtAt = Firebase.ServerValue.TIMESTAMP;
        } else if(type === TYPE_DELETE) {
          product.buyCount -= buy.products[productId];
          //TODO get previous last bought at timestamp from products buys
        }
        products.$save(product);
      }
    });
  }

  function total(buyProductsAndAmounts){
    return products
      .filter(function(product){ return angular.isDefined(buyProductsAndAmounts[product.$id]); })
      .map(function(product){ return product.price * buyProductsAndAmounts[product.$id]; })
      .reduce(function(total, price){ return total + price; }, 0);
  }

  return {
    create: function(buy){
      if (buy.$id) {
        throw new Error('Tried to persist buy that was already created');
      }
      var account = accounts.$getRecord(buy.buyerId);
      if (!account) {
        throw new Error('Could not find account: ' + buy.buyerId);
      }

      buy.createdAt = Firebase.ServerValue.TIMESTAMP;

      return firebase
        .$push(buy)
        .then(function(){
          updateAccount(buy, account, TYPE_CREATE);
        }).then(function(){
          updateProducts(buy, products, TYPE_CREATE);
        });
    },
    delete: function(buy){
      if (!buy.$id) {
        throw new Error('Tried to remove an unsaved buy');
      }
      if (!this.canDelete(buy)){
        throw new Error('Tried to remove a buy that is too old');
      }

      var account = accounts.$getRecord(buy.buyerId);
      if (!account) {
        throw new Error('Could not find account: ' + buy.buyerId);
      }

      return firebase
        .$remove(buy.$id)
        .then(function(){
          updateAccount(buy, account, TYPE_DELETE);
        }).then(function(){
          updateProducts(buy, products, TYPE_DELETE);
        });
    },
    canDelete: function(buy){
      return Date.now() - buy.createdAt < DELETE_TIME_THRESHOLD;
    },
    getResolvedBuyer: function(buyerId){
      return accounts.$getRecord(buyerId);
    },
    getResolvedProduct: function(productId){
      return products.$getRecord(productId);
    },
    total: total

  };
});
