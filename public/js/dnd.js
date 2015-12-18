var base_url = "http://localhost:3000/";
var year = {
  year:4,
  semester:1,
};

var selectElement = {};

angular.module('app', ['dndLists']).controller('dndController', function($scope, $http) {
  $scope.entranced_year = 2556;
  $scope.plandata = {};
  var old = {};

  $scope.dragend = function(){
    $scope.dragitem = -1;
  };
  $scope.drop = function(event, index, external, type){
    console.log(index);
    console.log(external);
  };
  $scope.dragoverCallback = function(course,event) {
    console.log(course);
    console.log(event);
    //$scope.dragitem = 4;
    //console.log($scope.plandata.plan);
    if($scope.plandata.plan instanceof Array){
      $scope.plandata.plan.map(function(items,index){
        if(items.course instanceof Array){
          //console.log(item);
          items.course.map(function(item, index){

            if(course.prerequisite instanceof Array){
              for(c in course.prerequisite){
                console.log(course.prerequisite[c]);
                console.log(item.course_id);
                console.log(item.index);
                if(course.prerequisite[c] == item.course_id){
                  $scope.dragitem = items.index;
                }
              }
              if(course.prerequisite == item.course_id){
                $scope.dragitem = items.index;
              }
            }else{
              if(course.prerequisite == item.course_id){
                $scope.dragitem = item.index;
              }
            }

          });
        }
        return items;
      });
    }

    return true;
  };

  $scope.condition = function(item){

  };
  $scope.dragitem = -1;



  $http.get(base_url + 'api/course').success(function(response) {
    if(response instanceof Array){
      $scope.courselist = response.filter(function(item, index){
        if(item.type == "elective"){
          return true;
        }else{
          return false;
        }
      });
    }

    console.log($scope.courselist);
  });
  $scope.message = function(){
    var text = $('input[name="message"]').val();
    $.ajax({
      type:"POST",
      url:base_url + 'api/message/' +$scope.plandata._id,
      data: {'message':$('input[name="message"]').val(),'id': $scope.plandata._id}
    }).done(function(data) {
      console.log(data);
      $('.message').prepend("<div class='row'><div class='mind-message'>"+text+"<div></div>")


    }).fail(function(data) {
      console.log("fail");
      console.log(data);
    });

    // $.post(base_url+'api/message/'+$scope.plandata._id,{'message':$('input[name="message"]').val()}, function(data){
    //   console.log(data);
    // });
  };
  $scope.save = function() {
    if($('button[name="save"]').data('save') == 'can'){
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
    }

  };

  $scope.register = function() {
    data_select = $('input[name="elective"]:checked').val();
    if (data_select) {
      data = JSON.parse(data_select);
      console.log(data);
      $scope.plandata.plan[selectElement.items].course[selectElement.item]._id = data._id;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].course_name = data.course_name;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].course_id = data.course_id;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].description = data.description;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].department = data.department;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].credit = data.credit;
      $scope.plandata.plan[selectElement.items].course[selectElement.item].type = data.type;
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
    var electivelist = [];
    $http.get(base_url + 'api/course').success(function(response) {

      if($scope.plandata.plan instanceof Array){
        $scope.plandata.plan.filter(function(item, index){
          item.course.filter(function(data, index){
            if(data.type == "elective"){
              electivelist.push(data.course_id);
            }
            return true;
          });
          return true;
        });
      }

      if(response instanceof Array){
        $scope.courselist = response.filter(function(item, index){
          if(item.type == "elective"){
            return true;
          }else{
            return false;
          }
        });

        $scope.courselist = $scope.courselist.filter(function(item, index){
          var check = true;
          electivelist.map(function(data, index){
            console.log(data == item.course_id);
            if(data == item.course_id){
              check = false;
            }
            return data;
          });
          console.log(item);
          if(check){
            return true;
          }else{
            return false;
          }
        });


      }

      console.log($scope.courselist);
    });
    console.log("testFun");






    // $scope.courselist = $scope.courselist.filter(function(item, index){
    //   if(item.course_id == "CSC000"){
    //     return true;
    //   }else{
    //     for(elective in electivelist){
    //       console.log(electivelist[1]);
    //       console.log(electivelist[elective] == item.course_id);
    //       console.log(electivelist[elective]);
    //       console.log(item.course_id);
    //       if(electivelist[elective] == item.course_id){
    //         return false;
    //       }else{
    //         return true;
    //       }
    //     }
    //   }
    //
    // });
    console.log(electivelist);
    console.log($scope.courselist);


    selectElement = {
      items: index1,
      item: index2,
    };
  };

  $scope.registercourse = function(course_id) {

  };



  $scope.allowType = 'it';

  $http.get(base_url + 'api/user/' + $('#userinfo input[name="id"]').val()).success(function(response) {
    console.log('User data ' + base_url + 'api/user/' + $('#userinfo input[name="id"]').val());
    count = 0;
    // if(response.plan instanceof Array){
    //   response.plan.map(function(item,index){
    //     if(item.course instanceof Array){
    //       item.course.map(function(item, index){
    //         item.index = count;
    //         count++;
    //         return item;
    //       });
    //     }else{
    //       return item;
    //     }
    //   });
    // }
    if(response.plan instanceof Array){
      response.plan.map(function(item,index){
        item.index = count;
        count++;
        return item;
      });
    }

    $scope.plandata = response;


    old = response.plan.map(function(item, index){
      data = {};
      data.course =  item.course.map(function(item, index){
        return {'_id': item._id,'course_id': item.course_id};
      });
      return data;
    });
    console.log(response);
    console.log('old');
      console.log(old);
  });

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

    $scope.year = (response.year - $scope.plandata.entranced_year)+1;
    console.log(response);
    console.log($scope.plandata.entranced_year);
    console.log(' year ' + $scope.year);
  });


  $scope.alertData = function(data){
    alert(data);
  };

  // Generate initial model
  // Model to JSON for demo purpose
  $scope.$watch('plandata', function(model) {
    var data = $scope.plandata;
    if(data.plan instanceof Array){
      data = data.plan.map(function(item, index){
        data = {};
        data.course =  item.course.map(function(item, index){
          return {'_id': item._id,'course_id': item.course_id};
        });
        return data;
      });
    }

    console.log(JSON.stringify(data));
    console.log(JSON.stringify(old));
    console.log(JSON.stringify(data) == JSON.stringify(old));
    $scope.modelAsJson = angular.toJson(model, true);


    if(JSON.stringify(data) == JSON.stringify(old)){
      //#929292 #2ecc71
      $('button[name="save"]').css({'background':'#929292'});
      $('button[name="save"]').data('save','can not');
    }else{
      $('button[name="save"]').css({'background':'#2ecc71'});
      $('button[name="save"]').data('save','can');
    }
  }, true);

}).controller('planController', function($scope,$http) {
  $scope.test = function(department){
    $http.get(base_url+ 'api/course').success(function(response) {
      if(response instanceof Array){
        $scope.courselist = response.filter(function(item, index){
          if(item.department.abbreviation == department){
            return true;
          }else{
            return false;
          }
        });
      }

      console.log(department);


    });
    console.log($scope.department);
  };
  $scope.dummy = [
    {
    course_name: "Dummy",
    course_id: "CSC000",
    credit: "3",

    department: {
    name: "Computer science",
    abbreviation: "CS",
    __v: 0
    },
    description: "Dummy course",
    type: "elective",
    __v: 0,
    corequisite: [
    "None"
    ],
    prerequisite: [
    "None"
    ]
    }];
  $scope.courselist = {};
  $http.get(base_url+ 'api/course').success(function(response) {
    if(response instanceof Array){

    }
    $scope.courselist = response.filter(function(item, index){
      console.log(item.type);
      if(item.type == "main"){
        return true;
      }else{
        return false;
      }
    });

    console.log($scope.courselist);


  });

  $http.get(base_url+ 'api/department').success(function(response) {
    $scope.departments = response;
    console.log($scope.departments);


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
    $http.post(window.location.origin + "/students/edit/plan_status/" + $scope.plandata._id, {status: 'Reject',message: $("textarea[name='message-reject']").val()}).success(function(response) {
      console.log(response);
      window.location.replace(base_url + "instructors/approve_plan");
    });

  };

  $scope.$watch('plandata', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);
});
