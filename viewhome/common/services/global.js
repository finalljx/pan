   /**
    * User: gaoquansheng
    * Date: 2014-11-02
    * 本地存储接口
    */
   angular.module('hori').factory("localStorage", function() {
       var storage = {};

       storage.set = function(key, value) {
           if (value !== undefined) {
               localStorage.setItem(key, value);
           }
       };

       storage.get = function(key) {
           return localStorage.getItem(key);
       };

       storage.remove = function(key) {
           localStorage.removeItem(key);
       };

       storage.clear = function() {
           localStorage.clear();
       };

       return storage;
   })

   /**
    * User: gaoquansheng
    * Date: 2014-11-01
    * 用于存储全局信息
    */
   angular.module('hori').service('global', ['localStorage', function(localStorage) {

       var _itcode = '',
           storageKey = 'hori-itcode';

       /*
        * @description: 存储用户itcode
        * @param itcode 用户itcode
        */
       this.setItcode = function(itcode) {
           _itcode = itcode;
           localStorage.remove(storageKey);
           localStorage.set(storageKey, itcode);
       };

       /*
        * @description: 获取用户itcode
        */
       this.getItcode = function() {
           if (_itcode.length === 0) {
               _itcode = localStorage.get(storageKey) || '';
           }

           return _itcode;
       };


       /*
        * @description: 从本地存储删除用户itcode
        */
       this.removeItcode = function() {
           localStorage.remove(storageKey);
           _itcode = '';
       };

   }]);
