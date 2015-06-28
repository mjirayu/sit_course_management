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
