angular.module('hori', ['ionic'])


.config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })
            .state('tabs.home', {
                url: "/home",
                views: {
                    'home-tab': {
                        templateUrl: "templates/home.html",
                        controller: "HomeCtrl"
                    }
                }
            })

        .state('tabs.fileList', {
                url: "/fileList?param1&param2&parent_dir",
                views: {
                    'home-tab': {
                        templateUrl: "templates/fileList.html",
                        controller: "FileListCtrl"
                    }
                }
            })
            .state('tabs.transList', {
                url: "/transList",
                views: {
                    'trans-tab': {
                        templateUrl: "templates/transList.html",
                        controller: 'transListCtrl'
                    }
                }
            })

        .state('tabs.more', {
                url: "/more",
                views: {
                    'more-tab': {
                        templateUrl: "templates/more.html",
                        controller: 'moreCtrl'
                    }
                }
            })
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })

        $urlRouterProvider.otherwise("/login");

    })
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$state', '$ionicLoading', '$ionicPopup','configService', 'deviceService', function($scope, $rootScope, $http, $state, $ionicLoading, $ionicPopup, configService,deviceService) {
        $scope.userInfo = {
            userName: "",
            password: ""
        };

        $scope.login = function() {
            console.log($scope.userInfo.userName);
            console.log($scope.userInfo.password);
            var usr = $scope.userInfo.userName;
            var password = $scope.userInfo.password;
            if (usr == "") {
                var alertPopup = $ionicPopup.alert({
                    title: '系统提示',
                    template: '请输入账号'
                });

                return false;
            }
            if (password == "") {
                var alertPopup = $ionicPopup.alert({
                    title: '系统提示',
                    template: '请输入密码'
                });

                return false;
            }
            password = hex_md5(password);
            $ionicLoading.show({
                template: '登陆中...'
            });
            var url=configService.appServerHost+'view/mebox/loginvalidate/api/login?data-header=X-Auth-User:' + usr + '&data-header=X-Auth-Key:' + password + '&data-convert=xml';
            console.log("login url="+url);
            deviceService.ajax({
                type: 'get',
                url: url
            }).success(function(data, status, headers, config) {

                console.log(data);
                if (data.success) {
                    $ionicLoading.hide();
                    localStorage.setItem("containerName", data.containerName);
                    localStorage.setItem("token", data.token);

                    $state.go("tabs.home");
                } else {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: '系统提示',
                        template: data.msg
                    });
                }


            }).error(function(data, status, headers, config) {
                $ionicLoading.hide();
                console.log(data);
                var alertPopup = $ionicPopup.alert({
                    title: '系统提示',
                    template: '登陆异常，请联系管理员'
                });
                $scope.fileLists = [];

            })

        }
    }])
    .controller('HomeCtrl', function($rootScope,$scope, $ionicLoading, $http, $state, $ionicHistory, $timeout, $ionicPopup, dataService) {
        $scope.fileLists = [];
        $rootScope.currentPath="";
        $rootScope.getDirFileList=function(dirPath,currentScope){
            
             var fileListPromise = dataService.getFileList(dirPath);

            fileListPromise.then(function(data) {

                currentScope.fileLists = data;
            }, function(errorData) {
                currentScope.fileLists = [];
            }, function(notifiyData) {

            })
        }
        
        $scope.getDirFileList("",$scope);
        
        $scope.doRefresh = function() {

            var fileListPromist = dataService.getUserFileList();

            fileListPromist.then(function(data) {

                $scope.fileLists = data;
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            }, function(errorData) {
                $scope.fileLists = [];
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply();
            }, function(notifiyData) {

            })

        };
        $scope.openDirectory = function(item) {
            console.log(item);
            if (item.type == "directory") {
                $state.go('tabs.fileList', {
                    "param1": item.id,
                    "param2": item.name,
                    "parent_dir": item.id
                });
            } else if (item.type == "file") {
                var confirmPopup = $ionicPopup.confirm({
                    title: '文件下载',
                    template: '确定要在线预览该文件？'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $ionicPopup.alert({
                            title: "开始下载"
                        })
                    } else {
                        console.log('You are not sure');
                    }
                });
            }

        };

        $scope.edit = function(item) {
            console.log(item);
        }
        $scope.share = function(item) {
                console.log(item);
            }
            // Triggered on a button click, or some other target
        $scope.showPopup = function() {
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.dirName">',
                title: '新建文件夹',
                subTitle: '请输入文件夹名称',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.dirName) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.data.dirName;
                        }
                    }
                }]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', $scope.data.dirName);
                $scope.fileLists.unshift({
                    "name": $scope.data.dirName,
                    "id": "file33",
                    "type": "directory"
                });
            });

        };

    })
    .controller('searchController', ['$rootScope','$scope', 'dataService', function($rootScope,$scope, dataService) {

        $scope.search = function(dirName, searchstr) {
            searchstr = $scope.searchKey;
            var dir =$scope.currentPath;
            console.log("searchstr="+searchstr);
            if(searchstr==""||typeof(searchstr)=="undefined"){
               
                 $rootScope.getDirFileList($rootScope.currentPath,$scope.$parent.$parent);
                 return false;
                
            }
            
            var fileListPromist = dataService.searchDir(dir, searchstr);

                fileListPromist.then(function(data) {

                $scope.$parent.$parent.fileLists = data;

            }, function(errorData) {
                $scope.fileLists = [];
            }, function(notifiyData) {

            })
        }
    }])
    .controller('HomeTabCtrl', function($scope) {
        console.log('HomeTabCtrl');
    })
    .controller('FileListCtrl', function($rootScope,$scope, $http, $stateParams, $state, $ionicHistory, $ionicNavBarDelegate, $ionicPopup, dataService) {
        console.log($stateParams);
        $scope.fileTitle = $stateParams.param2;
        //根据上层文件夹id获取文件列表
        $scope.fileLists = [];
        var dirId = $stateParams.param1;
        var parent_dir = $stateParams.parent_dir;
        if (parent_dir != "") {
            $rootScope.currentPath = parent_dir + "/" ;
        }
        $rootScope.getDirFileList($scope.currentPath,$scope);
        

        $scope.doRefresh = function() {
            $scope.fileLists.unshift({
                "name": "do three",
                "id": "file3",
                "type": "directory"
            });
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };

        $scope.openDirectory = function(item) {
            
            var thisDir = item.id;
            if (parent_dir != "") {
                thisDir = parent_dir + "/" + item.id;
            }
           
            if (item.type == "directory") {
                $state.go('tabs.fileList', {
                    "param1": item.id,
                    "param2": item.name,
                    "parent_dir": thisDir
                });
            } else if (item.type == "file") {
                var confirmPopup = $ionicPopup.confirm({
                    title: '文件下载',
                    template: '确定要在线预览该文件？'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $ionicPopup.alert({
                            title: "开始下载"
                        })
                    } else {
                        console.log('You are not sure');
                    }
                });
            }

        }
    })
    .controller('transListCtrl', function($scope, $http) {
        $scope.transList = [{
            "src": "aa.jpg",
            title: "111",
            date: "2014-01-02"
        }, {
            "src": "aa.jpg",
            title: "333",
            date: "2014-01-03"
        }]
        $scope.getTransingList = function() {
            $http.get("./test/transing.json").success(function(data, status, headers, config) {

                $scope.transList = data;

            }).error(function(data, status, headers, config) {
                $scope.transList = [];
            })
        };
        $scope.getTransedList = function() {
            $http.get("./test/transed.json").success(function(data, status, headers, config) {

                $scope.transList = data;

            }).error(function(data, status, headers, config) {
                $scope.transList = [];
            })
        }
    })
    .controller('moreCtrl', ['$scope', "$state", function($scope, $state) {
        $scope.devList = [{
            text: "仅在wifi下上传/下载",
            checked: true
        }, {
            text: "同步通讯录",
            checked: false
        }, {
            text: "相册自动备份",
            checked: false
        }];
        $scope.goLogin = function() {
            $state.go("login");
        }
    }])
