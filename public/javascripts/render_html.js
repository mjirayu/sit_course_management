
var url='/javascripts/plan.json';
var getUrl = window.location;
var api_path = getUrl.origin+"/api"+getUrl.pathname;

var data_json = $.getJSON(api_path).done(function(data) {

  $('#course-manage').append(render_data(data));
  hideWhenDrop();

  $("#list2,.years").dragsort({ dragSelector: "div", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'>Drop here</li>" });
  var data =  JSON.stringify(getJson());
});

function hideWhenDrop(){
  $("#list2").mousedown(function(){
    $(".item").hide();
  }).mouseup(function(){
    $(".item").show();
  });

  $(".course").mousedown(function(){
    console.log($(this).data('rec-y'));
    canDropZone($(this).data('rec-y'));
  }).mouseup(function(){
    $( ".year" ).removeClass( "canDrop" ).removeClass( "cantCanDrop" );
  });
}

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
    var years_item = "<div class='year radius' data-year='"+data.years+"' >";
    years_item = years_item+"<div class='title yearname radius'> Years "+data.years+"</div>";

    for(var key in data.years_course){
      if(data.years_course.hasOwnProperty(key)){
        years_item = years_item+" "+render_semester(data.years_course[key]);
      }

    }
    years_item = years_item+"</div>";
    return years_item;
}

function render_semester (data){

  var semester_item = '<div class="semester" data-semester="'+data.semester+'"><p class="title"> Semester '+data.semester+'</p>';
  semester_item = semester_item + '<ul data-year="1" class="years semester-list">';
  $.each(data.course_list,function(index,value){
    semester_item = semester_item + "<li class='item' data-couse-id='"+value.course_code+"' data-id='"+value.course_id+"'><div data-couse-id="+value.course_code+">"+value.course_code+"</div></li>";

  });
  semester_item = semester_item + '</ul></div>';
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
  $(" #list2, .years").dragsort({
    dragSelector: "div",
    dragBetween: true,
    dragEnd: saveOrder,
    placeHolderTemplate: "<li class='placeHolder'><div>testtest</div></li>"
  });
}

function getCourseJson() {
  var data = {};
  data.plan_name = $("#course-manage .plan_name").text();
  return data;
}

function getJson() {
  var data = {};
  data.plan_course = [];
  $('#years-lists .year').each(function() {
   var data_year = {};
   data_year.years = $(this).data('year');
   data_year.years_course = getJsonYear($(this));
   data.plan_course.push(data_year);
  });

  return data;
}
function getJsonYear(data){
  data_year =[];
  data.find(".semester").each(function(){
    var data_semester = {};
    data_semester.semester = $(this).data("semester");
    data_semester.course_list = getJsonCouseList($(this));
    data_year.push(data_semester);
  });
  return data_year;
}

function getJsonCouseList(data){
  data_couse_list = [];
  data.find('li').each(function(){
      data = {};
      data.course_code = $(this).data('couse-id');
      data.course_id = $(this).data('id');
      data_couse_list.push(data);
  });
  return data_couse_list;
}

function post_Data() {
  var data =  JSON.stringify(getJson());
  $.post( api_path, {data: data}).done(function( data ) {
    alert( "Save data : " + data );
  });
}

function canDropZone(year){
  $(".year").each(function(){
    if($(this).data('year')>=year){
      $(this).addClass('canDrop');
    }else{
      $(this).addClass('cantCanDrop');
    }
  });
}

function canDropReset(){
  $(".year").each(function(){
    $(this).removeClass('candrop').removeClass('candrop');
  });
}
