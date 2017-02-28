'use strict';

angular.module('myApp')

    .factory('Products', ['$http','$q','appConf', function ($http,$q,appConf) {
        var _onSuccess = function (res) {
                return res.data;
            },
            _onError = function (res) {
                return $q.reject("データの取得に失敗しました");
            },

            //すべての設定を取得
            _getProducts = function (categoryName){
                var jsonName = categoryName + ".json";
                var request = $http({
                    method: 'get',
                    url: appConf.dataPath + jsonName
                });
                return request.then(_onSuccess, _onError);
            }

            return {
                getProducts: _getProducts
        };
    }]);