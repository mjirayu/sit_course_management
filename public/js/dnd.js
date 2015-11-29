var base_url = "http://55.55.55.55:3000/";
var year = {
  year:4,
  semester:1,
};

var selectElement = {};

angular.module('app', ['dndLists']).controller('dndController', function($scope, $http) {
  $scope.entranced_year = 2555;
  $scope.plandata = {};
  $http.get(base_url + 'api/course').success(function(response) {
    $scope.courselist = response;
    console.log($scope.courselist);
  });

  $scope.save = function() {

    if ($scope.plandata) {
      console.log('true');
      $http({
        method: 'POST',
        url: base_url + 'students/update',
        data: {data: $scope.plandata.plan},
      }).then(function(response) {
        console.log(response);
        alert('success');
      },

      function(response) {
        console.log(response);
      });
    } else {
      console.log('else');
    }
  };

  $scope.register = function() {
    data_select = $('input[name="elective"]:checked').val();
    if (data_select) {
      data = JSON.parse(data_select);
      $scope.plandata.plan[selectElement.items].course[selectElement.item].name = data.course_name;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].course_id = data.course_id;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].description = data.description;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].department = data.department;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].credit = data.credit;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].type = 3;
      data = {course_id: data.course_id, action :'regis'};
      $http({
        method: 'POST',
        url: base_url + 'api/user/plan',
        data: data,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function(response) {
        console.log(response);
      });

      $('#myModal').modal('hide');
      console.log(data);
    } else {
      $('#myModal .alert-message').slideDown();
      setTimeout(function() {
        $('#myModal .alert-message').slideUp();
      }, 3000);
    }

    setTimeout(function() {
      $scope.$apply();
    }, 1000);
  };

  $scope.testfun = function(index1, index2) {
    selectElement = {
      items: index1,
      item: index2,
    };
  };

  $scope.registercourse = function(course_id) {

  };

  $http.get(base_url+'years/current').success(function(response) {
    $scope.current_year = response;
    console.log(response);

    if ((new Date()).getTime() <= new Date(response.endSemesterOne).getTime()) {
      console.log('Semester = ' + 1);
      $scope.semester = 1;
    }else{
      console.log('Semester = ' + 2);
      $scope.semester = response.year - $scope.entranced_year;
    }

    $scope.year = response.year - $scope.entranced_year;
    console.log(' year ' + $scope.year);
  });

  $scope.allowType = 'it';

  $http.get(base_url + 'api/user/' + $('#userinfo input[name="id"]').val()).success(function(response) {
    console.log('User data ' + base_url + 'api/user/' + $('#userinfo input[name="id"]').val());

    $scope.plandata = response;
    console.log(response);
  });

  $scope.alertData = function(data){
    alert(data);
  };

  // Generate initial model
  // Model to JSON for demo purpose
  $scope.$watch('plandata', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);

}).controller('planController', function($scope,$http) {

  $scope.courselist = {};
  $http.get(base_url+ 'api/course').success(function(response) {
    $scope.courselist = response;
    console.log($scope.courselist);
  });

  $scope.plandata = {

    plan: [
      {
        course: [],
        semester: 1,
        year: 1,
      },
      {
        course: [],
        semester: 2,
        year: 1,
      },
      {
        course: [],
        semester: 1,
        year: 2,
      },
      {
        course: [],
        semester: 2,
        year: 2,
      },
      {
        course: [],
        semester: 1,
        year: 3,
      },
      {
        course: [],
        semester: 2,
        year: 3,
      },
      {
        course: [],
        semester: 1,
        year: 4,
      },
      {
        course: [],
        semester: 2,
        year: 4,
      },
    ],
  };

  $scope.save = function() {
    var data = {};
    data.department = $('select[name="department"]').val();
    data.description = $('input[name="description"]').val();
    data.plan_name = $('input[name="plan_name"]').val();
    data.course_list = angular.copy(this.plandata);
    if (data.department == '' || data.description == '' || data.plan_name == '') {
        $('.alert-message').slideDown().delay(2000).slideUp();
    } else {

      $http({
        method: 'POST',
        url: base_url + 'api/plan',
        data: {data: data},

      }).then(function(response){
        console.log(response);
        window.location.replace(base_url + "plan");
      }, function(response){
        console.log(response);
      });
    }
  };

  $scope.$watch('plandata', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);

}).controller('planControllerEdit', function($scope, $http) {

  $scope.courselist = {};
  $http.get(base_url + 'api/course').success(function(response) {
    $scope.courselist = response;
    console.log($scope.courselist);
  });

  var filter_course = function(id) {
    $scope.courselist = $scope.courselist.filter(function(element) {
      return element.course_id != id;
    });
  };

  $http.get(window.location.origin + '/api' + window.location.pathname).success(function(response) {
    $scope.plandata = response.course_list;
    console.log($scope.plandata);
    $("input[name='plan_name']").val(response.plan_name);
    $("input[name='description']").val(response.description);
    $('#Departmentinfo').text(response.department.abbreviation);

    if($scope.plandata.plan){
      $scope.plandata.plan.map(function(item){
        if(item.course){
          item.course.map(function(item){

            filter_course(item.course_id);
            console.log(item);
          });
        }else{
          alert(":()");
        }

      });
    }


  });

  $scope.save = function(){
    var data = {};
    data.department = $('select[name="department"]').val();
    data.description = $('input[name="description"]').val();
    data.plan_name = $('input[name="plan_name"]').val();
    data.course_list = angular.copy(this.plandata);
    if(data.department == "" || data.description == "" || data.plan_name == ""){
        $('.alert-message').slideDown().delay(2000).slideUp();
    }else{

      $.ajax({
        type:"PUT",
        url:base_url + 'api' + window.location.pathname, data: {
          data: JSON.stringify(data)
        }
      }).done(function(data) {
        console.log(data);
        window.location.replace(base_url + "plan");

      }).fail(function(data) {
        console.log("fail");
        console.log(data);
      });

    }
  };

  $scope.$watch('plandata', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);
}).controller("planControllerApprove", function($scope,$http) {

  $http.get(window.location.origin + "/api" + window.location.pathname).success(function(response) {
    console.log(response);
    $scope.plandata = response; console.log($scope.plandata);
    $("input[name='plan_name']").val(response.fullname);

    $('#Departmentinfo').text(response.department.abbreviation);

    if($scope.plandata.plan){
      $scope.plandata.plan.map(function(item){
        if(item.course){
          item.course.map(function(item){

            filter_course(item.course_id);
            console.log(item);
          });
        }else{
          alert(":()");
        }

      });
    }

  });

  $scope.approve = function(){

    console.log($scope.plandata);
    $http.post(window.location.origin + "/students/edit/plan_status/" + $scope.plandata._id, {status: 'Approve'}).success(function(response) {
      console.log(response);
      window.location.replace(base_url + "instructors/approve_plan");
    });

  };

  $scope.reject = function(){
    console.log($scope.plandata);
    $http.post(window.location.origin + "/students/edit/plan_status/" + $scope.plandata._id, {status: 'Reject'}).success(function(response) {
      console.log(response);
      window.location.replace(base_url + "instructors/approve_plan");
    });

  };

  $scope.$watch('plandata', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);
});
