/**
 * User: gaoquansheng
 * Date: 2014-11-01
 * 提供用户验证服务
 */
angular.module('hori').service('authentication', ['configService', 'deviceService', 'global', function(configService, deviceService, global) {

    /*
     * @description: 登录
     * @param userModel 用户信息
     */
    this.login = function(userModel) {
        var url = '',
            data,
            promise;

        try {
            url = configService.appServerHost + "view/oa/loginvalidate/names.nsf?Login";
            url = url + "&data-random=" + (new Date().getTime());
        } catch (e) {

        }

        //登录数据模型
        data = {
            'Username': userModel.userName,
            'Password': userModel.password,
            'PublicAccess': 1,
            'ReasonType': 0,
            'data-userid': 'Username',
            'data-password': 'Password',
            'data-login': true
        };

        promise = deviceService.ajax({
            "type": "post",
            "url": url,
            "data": data
        })


        promise.then(function(result) {
            if (result && result.data && result.data.success) {
                global.setItcode(result.data.itcode);
            }
        });


        return promise;
    };

    /*
     * @description: 注销
     * @param
     */
    this.loginOff = function() {
        global.removeItcode();
    };

}]);
