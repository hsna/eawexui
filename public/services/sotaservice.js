'use strict';
// Dependencies
angular.module('myApp')
.service('sotaService', ['$http', function($http) {
      var requestPayload;
      var responsePayload;
      var apiEndpoint = '/api/sota';
      var context = '';
    var service = {
        order: function(message){
            if(!message) message = "Hello. This is test message";
            requestPayload = {
                "message": message
            }
            var promise =  $http.post(apiEndpoint, requestPayload).then(
                function(res){
                    console.log('got response', res);
                    return res;
                },function(errRes){
                    console.log("got error")
                    if (typeof errRes !== 'undefined') {
                        return errRes.data;
                    }
                }
            );
            return promise;
        },
    }
    return service
}])