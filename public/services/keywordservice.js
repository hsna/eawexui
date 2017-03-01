'use strict';

angular.module('myApp')

    .factory('Keywords', ['$http','$q','appConf', function ($http,$q,appConf) {
        var _onSuccess = function (res) {
                return res.data;
            },
            _onError = function (res) {
                return $q.reject("データの取得に失敗しました");
            },

            //すべての設定を取得
            _getKeywords = function (str){
            	//moc dataを取得
            	var jsonName="keyword.json"
                var request = $http({
                    method: 'get',
                    url: appConf.keywordPath + jsonName
                });
                return request.then(_onSuccess, _onError);
            }
            return {
                getKeywords: _getKeywords
        };
    }]);