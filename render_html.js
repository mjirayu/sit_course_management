var courses = {
  "course_plan": [
      {
        "course1": "CSC101",
        "course2": "CSC102",
        "course3": "CSC103",
        "course4": "CSC104"
      },
  ]
};

var course_condition = {
    "courses": [
        {
            "course_id": "CSC101",
            "pre-req": [],
            "credit": 3,
            "recommend-year": [
                "1"
            ]
        }
    ]
}

var HTMLCourse = "<li><div data-course='%con%'>%data%</div></li>";

function renderCondition(){
  for (each in course_condition.courses){
    HTMLCourse = HTMLCourse.replace(
      "%con%", course_condition.courses[each]
    );
  }
}

function renderCourse(years){
  for (course in courses.course_plan) {
    keys = courses.course_plan[course];
    renderCondition();
    for (key in keys){
      courseFormat = HTMLCourse.replace(
        "%data%", courses.course_plan[course][key]
      );
      $(years).append(courseFormat);
    }
  }
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function addYears(){
  HTMLTest = "<div><h2>Years %count%</h2><ul id='year%count%' data-year='%count%' class='years'></ul></div>";
  count = $('.course').siblings().length + 1;
  HTMLTest = replaceAll("%count%", count, HTMLTest);
  $(HTMLTest).insertAfter($('.course').siblings(':last'));
  $('#list2, .years').dragsort("destroy");
  testDrag();
}

function testDrag() {
  	$(" #list2, .years").dragsort({ dragSelector: "div", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'><div>testtest</div></li>" });
}
