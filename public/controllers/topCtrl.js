'use strict';

// Dependencies
angular.module('myApp')
    .controller('topCtrl', ['$rootScope','$scope', '$log', '$state', 'Item',
        function ($rootScope, $scope, $log, $state, Item) {

            $scope.totalPrice = 0;
            $scope.totalCount = 0;
            $state.go('top.watson');
            
            $scope.$on('event:addCartBox', function (event,price) {
                $scope.totalPrice = $scope.totalPrice + price;
                $scope.totalCount = $scope.totalCount + 1;
                return;
            })

        }])
