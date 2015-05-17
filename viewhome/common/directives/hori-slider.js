angular.module('hori').directive('horiSlider', function() {

    return {
        restrict: 'EA',
        link: function($scope, $element, $attr, $ctrl) {}
    };
});

angular.module('hori').directive('horiSliderBox', ['$swipe', '$timeout', function($swipe, $timeout) {

    return {
        restrict: 'EA',
        scope: {
            autoPlay: '=',
            interval: '@'
        },
        transclude: true,
        template: '<div class="hori-slider-list" ng-transclude></div><div class="hori-slider-series" style="position:absolute; right: 5px; bottom: 5px" ng-bind="series"></div>',
        link: function($scope, $element, $attr) {
            var list = [],
                count,
                boxWidth,
                playHandler,
                startX = null,
                startY = null,
                endAction = "cancel",
                interval = +$attr.interval;

            interval = (interval < 500 || isNaN(interval)) ? 2500 : interval;


            //设置过渡时间， 指定num位置的元素不添加
            function setTransitionDuration(time, num) {
                for (var j = 0; j < count; j++) {
                    if (j !== num) {
                        list[j].style.transitionDuration = time;
                    }
                }

                if (count > 0) {

                }
            }

            //设置过渡效果
            function translateAndRotate(el, x, y, z, deg) {
                el.style["-webkit-transform"] = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
                el.style["-moz-transform"] = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
                el.style["-ms-transform"] = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
                el.style["-o-transform"] = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
                el.style["transform"] = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
            }

            //重新设置过渡效果
            function resetTransform() {
                for (var j = 0; j < count; j++) {
                    translateAndRotate(list[j], (j - 1) * boxWidth, 0, 0, 0);
                }

                $scope.$apply(function() {
                    $scope.series = list[1].getAttribute('sliderIndex') + '/' + count;
                });
            }

            //下一页
            function next() {
                var item = list.shift();
                list.push(item);

                setTransitionDuration('.3s', count - 1);
                resetTransform();
            }

            //上一页
            function prev() {
                var item = list.pop();
                list.unshift(item);

                setTransitionDuration('.3s', 0);
                resetTransform();
            }

            //设置绑定事件
            function bindEvents() {
                $swipe.bind($element, {
                    start: function(coords) {
                        (($scope.autoPlay + '') === 'true') && stopAutoPlay();

                        //去除过渡属性转换时间，此时通过捕获move事件来控制
                        setTransitionDuration(null);

                        endAction = null;
                        startX = coords.x;
                        startY = coords.y;
                    },

                    cancel: function(e) {
                        endAction = null;
                        resetTransform();
                        e.stopPropagation();
                    },

                    end: function(coords, e) {
                        if (endAction == "prev") {
                            prev();
                        } else if (endAction == "next") {
                            next();
                        } else {
                            resetTransform();
                        }
                        e.stopPropagation();

                        (($scope.autoPlay + '') === 'true') && setAutoPlay();
                    },

                    move: function(coords) {
                        if (startX != null) {
                            var deltaX = coords.x - startX,
                                width = boxWidth,
                                deltaXRatio = deltaX / width,
                                num = count;

                            if (deltaXRatio > 0.3) {
                                endAction = "prev";
                            } else if (deltaXRatio < -0.3) {
                                endAction = "next";
                            } else {
                                endAction = null;
                            }

                            if (num == 2) {
                                translateAndRotate(list[0], (deltaXRatio + (deltaX > 0 ? -1 : 1)) * width, 0, 0, 0);
                                translateAndRotate(list[1], deltaXRatio * width, 0, 0, 0);
                            } else {
                                translateAndRotate(list[0], (deltaXRatio - 1) * width, 0, 0, 0);
                                translateAndRotate(list[1], deltaXRatio * width, 0, 0, 0);
                                translateAndRotate(list[2], (deltaXRatio + 1) * width, 0, 0, 0);
                            }

                        }
                    }
                });
            }


            function setAutoPlay() {
                (function play() {
                    $timeout.cancel(playHandler);
                    playHandler = $timeout(function() {
                        setTransitionDuration(null);
                        if (endAction == "prev") {
                            prev();
                        } else {
                            next();
                        }
                        play();
                    }, interval)

                })();
            }

            function stopAutoPlay() {
                $timeout.cancel(playHandler);
            }


            function init() {
                var boxEle = $element[0],
                    ro = boxEle.getBoundingClientRect(),
                    width = ro.width || ro.right - ro.left,
                    listEle = boxEle.children[0],
                    sliders = listEle.children,
                    slider,
                    len = sliders.length,
                    i;

                boxEle.style.overflow = 'hidden';
                boxEle.style.position = 'relative';
                listEle.style.position = 'relative';
                listEle.style.height = '100%';

                boxWidth = width;
                count = len;

                //阻止图片的默认拖拽行为
                $element.find('img').on('dragstart', function(e){
                    e.preventDefault(); 
                    return false
                });


                //阻止超链接的默认拖拽行为
                $element.find('a').on('dragstart', function(e){
                    e.preventDefault(); 
                    return false
                }); 

                $scope.series = (count == 0 ? 0 : 1) + '/' + count;

                //只有一个sider时不做任何处理
                if (len < 2) {
                    return;
                }


                for (i = 0; i < len; i++) {
                    slider = sliders[i];

                    slider.style.position = 'absolute';
                    slider.style.width = width + 'px';
                    slider.style.height = '100%';
                    slider.setAttribute('sliderIndex', i + 1);

                    if (i == (len - 1)) {
                        translateAndRotate(slider, -width, 0, 0, 0);
                        list.unshift(slider);
                    } else {
                        translateAndRotate(slider, i * width, 0, 0, 0);
                        list.push(slider);
                    }
                }

                bindEvents();

                if (($scope.autoPlay + '') === 'true') {
                    setAutoPlay();
                }
            }

            var initHandler = $timeout(function() {
                $timeout.cancel(initHandler);
                initHandler = null;

                init();
            }, 10);

            $scope.$on('$destroy', function() {
                $timeout.cancel(playHandler);
                playHandler = null;
            });
        }
    };
}]);
