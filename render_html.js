var url='plan.json';

var data_json = $.getJSON(url).done(function(data) {
  $('#course-manage').append(render_data(data));
  $("#list2,.years").dragsort({ dragSelector: "div", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'><div>testtest</div></li>" });
});

function render_data(data){
  var title = "<h2>"+data.name+"</h2>";
  title = title+'<div id="years-lists" data-id ="'+data.id+'">';
  var i = 0;
  for (var key in data.course) {
    if (data.course.hasOwnProperty(key)) {
      i++;
      title = title+" "+render_year(key,data.course[key],i);
    }
  }
  title = title+"</div>";
  // console.log(data);
  // console.log(title);
  return title;
}

function render_year(key,data,year){
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

function render_semester(key,data,year){
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
