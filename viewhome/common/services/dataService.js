/**
 * User: gaoquansheng
 * Date: 2014-11-01
 * 提供各个功能模块的数据接口
 */
angular.module('hori').service('dataService', ['$q','$ionicLoading','configService', 'deviceService', function($q,$ionicLoading,configService, deviceService) {


    /*
        得到指定目录下文件夹及目录
    */
 this.getFileList = function(dirName) {
        
        var dir=dirName||"";
       
        var deffer = $q.defer();
        var url = configService.appServerHost + "view/mebox/blank/api/file/"+localStorage.getItem("containerName")+"/"+dir+"?data-header=X-Auth-Token:"+localStorage.getItem("token")+"&data-result=text";
        console.log(url);
        var allFilelist=[];
       
         $ionicLoading.show({
                template: '数据加载中...'
            });
        deviceService.ajax({
            'type': 'get',
            'url': url
        }).success(function(data, status, headers, config) {
            console.log("成功获取服务器内容");
            console.log(data)
           var dirsList=data.dirs;
          for(var i=0;i<dirsList.length;i++){
                var dirObj=new Object();
                dirObj.name=dirsList[i].name;
                dirObj.id=dirsList[i].name;
                dirObj.type="directory";
                dirObj.parent_dir=data.parent_dir;
                allFilelist.push(dirObj);
          }
          var fileList=data.files;
          for(var i=0;i<fileList.length;i++){
                var fileObj=new Object();
                fileObj.name=fileList[i].name;
                fileObj.id=fileList[i].name;
                fileObj.type="file";
                 fileObj.parent_dir=data.parent_dir;
                allFilelist.push(fileObj);
          }
            $ionicLoading.hide();
            deffer.resolve(allFilelist);

        }).error(function(data, status, headers, config) {
            $ionicLoading.hide();
            deffer.reject(allFilelist);
        })

        return deffer.promise;
    };
    /*
     * @description: 搜索当前目录下的所有文件及文件夹
     * @param dirName  文件夹名称，为空表示根目录
     @param searchStr 要搜索的关键字
     */
      this.searchDir = function(dirName,searchStr) {
        

        var deffer = $q.defer();

        // if(dirName!=""){
        //     dirName="/"+dirName;
        // }
         dirName="/"+dirName;
        var url = configService.appServerHost + "view/mebox/blank/api/search/"+localStorage.getItem("containerName")+dirName+"?q="+searchStr+"&data-header=X-Auth-Token:"+localStorage.getItem("token")+"&data-result=text";
        console.log("searchDir----url="+url);
        var allFilelist=[];
       
        
        deviceService.ajax({
            'type': 'get',
            'url': url
        }).success(function(data, status, headers, config) {
            
           var dirsList=data.dirs;
          for(var i=0;i<dirsList.length;i++){
                var dirObj=new Object();
                dirObj.name=dirsList[i].name;
                dirObj.id=dirsList[i].name;
                dirObj.type="directory";
                dirObj.parent_dir=data.parent_dir;
                allFilelist.push(dirObj);
          }
          var fileList=data.files;
          for(var i=0;i<fileList.length;i++){
                var fileObj=new Object();
                fileObj.name=fileList[i].name;
                fileObj.id=fileList[i].name;
                fileObj.type="file";
                 fileObj.parent_dir=data.parent_dir;
                allFilelist.push(fileObj);
          }
            deffer.resolve(allFilelist);

        }).error(function(data, status, headers, config) {
            deffer.reject(allFilelist);
        })

        return deffer.promise;
    };
   }]) 
    