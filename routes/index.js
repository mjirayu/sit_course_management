var express = require('express');
var router = express.Router();

// Middlewares
var auth = require('./../middlewares/auth');
var passport = require('./../middlewares/passport');

// Models
var dataPlan = require('./../models/plan');
var dataAuthUser = require('./../models/auth_user');
var dataUser = require('./../models/user_profile');
var dataDepartment = require('./../models/department');
var yearSemesterData = require('./../models/year_semester');

// Helpers
var dateFunction = require('./../helpers/date');
var authtentication = require('./../helpers/auth');
var validate = require('./../helpers/validate');

router.get('/', auth, function(req, res) {

  if (req.user.reset_password != '') {
    res.render('account/reset_password');
	} else if (req.user.is_student == 1) {
    res.render('dnd/dnd', req.user);
  } else if (req.user.is_admin == 1 ) {

    dataUser.find({entranced_year: {$ne: ''}, position: null}).distinct('entranced_year', function(error, entracnedYears) {
      dataDepartment.find({}, function(err, departments) {
        yearSemesterData.findOne({status:'Active'})
          .exec(function(err, year) {
            if (year == null) {
              var today = new Date();
              thisYear = Number(today.getFullYear());
            } else {
              thisYear = year.year;
            }

            dataDepartment.findOne({abbreviation: 'CS'}, function(err, departmentData) {
              if (departmentData == null) {
                res.redirect('/department');
              }

              dataUser
                .find({
                  entranced_year: { $gte: thisYear-3, $lte: thisYear },
                  position: null,
                  department: departmentData._id,
                })
                .exec(function(err, collection) {
                  data = [
                    {
                      1: {
                        count:0,
                        courselist:[]
                      },
                      2: {
                        count:0,
                        courselist:[]
                      },
                      3: {
                        count:0,
                        courselist:[]
                      },
                      4: {
                        count:0,
                        courselist:[]
                      },
                    },
                    {
                      1: {
                        count:0,
                        courselist:[]
                      },
                      2: {
                        count:0,
                        courselist:[]
                      },
                      3: {
                        count:0,
                        courselist:[]
                      },
                      4: {
                        count:0,
                        courselist:[]
                      },
                    },
                    {
                      1: {
                        count:0,
                        courselist:[]
                      },
                      2: {
                        count:0,
                        courselist:[]
                      },
                      3: {
                        count:0,
                        courselist:[]
                      },
                      4: {
                        count:0,
                        courselist:[]
                      },
                    },
                    {
                      1: {
                        count:0,
                        courselist:[]
                      },
                      2: {
                        count:0,
                        courselist:[]
                      },
                      3: {
                        count:0,
                        courselist:[]
                      },
                      4: {
                        count:0,
                        courselist:[]
                      },
                    },
                  ];

                  entracnedYears = entracnedYears.map(Number);
                  max = Math.max.apply(null, entracnedYears);
                  for (i = 1; i < 4; i++) {
                    entracnedYears.push(max+i);
                  }

                  collection.map(function(item, index) {
                    item.plan.map(function(plan, index) {
                      plan.course.map(function(course, index) {
                        if (course.type == 'elective') {
                          for(i = 0; i < 4; i++){
                            current = (thisYear + i) - item.entranced_year;
                            if (current >= 0 && current <= 3 && plan.year == (current+1)) {
                               data[i][current+1].count++;
                               data[i][current+1].courselist.push(course);
                            }
                          }
                        }
                      });
                    });
                  });

                  res.render('admin/admin', {
                    username: req.user.username,
                    is_admin: req.user.is_admin,
                    is_instructor: req.user.is_instructor,
                    departments: departments,
                    entracnedYears: entracnedYears.sort(),
                    thisYear: thisYear,
                    departmentSearch: departmentData._id,
                    data: data,
                  });
                });
            });
          });
      });
    });

  } else if (req.user.is_instructor == 1) {
    res.redirect('/instructors/approve_plan');
  }

});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/login', function(req, res) {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('login');
	}
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
	})
);

router.post('/reset_password', auth, function(req, res) {
  var today = dateFunction.getDate();

  if (req.body.password_confirm == req.body.password) {
    dataAuthUser.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'password': authtentication.hashPwd(req.user.salt, req.body.password),
          'reset_password': '',
          'last_update': today,
        },
      },
      function(err) {
        if (err) {
          message = validate.getMessage(err);
          res.send(message);
        }

        res.redirect('/logout');
      }
    );
  } else {
    res.redirect('/');
  }

});

router.get('/statistics/search', function(req, res) {
  var params = req.query;

  dataUser.find({entranced_year: {$ne: ''}}).distinct('entranced_year', function(err, entracnedYears) {
    dataDepartment.find({}, function(err, departments) {
      yearSemesterData.findOne({status:'Active'})
        .exec(function(err, year) {
          thisYear = Number(params.entranced_year);
          dataUser
            .find({
              entranced_year: { $gte: thisYear-3, $lte: thisYear },
              position: null,
              department: params.department,
            })
            .exec(function(err, collection) {
              data = [
                {
                  1: {
                    count:0,
                    courselist:[]
                  },
                  2: {
                    count:0,
                    courselist:[]
                  },
                  3: {
                    count:0,
                    courselist:[]
                  },
                  4: {
                    count:0,
                    courselist:[]
                  },
                },
                {
                  1: {
                    count:0,
                    courselist:[]
                  },
                  2: {
                    count:0,
                    courselist:[]
                  },
                  3: {
                    count:0,
                    courselist:[]
                  },
                  4: {
                    count:0,
                    courselist:[]
                  },
                },
                {
                  1: {
                    count:0,
                    courselist:[]
                  },
                  2: {
                    count:0,
                    courselist:[]
                  },
                  3: {
                    count:0,
                    courselist:[]
                  },
                  4: {
                    count:0,
                    courselist:[]
                  },
                },
                {
                  1: {
                    count:0,
                    courselist:[]
                  },
                  2: {
                    count:0,
                    courselist:[]
                  },
                  3: {
                    count:0,
                    courselist:[]
                  },
                  4: {
                    count:0,
                    courselist:[]
                  },
                },
              ];

              entracnedYears = entracnedYears.map(Number);
              max = Math.max.apply(null, entracnedYears);
              for (i = 1; i < 4; i++) {
                entracnedYears.push(max+i);
              }

              collection.map(function(item, index) {
                item.plan.map(function(plan, index) {
                  plan.course.map(function(course, index) {
                    if (course.type == 'elective') {
                      for(i = 0; i < 4; i++) {
                        current = (thisYear + i) - item.entranced_year;
                        if (current >= 0 && current <= 3 && plan.year == (current+1)) {
                           data[i][current+1].count++;
                           data[i][current+1].courselist.push(course);
                        }
                      }
                    }
                  });
                });
              });

              res.render('admin/admin', {
                username: req.user.username,
                is_admin: req.user.is_admin,
                is_instructor: req.user.is_instructor,
                departments: departments,
                entracnedYears: entracnedYears.sort(),
                departmentSearch: params.department,
                thisYear: thisYear,
                data: data,
              });
            });
        });
    });
  });

});

router.get('/test_data', function(req, res) {
  var params = req.query;

  var today = new Date();
  var thisYear = Number(params.entranced_year);

  dataUser
    .find({
      entranced_year: { $gte: thisYear-3, $lte: thisYear },
      department: params.department,
      position: null,
    })
    .exec(function(err, collection) {

      data_course = {
        1: {
          elective_list: [],
        },
        2: {
          elective_list: [],
        },
        3: {
          elective_list: [],
        },
        4: {
          elective_list: [],
        },
      }

      collection.map(function(item, index) {
        item.plan.map(function(plan, index) {
          plan.course.map(function(course, index) {
            if (course.type == 'elective') {
              current = thisYear - item.entranced_year;
              if(current >= 0 && current <= 3 && plan.year == (current+1)) {
                if (!(data_course[current+1].elective_list.indexOf(course.course_id) >= 0) && course.course_id != 'CSC000') {
                  data_course[current+1].elective_list.push({
                    'count': 1,
                    'course_id': course.course_id,
                  })
                } else {
                  data_course[current+1].elective_list.forEach(function(item) {
                    if(item['course_id'] == course.course_id) {
                      item.count++;
                    }
                  });
                }
              }
            }
          });
        });
      });

      list_course = [];
      for (obj in data_course) {
        data_course[obj].elective_list.map(function(course, index) {
          if (!(list_course.indexOf(course.course_id) >= 0)) {
            list_course.push(course.course_id);
          }
        })
      }

      list_count_course_by_year = {};
      for (obj in data_course) {
        list_course.map(function(course_id, index) {
          data_course[obj].elective_list.map(function(course, index) {
            if (course.course_id == course_id) {
              if (!list_count_course_by_year.hasOwnProperty(course_id)) {
                list_count_course_by_year[course.course_id] = {
                  count: {
                      1: 0,
                      2: 0,
                      3: 0,
                      4: 0,
                  }
                }
              }

              if (obj == 1) {
                list_count_course_by_year[course.course_id].count[obj]++;
              } else if (obj == 2) {
                list_count_course_by_year[course.course_id].count[obj]++;
              } else if (obj == 3) {
                list_count_course_by_year[course.course_id].count[obj]++;
              } else if (obj == 4) {
                list_count_course_by_year[course.course_id].count[obj]++;
              }
            }
          })
        });
      }

      res.send(list_count_course_by_year);
    });
});

module.exports = router;
