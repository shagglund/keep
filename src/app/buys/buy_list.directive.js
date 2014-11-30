'use strict';

angular.module('keep')
.directive('buyList', function(Buy, Account, Product, $stateParams){
  var buyListCtrl = function(){
    var self = this;
    Account.onAccounts(function(accounts){
      self.buyers = accounts;
    });
    Product.onProducts(function(products){
      self.products = products;
    });
    if ($stateParams.accountId) {
      this.buys = Buy.getLastForAccount(25, $stateParams.accountId);
    } else {
      this.buys = Buy.getLast(25);
    }
  };

  buyListCtrl.prototype.canDelete = Buy.canDelete;

  buyListCtrl.prototype.remove = Buy.delete;
  buyListCtrl.prototype.buyAgain = function(buy){
    return Buy.create({ buyerId: buy.buyerId, products: buy.products });
  };

  return {
    scope: {},
    templateUrl: 'app/buys/buy_list.html',
    controller: buyListCtrl,
    controllerAs: 'ctrl',
    link: function(scope){
      scope.showAvatar = true;
    }
  };
});
