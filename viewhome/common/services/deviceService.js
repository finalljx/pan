/**
 * Created with JetBrains WebStorm.
 * User: lvjianxin
 * Date: 14-10-18
 * Time: 下午2:47
 * To change this template use File | Settings | File Templates.
 */
angular.module('hori').factory('deviceService', ['$http', '$location', '$q','$timeout', 'configService', 'horiService', function($http, $location, $q,$timeout, config, horiService) {

    var returnService = {};


    var self = this;
    var uma; // 用户手机浏览器版本

    /*
     * _getMobileAgent @return :返回用户浏览器类型 @type 对象{ shell:浏览器内核
     * mobile:undefined|apple|android|webos } @example:var ua=_getMobileAgent();
     * if[ua["mobile"]]{ }
     *
     * 判断是否是手机
     *
     *
     */
    function _getMobileAgent() {

        var ua = navigator.userAgent,
            EMPTY = '',
            MOBILE = 'mobile',
            core = EMPTY,
            shell = EMPTY,
            m,
            IE_DETECT_RANGE = [6, 9],
            v, end,
            VERSION_PLACEHOLDER = '{{version}}',
            IE_DETECT_TPL = '<!--[if IE ' + VERSION_PLACEHOLDER + ']><s></s><![endif]-->',
            div = document.createElement('div'),
            s,
            o = {

            },
            numberify = function(s) {
                var c = 0;
                // convert '1.2.3.4' to 1.234
                return parseFloat(s.replace(/\./g, function() {
                    return (c++ === 0) ? '.' : '';
                }));
            };

        // try to use IE-Conditional-Comment detect IE more accurately
        // IE10 doesn't support this method, @ref:
        // http://blogs.msdn.com/b/ie/archive/2011/07/06/html5-parsing-in-ie10.aspx
        div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, '');
        s = div.getElementsByTagName('s');

        if (s.length > 0) {

            shell = 'ie';
            o[core = 'trident'] = 0.1; // Trident detected, look for revision

            // Get the Trident's accurate version
            if ((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
                o[core] = numberify(m[1]);
            }

            // Detect the accurate version
            // 注意：
            // o.shell = ie, 表示外壳是 ie
            // 但 o.ie = 7, 并不代表外壳是 ie7, 还有可能是 ie8 的兼容模式
            // 对于 ie8 的兼容模式，还要通过 documentMode 去判断。但此处不能让 o.ie = 8, 否则
            // 很多脚本判断会失误。因为 ie8 的兼容模式表现行为和 ie7 相同，而不是和 ie8 相同
            for (v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1]; v <= end; v++) {
                div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);
                if (s.length > 0) {
                    o[shell] = v;
                    break;
                }
            }

        } else {

            // Apple Mobile
            if (/ Mobile\//.test(ua)) {
                o[MOBILE] = 'apple'; // iPad, iPhone or iPod Touch
            }
            // Android mobile
            if ((m = ua.match(/ Android /gi))) {
                o[MOBILE] = 'android'; //
            }
            // webos mobile
            if ((m = ua.match(/webOS \d\.\d/))) {
                o[MOBILE] = 'webos'; // Nokia N-series, Android, webOS, ex:
                // NokiaN95
            }
            // Other WebKit Mobile Browsers
            else if ((m = ua.match(/NokiaN[^\/]*|webOS\/\d\.\d/))) {
                o[MOBILE] = m[0].toLowerCase(); // Nokia N-series, Android, webOS,
                // ex: NokiaN95
            }

            // WebKit
            // alert(ua);
            if ((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]) {
                o[core = 'webkit'] = numberify(m[1]);

                // Chrome
                if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
                    o[shell = 'chrome'] = numberify(m[1]);
                }
                // Safari
                else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
                    o[shell = 'safari'] = numberify(m[1]);
                }


            }

            // NOT WebKit
            else {
                // Presto
                // ref: http://www.useragentstring.com/pages/useragentstring.php
                if ((m = ua.match(/Presto\/([\d.]*)/)) && m[1]) {
                    o[core = 'presto'] = numberify(m[1]);

                    // Opera
                    if ((m = ua.match(/Opera\/([\d.]*)/)) && m[1]) {
                        o[shell = 'opera'] = numberify(m[1]); // Opera detected,
                        // look for revision

                        if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
                            o[shell] = numberify(m[1]);
                        }

                        // Opera Mini
                        if ((m = ua.match(/Opera Mini[^;]*/)) && m) {
                            o[MOBILE] = m[0].toLowerCase(); // ex: Opera
                            // Mini/2.0.4509/1316
                        }
                        // Opera Mobile
                        // ex: Opera/9.80 (Windows NT 6.1; Opera Mobi/49; U; en)
                        // Presto/2.4.18 Version/10.00
                        // issue: ÓÉÓÚ Opera Mobile ÓÐ Version/ ×Ö¶Î£¬¿ÉÄÜ»áÓë Opera
                        // »ìÏý£¬Í¬Ê±¶ÔÓÚ Opera Mobile µÄ°æ±¾ºÅÒ²±È½Ï»ìÂÒ
                        else if ((m = ua.match(/Opera Mobi[^;]*/)) && m) {
                            o[MOBILE] = m[0];
                        }
                    }

                    // NOT WebKit or Presto
                } else {
                    // MSIE
                    // ÓÉÓÚ×î¿ªÊ¼ÒÑ¾­Ê¹ÓÃÁË IE
                    // Ìõ¼þ×¢ÊÍÅÐ¶Ï£¬Òò´ËÂäµ½ÕâÀïµÄÎ¨Ò»¿ÉÄÜÐÔÖ»ÓÐ IE10+
                    if ((m = ua.match(/MSIE\s([^;]*)/)) && m[1]) {
                        o[core = 'trident'] = 0.1; // Trident detected, look for
                        // revision
                        o[shell = 'ie'] = numberify(m[1]);

                        // Get the Trident's accurate version
                        if ((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
                            o[core] = numberify(m[1]);
                        }

                        // NOT WebKit, Presto or IE
                    } else {
                        // Gecko
                        if ((m = ua.match(/Gecko/))) {
                            o[core = 'gecko'] = 0.1; // Gecko detected, look for
                            // revision
                            if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                                o[core] = numberify(m[1]);
                            }

                            // Firefox
                            if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                                o[shell = 'firefox'] = numberify(m[1]);
                            }
                        }
                    }
                }
            }
        }

        o.core = core;
        o.shell = shell;
        o._numberify = numberify;
        return o;
    }

    /*
     * @description: 将json对象转化为query string
     * @param obj json对象
     */
    function json2param(obj) {
        var buf = [],
            val,
            key, e = encodeURIComponent;

        for (key in obj) {
            val = obj[key];
            buf.push(e(key) + "=" + (val !== undefined ? e(val) : ""));
        }

        return buf.join('&');
    };

    returnService.loadPage = function(targetUrl, componetXmlUrl) {

        /*
         * @param targetUrl @trype String 目标url 相对路径 @param componetXmlUrl @type
         * string 容器url 相对路径
         */
        var ua = _getMobileAgent();
        if (ua["mobile"]) {

            // var serverUrl=$.cookie("serverBaseUrl");
            if (typeof(componetXmlUrl) == "undefined" || $.trim(componetXmlUrl) == "") {
                componetXmlUrl = "viewhome/xml/PureWeb.scene.xml";

            } else {

            }
            if (targetUrl == "") {
                alert("targetUrl参数不能为空 ");
            }


            componetXmlUrl = encodeURI(componetXmlUrl);
            if (config.mobileDebug) {
                alert("targetUrl = " + targetUrl);
                alert("componetXmlUrl = " + componetXmlUrl);
            }

            var pushScene = new horiService.NativeOperation("application", "pushScene", [componetXmlUrl, targetUrl]);
            pushScene.dispatch();
            horiService.flushOperations();
        } else {
            if (config.browserDebug) {
                $location.url(targetUrl);
                return;
            }
        }
    }

    /*
     * @param forceRefresh @type:string @default:"0" 如果强制刷新传"1" 即可
     */
    returnService.backPage = function(forceRefresh) {
        var ua = _getMobileAgent();
        if (ua["mobile"]) {
            if (typeof(forceRefresh) == "undefined" || parseInt(forceRefresh, 10) == 0) {

                var refreshFlag = "0";
            } else {
                var refreshFlag = "1";
            }
            var popScene = new horiService.NativeOperation("application", "popScene", [refreshFlag]);

            popScene.dispatch();

            horiService.flushOperations();

        } else {

            if (config.browserDebug) {
                window.history.go(-1);
                return;
            }
        }
    }



    returnService.showLoading = function() {
        // 调用原生loading页面
        if (config.browserDebug) {


        }
        if (_getMobileAgent()["mobile"]) {

            var loading = new horiService.NativeOperation("application", "showLoadingSheet", ["20"]);
            loading.dispatch();
            horiService.flushOperations();
        }

    }


    returnService.hideLoading = function() {
        // 隐藏原生loading页面
        // @return :无
        if (config.browserDebug) {

        }
        if (_getMobileAgent()["mobile"]) {
            var hiddenLoading = new horiService.NativeOperation("application", "hideLoadingSheet", []);
            hiddenLoading.dispatch();
            horiService.flushOperations();

        }
    }

    returnService.getDeviceId = function(callback) {
        /*
         * @description:返回设备的uuid @return :uuid或空串 @type:string @param:callback
         * 回调函数
         */
        if (angular.isFunction(callback)) {

            var getdeviceIdNative = new horiService.NativeOperation("application", "getDeviceId", []).dispatch();

            var horiServiceScript = new horiService.ScriptOperation(function() {
                var deveiceId = "";
                deveiceId = getdeviceIdNative.returnValue;
                callback.apply(this, [deveiceId]);

            });

            horiServiceScript.addDependency(getdeviceIdNative);
            horiServiceScript.dispatch();
            horiService.flushOperations();

        } else {
            alert("请传入正确的回调函数");
        }
    }

    returnService.getMobileType = function() {
        /*
         * @description:得到手机类型
         * @return undefined 表示是浏览器
         * |apple|android|webos|nokia
         */
        return _getMobileAgent()["mobile"];
    }

    returnService.setHeaderTitle = function(title) {
        var headerTitle = "";
        if (title) {
            headerTitle = title;
        }
        var titleOperation = new horiService.NativeOperation("case", "setProperty", ["title", headerTitle]).dispatch();
        horiService.flushOperations();
    }


    returnService.hideBackBtn = function() {
        var setNavigationBack = new horiService.NativeOperation("case", "setProperty", ["backButtonHidden", "1"]);
        setNavigationBack.dispatch();
        horiService.flushOperations();

    }

    returnService.getDeviceToken = function(callback) {
        /*
         * getDeviceToken()
         *
         * @description:返回 设备64 位tokenapns 发消息用 @return :64位token 或空串
         * @type:string @param:callback 回调函数
         */
        if (angular.isFunction(callback)) {

            var getdeviceTokeyNative = new horiService.NativeOperation("application", "getDeviceToken", []).dispatch();

            var horiServiceScript = new horiService.ScriptOperation(function() {
                var deveiceToken = "";
                deveiceToken = getdeviceTokeyNative.returnValue;

                callback.apply(this, [deveiceToken]);

            });

            horiServiceScript.addDependency(getdeviceTokeyNative);
            horiServiceScript.dispatch();
            horiService.flushOperations();

        } else {
            alert("请传入正确的回调函数");
        }
    }

    returnService.getClientVersion = function(callback) {
        /*
         * getClientVersion @description:返回 设备版本号 @return :客户端版本号 或空串
         * @type:string
         */
        if (angular.isFunction(callback)) {

            if (_getMobileAgent()["mobile"]) {
                var getClientVersionNative = new horiService.NativeOperation("application", "getClientVersion", []).dispatch();

                var horiServiceScript = new horiService.ScriptOperation(function() {
                    var clientVersion = "";
                    clientVersion = getClientVersionNative.returnValue;

                    callback.apply(this, [clientVersion]);

                });

                horiServiceScript.addDependency(getClientVersionNative);
                horiServiceScript.dispatch();
                horiService.flushOperations();
                return
            }
            if (config.browserDebug) {
                callback.apply(this, ["0.0"]);
            }

        } else {
            alert("请传入正确的回调函数");
        }
    }
    returnService.ajax = function(args) {


        if (typeof(args["type"]) == "undefined") {
            args.type = "get";
        }
        if (typeof(args["data"]) == "undefined") {
            args.data = "";
        }
        if (typeof(args["url"]) == "undefined") {
            alert("参数URL是必须参数请输入");
            return;
        }
        /*
         if(typeof(args["success"])=="undefined" || !($.isFunction(args["success"]))){
             alert("参数success是必须参数，只能是函数");
             return ;
         }
         if(typeof(args["error"])=="undefined" || !($.isFunction(args["error"]))){
             alert("参数error 是必须参数,只能是函数");
             return ;
         }
         */
        var method = args.type;
        var url = args.url;
        var data = args.data;
      
        //转换url中多余 /,以兼容ios路径中/多个无法解析问题
        url = url.substring(0,url.indexOf("://")+ 3) + url.substring(url.indexOf("://")+ 3).replace(/\/{2,}/g,"/");
        // 补全请求地址，默认添加appKey参数
        if(url.indexOf("?") != -1){
            url = url + "&data-application=" + config.appKey;
        }else{
            url = url + "?data-application=" + config.appKey;
        }

         if (config.browserDebug) {
            data = angular.isObject(data) ? json2param(data) : data;
            return $http({
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                url: url,
                data: data,
                method: (args.type).toUpperCase()
            });          



        } else {
           
                /*
                        模拟angular的 http调用，返回promise对象，参数模拟http调用，data为客户端返回的数据，其他参数暂时返回空串
                        fn(data, status, headers, config)
                */
                var deffer = $q.defer();
                var promise=deffer.promise;
                var requestDataOpration = new horiService.NativeOperation("application", "invokeAjax", [method.toLowerCase(), url, data]).dispatch();
                promise.success=function(fn){
                       
                        promise.then(function(clientData){
                            fn(clientData,"","","");
                        }) 
                        return promise;
                    }
                    promise.error=function(fn){
                        promise.then(null,function(clientData){
                            fn(clientData,"","","");
                        }) 
                        return promise;
                    }
                var horiServiceScript = new horiService.ScriptOperation(function() {
                    var returnData = "";
                    returnData = requestDataOpration.returnValue;
                    console.log(returnData)
                    //{"success":true,"data":"","msg":""}
                    returnData='{"success":true,"data":"","msg":""}'
                     var returnJson = angular.fromJson(returnData);
                    
                    if (returnJson.success) {
                        //success.apply(this,[returnJson.data]);
                        deffer.resolve(returnJson.data);
                    } else {
                        //error.apply(this,[returnJson.msg]);
                        deffer.reject(returnJson.data);
                    }


                });

                horiServiceScript.addDependency(requestDataOpration);
                horiServiceScript.dispatch();
                horiService.flushOperations();
                return promise;
           
        }


    }

    return returnService;
}])