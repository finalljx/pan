/**
 * Created with JetBrains WebStorm.
 * User: lvjianxin
 * Date: 14-10-18
 * Timconfige: 下午3:26
 * To change this template use File | Settings | File Templates.
 * 具体用到的所有和配置相关都放在configService中
 */
angular.module('hori').factory('configService', [function() {
    return {
        browserDebug: true,
        mobileDebug: false,
        timeOutAlertStr: "请求服务器超时，请检查网络",
        // 默认ajax超时时间，单位毫秒
        timeout: 20000,
        oaServerName: "V7dev/DigiWin",
        oaMsgServer: "V7dev/DigiWin",
        oaMobileServer: "V7dev/DigiWin",
        serverBaseUrl: "http://localhost:8080/",
        encryptKey: "horiTech",
        appServerHost: "http://localhost:8080/"
    }
}]);

