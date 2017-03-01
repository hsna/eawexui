angular.module('myApp')
    .controller('productsCtrl', ['$rootScope', '$scope', '$uibModal', 
                                 '$filter', '$log', '$location', 'Products', 
                                 'labelConf', 'unitConf', 'Item',
        function ($rootScope, $scope, $uibModal, $filter, $log, $location, 
        		  Products, labelConf, unitConf, Item) {

            //モデル
            $scope.products = {};//一覧に表示する商品
            $scope.sliders = new Array();//スライダー
            $scope.tempSliderParam = {};//スライダーに使うパラメーター


            //カテゴリ(jsonの指定)
            var category = "summertire";

            //特徴、デモの初期値はコンフォートタイヤ
            $scope.features = ["type_comfort"];

            //スライダーのパラメーターは、価格、燃費、乗り心地で固定
            $scope.tempSliderParam["price"] = "";
            $scope.tempSliderParam["p_fuel"] = "";
            $scope.tempSliderParam["p_comfort"] = "";

            //ユーティリティ
            $scope.getLabel = function (type) {
                return eval('labelConf.' + type);
            }

            $scope.getUnit = function (type) {
                return eval('unitConf.' + type);
            }

            //プロダクトの取得
            $scope.updateProducts = function () {
                //商品一覧とスライドバーを初期化
                $scope.products = {};//一覧に表示する商品
                $scope.sliders = new Array();//スライダー

                Products.getProducts(category)
                    .then(
                        function (resource) {

                            //featureで絞込
                            var products = resource;
                            if ($scope.features.length != 0) {
                                var tempproducts = new Array;
                                angular.forEach($scope.features, function (value, key) {
                                    //データ構造で、featuresなどに特徴を配列で置くべきか
                                    //又はfeatureごとに数値でしきい値を設け、サーバーサイドからfeatureの追加または変更を受け取れるようにする
                                    //デモでは1表示、1feature名とする
                                    if (value === "type_comfort") {
                                        products = $filter('filter')(products, {type_comfort: "YES"});
                                    } else if (value === "type_eco") {
                                        products = $filter('filter')(products, {type_eco: "YES"});
                                    } else if (value === "type_sport") {
                                        products = $filter('filter')(products, {type_sport: "YES"});
                                    } else if (value === "eco_confort"){
                                        angular.forEach(products, function(item) {
                                            if( item.p_comfort >= 5 && item.p_fuel >= 4 ) tempproducts.push(item);
                                        });
                                        products = tempproducts;
                                        console.log("products"+products);
                                    } else if (value === "eco_eco_confort"){
                                        angular.forEach(products, function(item) {
                                            if( item.p_comfort >= 6 && item.type_eco === "YES" ) tempproducts.push(item);
                                        });
                                        products = tempproducts;
                                    }
                                });
                            }

                            $scope.products = products;

                            //productの軸の項目をセット
                            var tempproducts = new Array;

                            //一覧にスライダーの項目の値を表示するdescriptionを追加する
                            angular.forEach($scope.tempSliderParam, function (svalue, skey) {
                                var key = skey;
                                tempproducts = new Array;
                                angular.forEach($scope.products, function (pvalue, pkey) {
                                    if (key != "price") {
                                        if (pvalue.hasOwnProperty("description")) {
                                            pvalue["description"] = pvalue.description + " " + eval("pvalue." + key) + $scope.getUnit(key);
                                        } else {
                                            var val = eval("pvalue." + key);
                                            var unit = $scope.getUnit(key);
                                            var description = val + unit;
                                            pvalue["description"] = description;
                                            $log.info("pvalue.description=" + pvalue.description);
                                        }
                                        tempproducts.push(pvalue);
                                    }

                                })
                            })
                            $scope.products = tempproducts;

                            //スライダーのパラメーター/最小値/最大値取得、設定
                            angular.forEach($scope.tempSliderParam, function (value, key) {
                                var axis = key;
                                var floor = Math.min.apply(null, $scope.products.map(function (o) {
                                    return eval("o." + key + ";")
                                }));
                                var ceil = Math.max.apply(null, $scope.products.map(function (o) {
                                    return eval("o." + key + ";")
                                }));

                                //keyがpriceの場合、必ず、初期値は最大値とする
                                var val;
                                if (key == "price") {
                                    val = ceil;
                                } else {
                                    val = value.replace(/[^0-9^]/g, "");//valueに整数以外の文字が入っている場合、除外する
                                }

                                var setting = {
                                    value: val,
                                    options: getOptions(axis, floor, ceil),
                                    axis: axis,
                                    label: $scope.getLabel(axis),
                                };
                                $scope.sliders.push(setting);
                            })


                        },
                        function (err) {
                            $log.error(err);
                        }
                    );
            };


            $scope.showItemView = function (product) {
                $log.info("product =" + product.name);
                Item.setValue(product);
                $rootScope.$broadcast('event:requestChangeMode', "showItemView");

            }


            $scope.$on('event:requestChangeFeature', function (event, feature) {
                console.log("ch on requestChangeFeature:", feature)
                $scope.features = feature;
                $scope.updateProducts();
            })

            //動的にtlanslateを変更させる
            var getOptions = function (type, floor, ceil) {
                var obj = {};
                obj.floor = floor;
                obj.ceil = ceil;

                //タイプによって方向を変える
                //値段は最小->最大
                //その他の項目は最大->最小
                if (type == "price") {
                    obj.showSelectionBar = true;
                } else {
                    obj.showSelectionBarEnd = true;
                }
                switch (type) {
                    case 'price':
                        obj.translate = function (value) {
                            return '¥' + value;
                        };
                        break;
                    default:
                        obj.translate = function (value) {
                            return value;
                        };
                }
                return obj;

            }

            $scope.init = function() {
                $scope.updateProducts();
            }

            $scope.init();


        }]);
