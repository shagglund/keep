'use strict';

angular.module('kassa')
.service('Basket', function(Buy){
  function calculateNewBalance(account, total){
    return account.balance - total;
  }

  return {
    buyerId: null,
    products: {},
    buy: function(){
      return Buy.create({ buyerId: this.buyerId, products: this.products });
    },
    reset: function(){
      this.products = {};
      this.buyerId = null;
    },
    isEmpty: function(){
      return Object.keys(this.products).length === 0;
    },
    getResolvedBuyer: function(){
      return Buy.getResolvedBuyer(this.buyerId);
    },
    getResolvedProduct: function(productId){
      return Buy.getResolvedProduct(productId);
    },
    total: function(){
      return Buy.total(this.products);
    },
    getNewBalance: function(){
      if (this.buyerId && !this.isEmpty()){
        return calculateNewBalance(this.getResolvedBuyer(), this.total());
      }
    }

  };
});
