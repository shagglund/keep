'use strict';

angular.module('keep')
.service('Buy', function($q, $firebase, Firebase, FirebaseRootUrl, Authentication, Account, Product){
  var DELETE_TIME_THRESHOLD = 5*60*1000, //5 minutes
    TYPE_CREATE = 1,
    TYPE_DELETE = 2,
    firebase = null,
    products = null,
    accounts = null;

  Authentication.handleAuth(function(authData){
    if (authData) {
      firebase = $firebase(new Firebase(FirebaseRootUrl + '/buys'));
    } else {
      firebase = null;
    }
  });
  Account.onAccounts(function(accs){ accounts = accs; });
  Product.onProducts(function(prods){ products = prods; });

  function id(obj){
    return angular.isObject(obj) ? obj.$id : obj;
  }

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
      if (id(buy)) {
        throw new Error('Tried to persist buy that was already created');
      }
      var account = accounts.$getRecord(buy.buyerId);
      if (!account) {
        throw new Error('Could not find account: ' + buy.buyerId);
      }

      buy.createdAt = Firebase.ServerValue.TIMESTAMP;
      var promises = [
        firebase.$push(buy),
        updateAccount(buy, account, TYPE_CREATE),
        updateProducts(buy, products, TYPE_CREATE)
      ];

      return $q.when(promises).then(function(resolved){ return resolved[0]; });
    },
    delete: function(buy){
      if (!id(buy)) {
        throw new Error('Tried to remove an unsaved buy');
      }
      if (!this.canDelete(buy)){
        throw new Error('Tried to remove a buy that is too old');
      }

      var account = accounts.$getRecord(buy.buyerId);
      if (!account) {
        throw new Error('Could not find account: ' + buy.buyerId);
      }

      var promises = [
        firebase.$remove(id(buy)),
        updateAccount(buy, account, TYPE_DELETE),
        updateProducts(buy, products, TYPE_DELETE)
      ];

      return $q.when(promises).then(function(resolved){ return resolved[0]; });
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
    getLast: function(limit){
      var firebaseQuery = new Firebase(FirebaseRootUrl + '/buys/')
        .limitToLast(limit);
      return $firebase(firebaseQuery).$asArray();
    },
    getLastForAccount: function(limit, account){
      var firebaseQuery = new Firebase(FirebaseRootUrl + '/buys/')
        .orderByChild('buyerId')
        .equalTo(id(account))
        .limitToLast(limit);
      return $firebase(firebaseQuery).$asArray();
    },
    total: total

  };
});
