'use strict';

// Dependencies
angular.module('myApp')
.service('backendService', ['$http', function($http) {
	  var requestPayload;
	  var responsePayload;
	  var messageEndpoint = '/api/message';
	  var context = '';

	var service = {
		ask: function(question){
			console.log("question", question);

			var payloadToWatson = {};
		    if (question) {
		        payloadToWatson.input = {
		          text: question
		        };
		      }
		      if (context) {
			   if (context.sota_message){
				delete context.sota_message;
			   }
		        payloadToWatson.context = context;
		      }


			var promise =  $http.post(messageEndpoint, payloadToWatson).then(
				function(res){
					console.log('got response', res);
					context = res.data["context"];
					return res.data;
				},function(errRes){
					console.log("got error")
					if (typeof errRes !== 'undefined') {
						return errRes.data;
					}
				}
			);

			return promise;
		},

		addcart: function (product){
			console.log("product", product);

				var payloadToWatson = {};

				// 合図として "cart-in" をセット
				payloadToWatson.input = {
						text: 'cart-in'
				};

				// 商品の情報を context に追加
				payloadToWatson.context = context;
				var cart = {};
				cart = {"name": product['name'], "brand": product['brand'], "maker": product['maker']};
				payloadToWatson.context['cart'] = cart;

				// 会話ノードをrootに指定
				payloadToWatson.context.system.dialog_stack[0] = "root";

			var promise = $http.post(messageEndpoint, payloadToWatson).then(
					function(res){
						console.log('got response', res);
						context = res.data["context"];
						return res.data;
					},function(errRes){
						console.log("got error")
						if (typeof errRes !== 'undefined') {
							return errRes.data;
						}
					}
				);
			return promise;
		},

		updatecontext: function(urlquery){
			//var urlquery = $location.search();
			if (context){
				for (var propname in urlquery){
					if(urlquery.hasOwnProperty(propname)){
						context[propname] = urlquery[propname];
					}
				}
			}else{
				context = urlquery;
			}

			return context;
		},


		feedback: function(feedback, messageId){
			console.log("feedback", feedback);

			var promise =  $http.post('/api/v1/feedback',
				$.param({
					conversationToken: service.conversationToken,
					messageId: messageId,
					feedback: feedback}),
				{headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}}
			).then(
				function(res){
					console.log('got response', res)
					return res.data;
				},function(errRes){
					console.log("got error")}
			);

			return promise;
		}
	}

	return service
}])
