angular.module('hori', ['ionic'])

.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
         $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])
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
                url: "/fileList?param1&param2",
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
        .state('login',{
          url:"/login",
          templateUrl: "templates/login.html",
          controller:'LoginCtrl'
        })

        $urlRouterProvider.otherwise("/login");

    })
.controller('LoginCtrl', ['$scope','$rootScope','$http','$state','deviceService', function($scope,$rootScope,$http,$state,deviceService){
  $scope.userInfo={
    userName:"",
    password:""
  };
  $scope.login=function(){
    console.log($scope.userInfo.userName);
    console.log($scope.userInfo.password);
    
    deviceService.ajax({type: 'get', url: 'http://localhost:8080/view/mebox/loginvalidate/api/login?data-header=X-Auth-User:demouser01&data-header=X-Auth-Key:96e79218965eb72c92a549dd5a330112&data-convert=xml'
}).success(function(data, status, headers, config) {

            console.log(data);
            if(data.success){
                $rootScope.containerName=data.containerName;
                $rootScope.token=data.token;
                $state.go("tabs.home");
            }
            

        }).error(function(data, status, headers, config) {
            $scope.fileLists = [];
        })
  
  }
}])
    .controller('HomeCtrl', function($scope, $ionicLoading, $http, $state, $ionicHistory, $ionicPopup, $timeout) {
        $scope.fileLists = [];
        $http.get("./test/home.json").success(function(data, status, headers, config) {

            $scope.fileLists = data;

        }).error(function(data, status, headers, config) {
            $scope.fileLists = [];
        })
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
            console.log(item);
            if (item.type == "directory") {
                $state.go('tabs.fileList', {
                    "param1": item.id,
                    "param2": item.name
                });
            } else if (item.type == "file") {
                var confirmPopup = $ionicPopup.confirm({
                    title: '文件下载',
                    template: '确定要在线预览该文件？'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $ionicPopup.alert({
                          title:"开始下载"
                        })
                    } else {
                        console.log('You are not sure');
                    }
                });
            }

        }
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
    .controller('HomeTabCtrl', function($scope) {
        console.log('HomeTabCtrl');
    })
    .controller('FileListCtrl', function($scope, $http, $stateParams, $state, $ionicHistory, $ionicNavBarDelegate) {
        console.log($stateParams);
        $scope.fileTitle = $stateParams.param2;
        //根据上层文件夹id获取文件列表
        $scope.fileLists = [];
        $http.get("./test/dir1.json").success(function(data, status, headers, config) {

            $scope.fileLists = data;

        }).error(function(data, status, headers, config) {
            $scope.fileLists = [];
        })
        $scope.doRefresh = function() {
            $scope.fileLists.unshift({
                "name": "do three",
                "id": "file3",
                "type": "directory"
            });
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };
        $scope.getFileList = function(item) {

            $state.go('tabs.fileList', {
                "param1": item.id,
                "param2": item.name
            });
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
    .controller('moreCtrl', ['$scope',"$state", function($scope,$state) {
        $scope.devList = [{
            text: "HTML5",
            checked: true
        }, {
            text: "CSS3",
            checked: false
        }, {
            text: "JavaScript",
            checked: false
        }];
        $scope.goLogin=function(){
          $state.go("login");
        }
    }])