var year = {
  year:4,
  semester:1,
};
var data = {
  name: 'Adisak Chaiyakul',
  plan_description:'Message',
  email:'adisakchaiyakul@gmail.com',
  roles:['student'],
  student_id:55130500235,
  message:"message",
  status:"pending",
  department:'CS',
  course_list: [
    {
      year:1,
      semester:1,
      course:[
        {course_id:'CSC101',name:'Java 1',credit:3,department:'cs',description:'course info'},
        {course_id:'CSC102',name:'Data mining 1',credit:3,department:'cs',description:'course info'},
        {course_id:'CSC103',name:'OOP',credit:3,department:'cs',description:'course info'}
      ]
    },
    {
      year:1,
      semester:2,
      course:[
        {course_id:'CSC201',name:'Java 1',credit:3,department:'cs',description:'course info'},
        {course_id:'CSC202',name:'Data mining 1',credit:3,department:'cs',description:'course info'},
        {course_id:'CSC203',name:'OOP',credit:3,department:'cs',description:'course info'}
      ]
    },
    {
      year:2,
      semester:1,
      course:[
        {course_id:'CSC301',name:'Java 1',credit:3,department:'cs',description:'course info'},
        {course_id:'CSC302',name:'Data mining 1',credit:3,department:'cs',description:'course info'},
        {course_id:'CSC303',name:'OOP',credit:3,department:'cs',description:'course info'}
      ]
    }
  ]
};





angular.module("app",["dndLists"]).controller("dndController", function($scope,$http) {
    $scope.courseFun = function(){
      $http.get('http://localhost:3000/api/course').success(function(response) {$scope.courselist = response; $scope.testname = "success"; console.log(response);});

    };
    $scope.courselist = ["a","b"];
    $scope.year = year;
    $scope.allowType = "it";
    $http.get('http://localhost:3000/api/plan/5625680bfd6f31d00ecd8679').success(function(response) {$scope.models = response; console.log(response);});

    $scope.alertData = function(data){
      alert(data);
    };

    // Generate initial model


    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
    }, true);

});
