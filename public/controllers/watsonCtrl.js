'use strict';
// Dependencies
angular.module('myApp')
    .controller('watsonCtrl', ['$rootScope', '$sce', '$scope', '$log', '$filter', '$location','backendService',
        function ($rootScope, $sce, $scope, $log, $filter, $location, backendService) {
            $scope.features = [];
            $scope.waitingForWatsonAnswer = false;
            $scope.answer = "";
            $scope.response = "";
            $scope.query = "";//チャットボックス上に表示する文字列
            $scope.str = "";
            $scope.think = new Array();
            $scope.showsliderflg = "";
            var errorMsg = "サーバーエラーが発生しました";
            $scope.$on('event:errorCommunicateToWatson', function (event, err) {
                //エラーメッセージ
            });
            $scope.ask = function (question) {
                //暫定 Watson Think
                $scope.changeMode("showThinkWatson");
                //チャットボックスから入力した場合、$scope.queryに、ボタンなどから入力した場合、questionに問い合わせのテキストが入る
                //分けている理由は、チャットボックス上にシステム的なinputが表示されることを防ぐため
                if (typeof(question) === "undefined") {
                    question = (' ' + $scope.query).slice(1);//copy
                }
                if (question == "") {
                    console.log("query submitting...");
                    return;
                }
                $scope.query = "";
                //全角->半角とする Start
                question = question.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                });
                //全角->半角とする End
                $scope.waitingForWatsonAnswer = true;
                backendService.ask(question).then(
                        function (answer){
                            $scope.displayAnswer(answer)
                        }
                )
            }
            // 商品がカートに追加されたときのwatsonserviceの呼出の関数
            $scope.addcart = function (product) {
                $scope.changeMode("showThinkWatson");
                $scope.waitingForWatsonAnswer = true;
                backendService.addcart(product).then(
                        function (answer){
                            $scope.displayAnswer(answer)
                        }
                )
            }

            // watsonからの応答を画面表示用に処理する関数
            $scope.displayAnswer = function(answer){
                console.log("watsonAnswered");
                if (answer.status === "Error") {
                    $rootScope.$broadcast('event:errorCommunicateToWatson', errorMsg);
                    console.log("Received an error");
                    $scope.response = errorMsg;
                    return;
                    $scope.changeMode("showNormalWatson");
                } else {
                    //message にメッセージ本文をセットする
                    var message = "";
                    angular.forEach(answer["output"]["text"],function(text,index){
                        message += text;
                    });
                    //console.log(message);
                        //画面モード変更対応
 /*                   var mode_key = "changedisplay";
                    var mode = $scope.getContextValue(mode_key, answer).toString();
                    if (mode.length != 0) {
                        $scope.changeMode(mode, answer);
                    }
	*/				
  /*                  //表示商品の変更対応
                    var feature_key = "changefeature";
                    var feature = $scope.getContextValue(feature_key, answer);
                    if (feature !== undefined) {
                        //Thinkアイコン表示対応
                        var tempproducts = new Array;
                        angular.forEach(feature, function (value, key) {
                            $scope.think = new Array();
                            if (value === "type_comfort") {
                                $scope.think.push("confort_strong");
                            } else if (value === "type_eco") {
                                $scope.think.push("eco_strong");
                            } else if (value === "type_sport") {
                                $scope.think.push("run_strong");
                            } else if (value === "eco_confort") {
                                $scope.think.push("eco_weak");
                                $scope.think.push("confort_weak");
                            } else if (value === "eco_eco_confort") {
                                $scope.think.push("eco_strong");
                                $scope.think.push("confort_weak");
                            }
                        });
                        //productコントロール側で表示する商品を変更
                        $rootScope.$broadcast('event:requestChangeFeature', feature);
                    }
   */                 // TODO: typeWriter関数の外出し
                    //watsonのセリフを1文字ずつ表示させる
                    var length = message.length;
                    var text = message;
                    var timeOut;
                    var character = 0;
                    (function typeWriter() {
                        timeOut = setTimeout(function() {
                            character++;
                            var type = text.substring(0, character);
                            $('#watson-text').html(type);
                            typeWriter();
                            if (character == length) {
                                clearTimeout(timeOut);
                            }
                        }, 5);
                    }());
                    //add end
                    $scope.response = $sce.trustAsHtml(message);
                    $scope.changeMode("showNormalWatson");
                    $scope.ticker();
                }
                $scope.waitingForWatsonAnswer = false
                $scope.query = null;
        }
            $scope.say = function (question) {
                $scope.query = question;
                $scope.ask();
            }
            //Enterで送信する
            $scope.handleKeydown = function(e) {
                if (e.which === 13) {
                  	e.preventDefault();
					$scope.ask();
                }
            }
            //日付入力用の部品 start
            $scope.current = new Date();
            $scope.$watch('current', function(new_value, old_value){
                if (!angular.isDate(new_value)){
                    $scope.current = new Date();
                }
            });
            $scope.onopen = function($event) {
                //カレンダーを開く
                $scope.opened = true;
            };
            $scope.sendDate = function(){
                console.log("date is:" + $scope.current)
                var inputdate = $filter('date')($scope.current, 'yyyy年MM月dd日')
                $scope.say(inputdate);
            }
            //日付入力用の部品 end
            //時間帯選択入力用の部品 start
            //本来は動的にサーバーサイドから受け取る
            //モデル
            $scope.timespan = {};
            $scope.timespan.selected = "";
            $scope.timespancollection = [ // Taken from https://gist.github.com/unceus/6501985
                '10:00〜10:30',
                '14:00〜14:30',
                '14:30〜15:00',
                '15:30〜16:00',
            ];
            $scope.sendTime = function(){
                console.log("timespan is:" + $scope.timespan.selected)
                var inputspan = $scope.timespan.selected;
                $scope.say(inputspan);
            }
            //時間帯選択入力用の部品 end
            //画面のレイアウト変更
            $scope.changeMode = function (mode, answer) {
                switch (mode) {
                    //animationに
                    case 'showOnlyWatson':
                        $("#watson_col").className = "col-md-8 col-md-offset-2";
                        $scope.watsonWide = true;
                        $scope.smallFont = false;
                        $scope.middleFont = false;
                        $scope.largeFont = true;
						//入力ボックス表示 default true
                        $scope.showChatBox = true;
                        $scope.showDatePickerArea =false;
                        $scope.showTimeSelectArea =false;
                        $scope.showYesNo = false;
                        $scope.showEnd = false;
						//リスト表示　default true
                        $scope.show_products_view = true;
                        $scope.show_sliders = false;
                        $scope.show_item_view = false;
                        break;
                    case 'showProductsView':
                        //スライダーの表示フラグをfalseにセット
                        $scope.showsliderflg = false;
                        $scope.watsonWide = false;
                        $scope.smallFont = true;
                        $scope.middleFont = false;
                        $scope.largeFont = false;
                        $scope.showChatBox = true;
                        $scope.showDatePickerArea =false;
                        $scope.showTimeSelectArea =false;
                        $scope.showYesNo = false;
                        $scope.showEnd = false;
                        $scope.show_products_view = true;
                        $scope.show_sliders = false;
                        $scope.show_item_view = false;
//                      $scope.moveSota(answer);
                        break;
                    case 'showProductsViewAndSliders':
                        //スライダーの表示フラグをtrueにセット
                        $scope.showsliderflg = true;
                        $scope.watsonWide = false;
                        $scope.smallFont = true;
                        $scope.middleFont = false;
                        $scope.largeFont = false;
                        $scope.showChatBox = true;
                        $scope.showDatePickerArea =false;
                        $scope.showTimeSelectArea =false;
                        $scope.showYesNo = false;
                        $scope.showEnd = false;
                        $scope.show_products_view = true;
                        $scope.show_sliders = true;
                        $scope.show_item_view = false;
                        break;
                    case 'backProductsView':
                        if($scope.showsliderflg){
                            $scope.changeMode('showProductsViewAndSliders');
                        }else{
                            $scope.changeMode('showProductsView');
                        }
                        break;
                    case 'showItemView':
                        $scope.watsonWide = false;
                        $scope.smallFont = true;
                        $scope.middleFont = false;
                        $scope.largeFont = false;
                        $scope.showChatBox = true;
                        $scope.showTimeSelectArea =false;
                        $scope.showYesNo = false;
                        $scope.showEnd = false;
                        $scope.show_products_view = false;
                        if($scope.showsliderflg){
                            $scope.show_sliders = true;
                        }else{
                            $scope.show_sliders = false;
                        }

                        $scope.show_item_view = true;
                        break;
                    case 'showYesNo':
                        $scope.watsonWide = true;
                        $scope.smallFont = false;
                        $scope.middleFont = false;
                        $scope.largeFont = true;
                        $scope.showChatBox = false;
                        $scope.showDatePickerArea =false;
                        $scope.showTimeSelectArea =false;
                        $scope.showYesNo = true;
                        $scope.showEnd = false;
                        $scope.show_products_view = false;
                        $scope.show_sliders = false;
                        $scope.show_item_view = false;
                        break;
                    case 'showDatePicker':
                        $scope.watsonWide = true;
                        $scope.smallFont = false;
                        $scope.middleFont = false;
                        $scope.largeFont = true;
                        $scope.showChatBox = false;
                        $scope.showDatePickerArea =true;
                        $scope.showTimeSelectArea =false;
                        $scope.showYesNo = false;
                        $scope.showEnd = false;
                        $scope.show_products_view = false;
                        $scope.show_sliders = false;
                        $scope.show_item_view = false;
                        break;
                    case 'showTimeSelect':
                        $scope.watsonWide = true;
                        $scope.smallFont = false;
                        $scope.middleFont = false;
                        $scope.largeFont = true;
                        $scope.showChatBox = false;
                        $scope.showDatePickerArea =false;
                        $scope.showTimeSelectArea =true;
                        $scope.showYesNo = false;
                        $scope.showEnd = false;
                        $scope.show_products_view = false;
                        $scope.show_sliders = false;
                        $scope.show_item_view = false;
                        break;
                    case 'showEnd':
                        $scope.watsonWide = true;
                        $scope.smallFont = false;
                        $scope.middleFont = true;
                        $scope.largeFont = false;
                        $scope.showChatBox = false;
                        $scope.showDatePickerArea =false;
                        $scope.showTimeSelectArea =false;
                        $scope.showYesNo = false;
                        $scope.showEnd = true;
                        $scope.show_products_view = false;
                        $scope.show_sliders = false;
                        $scope.show_item_view = false;
                        break;
                    case 'showNormalWatson':
                        $scope.showWatsonNormal = true;
                        $scope.showWatsonThink = false;
                        break;
                    case 'showThinkWatson':
                        $scope.showWatsonNormal = false;
                        $scope.showWatsonThink = true;
                        break;
                }
            };
            //Conversionからcontextの値を取り出すための関数
            $scope.getContextValue = function (key, answer){
                var valueObj = [];
                valueObj = answer["context"][key];
                return valueObj;
            }
            //他のコントローラーから画面レイアウトを変更する際に使用するイベント
            $scope.$on('event:requestChangeMode', function (event, mode) {
                console.log("ch on requestChangeMode:", mode)
                $scope.changeMode(mode);
            })
            //他のコントローラーからWatsonへ応答を返す際に使用するイベント
            $scope.$on('event:requestAsk', function (event, question) {
                console.log("requestAsk:", question);
                $scope.ask(question);
            })
            $scope.$on('event:addCart', function (event, product){
                console.log("addCart: ", product);
                $scope.addcart(product);
            })
            $scope.init = function () {
                $scope.query = "hello";
                console.log($location.search());
                backendService.updatecontext($location.search());
                $scope.ask();
                $scope.changeMode("showOnlyWatson");
                //開発用コード
                //$scope.changeMode("showProductsView");
                //$scope.changeMode("showProductsViewAndSliders");
                //$scope.changeMode("showDatePicker");
                //$scope.changeMode("showTimeSelect");
            }
            
            $scope.init();
        }])
