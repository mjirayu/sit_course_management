var base_url = "http://localhost:3000/";
var year = {
  year:4  ,
  semester:1,
};

var selectElement = {};



angular.module("app",["dndLists"]).controller("dndController", function($scope,$http) {
    $scope.entranced_year = 2555;
    $scope.plandata = {};
    $http.get('http://localhost:3000/api/course').success(function(response) {
      $scope.courselist = response; console.log($scope.courselist);

    });
    $scope.register = function(){
      data_select = $('input[name="elective"]:checked').val();
      if(data_select){
        data = JSON.parse(data_select);
        $scope.plandata.plan[selectElement.items].course[selectElement.item].name = data.course_name;
        $scope.plandata.plan[selectElement.items].course[selectElement.item].course_id = data.course_id;
        $scope.plandata.plan[selectElement.items].course[selectElement.item].description = data.description;
        $scope.plandata.plan[selectElement.items].course[selectElement.item].department = data.department;
        $scope.plandata.plan[selectElement.items].course[selectElement.item].credit = data.credit;
        $scope.plandata.plan[selectElement.items].course[selectElement.item].type = 3;

        $('#myModal').modal('hide');
        console.log(data);
      }else{
        $('#myModal .alert-message').slideDown();
        setTimeout(function(){ $('#myModal .alert-message').slideUp(); },3000);
      }

      setTimeout(function(){ $scope.$apply(); },1000);
      // data = JSON.parse();
      //
      // console.log(data);
    };
    $scope.testfun = function(index1,index2){
      //data = "test";
      selectElement = {
        items: index1,
        item: index2
      }
      //alert(index1 + " " +index2);
    };
    $http.get(base_url+'years/current').success(function(response) {
      $scope.current_year = response;  console.log(response);

      if((new Date()).getTime() <= new Date(response.endSemesterOne).getTime()){
        console.log("Semester = "+1);
        $scope.semester = 1;
      }else{
        console.log("Semester = "+2);
        $scope.semester = response.year - $scope.entranced_year;
      }
      $scope.year = response.year - $scope.entranced_year;
      console.log(" year "+$scope.year);

    });




    $scope.allowType = "it";


    $http.get('http://localhost:3000/api/user/'+$('#userinfo input[name="id"]').val()).success(function(response) {
      console.log('User data ' + 'http://localhost:3000/api/user/'+$('#userinfo input[name="id"]').val());

      $scope.plandata = response; console.log(response);
    });

    $scope.alertData = function(data){
      alert(data);
    };

    // Generate initial model


    // Model to JSON for demo purpose
    $scope.$watch('plandata', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});
