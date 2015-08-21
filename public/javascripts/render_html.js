
var url='/javascripts/plan.json';
var getUrl = window.location;
var api_path = getUrl.origin+"/api"+getUrl.pathname;






         






var data_json = $.getJSON(api_path).done(function(data) {
  console.log(data);
  $('#course-manage').append(render_data(data));
  $("#list2,.years").dragsort({ dragSelector: "div", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'><div>testtest</div></li>" });
  console.log(getCourseJson());
});
/// New function for map to database in mongoDB

function render_data(data){
  var dom_course = "<h2 class='plan_name'>"+data.plan_name+"</h2>";
  dom_course = dom_course+'<div id="years-lists" data-id ="'+data._id+'">';
    for(var key in data.plan_course){
        
        if(data.plan_course.hasOwnProperty(key)){
            dom_course = dom_course+" "+render_year(data.plan_course[key]);
        }
    }
  dom_course = dom_course+"</div>";
  return dom_course;

}

function render_year(data){
    var years_item = "<div>";
    years_item = years_item+"<div> Years "+data.years+"</div>";

    for(var key in data.years_course){
      if(data.years_course.hasOwnProperty(key)){
        years_item = years_item+" "+render_semester(data.years_course[key]);
      }

    }
    
    

    years_item = years_item+"</div>";
    return years_item;
}


function render_semester (data){

  var semester_item = '<p class="semester"> semester '+data.semester+'</p>';
  semester_item = semester_item + '<ul id="semester" data-year="1" class="years">';
  $.each(data.course_list,function(index,value){
    semester_item = semester_item + "<li><div data-couse-id="+value.course_code+">"+value.course_code+"</div><li>";

  });
  return semester_item;

}


/////OLD FUNCTION //////// For Test Only
function render_data_old(data){
  var title = "<h2>"+data.plan_name+"</h2>";
  title = title+'<div id="years-lists" data-id ="'+data._id+'">';
  var i = 0;
  for (var key in data.plan_course) {
    if (data.plan_course.hasOwnProperty(key)) {
      i++;
      title = title+" "+render_year(key,data.plan_course[key],i);
    }
  }
  title = title+"</div>";
  return title;
}

function render_year_old(key,data,year){
  var content = "<div>";
  content = content + "<h2>"+key+"</h2>";
  for(var key_i in data){
    if (data.hasOwnProperty(key_i)) {
      content = content + render_semester(key_i,data[key_i],year);
    }
  }
  content = content+"</div>";
  return content;
}

function render_semester_old(key,data,year){
  var content = '<p class="semester">'+key+'</p>';
  content = content + '<ul id="'+key+'-'+year+'" data-year="'+year+'" class="years">';
  $.each(data,function(index,value){
    content = content + "<li><div data-couse-id="+value+">"+value+"</div><li>";
  });
  content = content + "</ul>";
  return content;
}

var data_test = $.getJSON(url);
var test = data_test.responseText;

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

// function addYears(){
//   HTMLTest = "<div><h2>Years %count%</h2><ul id='year%count%' data-year='%count%' class='years'></ul></div>";
//   count = $('.course').siblings().length + 1;
//   HTMLTest = replaceAll("%count%", count, HTMLTest);
//   $(HTMLTest).insertAfter($('.course').siblings(':last'));
//   $('#list2, .years').dragsort("destroy");
//   testDrag();
// }

function testDrag() {
  $(" #list2, .years").dragsort({ dragSelector: "div", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'><div>testtest</div></li>" });
}




function getCourseJson(){
  var data = {};
  data.plan_name = $("#course-manage .plan_name").text();
  return data;
}





function getJSONPage() {
  var years = $('#years-lists h2');
  var list_years = [];
  var year_obj = {};
  var semesters = [];
  var semester_obj_list = [];
  var course_years = [];
  // semester
  $('#years-lists div ul').each(function() {
    semesters.push($(this).attr('id'))
  });
  // courses
  for (i in semesters){
    courses = [];
    $('#'+semesters[i]+ ' li div').each(function(){
      courses.push($(this).data('couseId'));
    });
    course_years.push(courses);
  }

  semester_obj = {};
  for (i=0; i < course_years.length; i += 2){
    semester_obj['semester-1'] = course_years[i];
    semester_obj['semester-2'] = course_years[i+1];
    semester_obj_list.push(semester_obj);
    semester_obj = {};
  }

  // years value
  for (i = 0; i < years.length; i++) {
    list_years.push(years[i].innerHTML);
  }
  // years assign object
  for (i = 0; i < list_years.length; i++){
    year_obj[list_years[i]] = semester_obj_list[i];
  }
  var data = {
    'name':$('#course-manage').children('h2').text(),
    'description': '',
    'course': year_obj
  };
  return data;
}


