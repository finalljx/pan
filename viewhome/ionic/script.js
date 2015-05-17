angular.module('hori', ['ionic'])
.controller('MyController',  function($scope,$ionicLoading){
  $scope.todos=[{"name":"do one"},{"name":"do two"}];
  $scope.doRefresh=function(){
    $scope.todos.unshift({"name":"do three"});
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$apply();
  }
  $scope.devList = [
    { text: "HTML5", checked: true },
    { text: "CSS3", checked: false },
    { text: "JavaScript", checked: false }
  ];
  $scope.getChecked=function(){
    console.log($scope.devList);
    $ionicLoading.show({
      duration:2000
    });
  }


})
.controller('MyControl', function($scope){

  $scope.shouldShowDelete=true;
  $scope.shoudShowRecorder=true;
  $scope.listCanSwipe=true;
  $scope.divList=[
    {text:"div1","img":"http://www.uimaker.com/uploads/allimg/120803/1_120803085209_1.jpg","description":"i am dev1"},
    {text:"div2","img":"http://www.uimaker.com/uploads/allimg/120803/1_120803085209_1.jpg","description":"i am dev1"},
    {text:"div3","img":"http://www.uimaker.com/uploads/allimg/120803/1_120803085209_1.jpg","description":"i am dev3"}
  ]
})
