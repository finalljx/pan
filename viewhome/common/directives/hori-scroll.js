angular.module('hori').directive('horiScroll', ['$timeout',
    function($timeout) {

        return {
            restrict: 'EA',
            scope: {
                onPullUp: '&',
                onPullDown: '&',
                isUpLoaded: '=',
                isDownLoaded: '='
            },
            transclude: true,
            replace: true,
            template: '<div style="overflow:hidden; height: 100%"><div><div class="text-center" ng-show="isDownLoaded">加载...</div><div ng-transclude></div><div class="text-center" ng-show="isUpLoaded">加载...</div></div></div>',
            link: function($scope, $element, $attr) {
                var scroll,
                    elem = $element[0],
                    defaultOptions = {
                        probeType: 2,
                        bounce: true,
                        mouseWheel: true,
                        scrollbars: true
                    },
                    isDownLoadingData = false,
                    isUpLoadingData = false,

                    pullUp = $scope.onPullUp,
                    pullDown = $scope.onPullDown;

                if ($attr.options) {
                    angular.extend(defaultOptions, $scope.$eval($attr.options));
                }

                function onScroll() {
                    if (this.y > 5) {
                        //下拉刷新效果  
                        if ($attr.onPullDown) {
                            if (!$scope.isDownLoaded) {
                                $scope.$apply(function() {
                                    $scope.isDownLoaded = true;
                                });
                            }
                        }
                    } else if (this.y < (this.maxScrollY - 5)) {
                        //上拉刷新效果  
                        if ($attr.onPullUp) {
                            if (!$scope.isUpLoaded) {
                                $scope.$apply(function() {
                                    $scope.isUpLoaded = true;
                                });
                            }
                        }
                    }
                }

                function onScrollEnd() {
                    if ($attr.onPullDown) {
                        if ($scope.isDownLoaded && !isDownLoadingData) {
                            isDownLoadingData = true;
                            $scope.$apply(function() {
                                pullDown();
                            });
                        }
                    }


                    if ($attr.onPullUp) {
                        if ($scope.isUpLoaded && !isUpLoadingData) {
                            isUpLoadingData = true;
                            $scope.$apply(function() {
                                pullUp();
                            });
                        }
                    }

                }

                var tt = $timeout(function() {
                    scroll = new IScroll(elem, defaultOptions);

                    if ($scope.$parent) {
                        $scope.$parent.iscroll = scroll;
                    }

                    scroll.on('scroll', onScroll);
                    scroll.on('scrollEnd', onScrollEnd);
                    $timeout.cancel(tt);

                }, 0);

                if ($attr.onPullUp) {
                    $scope.$watch('isUpLoaded', function(newValue, oldValue) {
                        if (newValue != oldValue && scroll) {
                            if (newValue == false) {
                                isUpLoadingData = false;
                            }

                            //在数据更新完后再更新iscroll
                            var mt = $timeout(function() {
                                scroll.refresh();
                                $timeout.cancel(mt);
                            }, 0);
                        }
                    });
                }

                if ($attr.onPullDown) {
                    $scope.$watch('isDownLoaded', function(newValue, oldValue) {
                        if (newValue != oldValue && scroll) {
                            if (newValue == false) {
                                isDownLoadingData = false;
                            }

                            //在数据更新完后再更新iscroll
                            var mt = $timeout(function() {
                                scroll.refresh();
                                $timeout.cancel(mt);
                            }, 0);
                        }
                    });
                }

                $scope.$on('$destroy', function() {
                    if (scroll) {
                        if ($scope.$parent) {
                            $scope.$parent.iscroll = scroll;
                        }
                        scroll.destroy();
                        scroll = null;
                    }
                });
            }
        };
    }
]);
