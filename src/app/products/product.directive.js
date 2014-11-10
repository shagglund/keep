'use strict';

angular.module('kassa')
.directive('product', function($firebase, $state, $stateParams, Firebase, FirebaseRootUrl, Message){
  var CREATE_SUCCESS_MSG = 'Product created successfully',
    UPDATE_SUCCESS_MSG = 'Product updated successfully',
    CREATE_FAIL_MSG = 'Product create failed: ',
    UPDATE_FAIL_MSG = 'Product update failed: ';

  function createOrUpdate(ctrl, product, create){
    var promise = null;

    if (create) {
      product.createdAt = Firebase.ServerValue.TIMESTAMP;
      product.updatedAt = Firebase.ServerValue.TIMESTAMP;
      product.buyCount = 0;
      promise = ctrl._firebase.$push(product);
    } else {
      product.updatedAt = Firebase.ServerValue.TIMESTAMP;
      promise = product.$save();
    }
    ctrl.saving = true;

    return promise.then(function(){
      Message.success(create ? CREATE_SUCCESS_MSG : UPDATE_SUCCESS_MSG);
    }, function(error){
      Message.error((create ? CREATE_FAIL_MSG : UPDATE_FAIL_MSG) +  error);
    }).finally(function(){
      ctrl.saving = false;
    });
  }

  var productCtrl = function(){
    if (angular.isDefined($stateParams.id)) {
      this.product = $firebase(new Firebase(FirebaseRootUrl + '/products/' + $stateParams.id)).$asObject();
    } else {
      this._firebase = $firebase(new Firebase(FirebaseRootUrl + '/products'));
      this.product = {};
    }
  };

  productCtrl.prototype.save = function(product){
    var isCreate = angular.isUndefined(product.$id);
    createOrUpdate(this, product, isCreate).then(function(){
      $state.go('root.products');
    });
  };

  productCtrl.prototype.cancel = function(){
    $state.go('root.products');
  };

  return {
    templateUrl: '/app/products/product.html',
    controller: productCtrl,
    controllerAs: 'ctrl'
  };
});