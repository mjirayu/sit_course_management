var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var json2csv = require('json2csv');
var readline = require('readline');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },

  filename: function(req, file, cb) {
    if (file.mimetype == 'text/csv') {
      filetype = '.csv';
    } else {
      filetype = '';
    }

    cb(null, file.fieldname + '-' + Date.now() + filetype);
  },
});

var upload = multer({ storage: storage });

// Middlewares
var auth = require('./../middlewares/auth');

// Models
var dataAuthUser = require('./../models/auth_user');
var dataUser = require('./../models/user_profile');
var dataPlan = require('./../models/plan');
var dataDepartment = require('./../models/department');

// Helpers
var dateFunction = require('./../helpers/date');
var authtentication = require('./../helpers/auth');
var validate = require('./../helpers/validate');

//========== GET Student ==========

router.get('/', function(req, res, next) {
  dataUser.find({})
    .populate('auth', null, {is_student: 1})
    .populate('department')
    .exec(function(err, collection) {
      if (err) {
        message = validate.getMessage(err);
        res.send(message);
      }

      datas = collection.filter(function(item) {
        if (item.auth == null) return false;
        return true;
      })
      .map(function(item) {
        return item;
      });

      dataUser.find().distinct('entranced_year', function(error, entracnedYears) {
        dataDepartment.find({}, function(err, departments) {
          res.render('account/student', {
            datas: datas,
            departments: departments,
            entracnedYears: entracnedYears,
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage'),
          });
        });
      });
    });
});

//========== End GET Student ==========

//========== Edit Student ==========

router.get('/edit/:id', function(req, res) {
  dataDepartment.find({}, function(err, departments) {
    dataUser.findById(req.params.id)
      .populate('auth')
      .exec(function(err, collection) {
        res.render('account/student-edit', {
          data: collection,
          departments: departments,
        });
      });
  });
});

router.post('/edit/:id', function(req, res) {
  var today = dateFunction.getDate();

  dataUser.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        'fullname': req.body.fullname,
        'department': req.body.department,
        'last_update': today,
      },
    },
    function(err, collection) {
      if (err) {
        message = validate.getMessage(err);
        res.send(message);
      }
    }
  );
  res.redirect('/students');
});

//========== End Edit Student ==========

// ========== Delete Student ==========

router.post('/delete/:id', function(req, res) {
  dataUser.findById(req.params.id, function(err, data) {
      dataAuthUser.findById(data.auth, function(err, authUser) {
        authUser.remove(function(err) {
          if (err) {
            message = validate.getMessage(err);
            res.send(message);
          } else {
            res.redirect('/students');
          }
        });
      });

      data.remove();
    });
});

// ========== End Delete Student ==========

//========== Sign Up Students ==========

router.get('/signup', function(req, res) {
  dataPlan.find({}, function(err, collection) {
    dataDepartment.find({}, function(err, departments) {
      res.render('account/student-signup', {
        errorMessage: req.flash('errorMessage'),
        plans: collection,
        departments: departments,
      });
    });
  });
});

router.post('/signup', function(req, res) {
  var today = dateFunction.getDate();
  var salt = authtentication.createSalt();

  dataAuthUser.create({
      username: req.body.username,
      salt: salt,
      reset_password: authtentication.generate_reset_password(),
      password: 'start',
    }, function(err, data) {
      if (err) {
        message = validate.getMessage(err);
        req.flash('errorMessage', message);
        res.redirect('/students/signup');
      }

      dataPlan.findOne({plan_name: req.body.plan_name}, function(err , plan) {
        dataUser.create({
          fullname: req.body.fullname,
          department: req.body.department,
          email: req.body.email,
          identity: req.body.identity,
          entranced_year: req.body.entranced_year,
          plan: plan.course_list.plan,
          auth: data._id,
          last_update: today,
        }, function(err) {
          if (err) {
            data.remove();
            message = validate.getMessage(err);
            req.flash('errorMessage', message);
            res.redirect('/students/signup');
          }

          req.flash('successMessage', 'Sign Up Successfully');
          res.redirect('/students');
        });
      });
    });
});

//========== End Sign Up Students ==========

//========== Search Student ==========

router.get('/search', function(req, res, next) {
  var params = req.query;
  var student_id = new RegExp(params.student_id, 'i');
  var department = new RegExp(params.department, 'i');
  var entranced_year = new RegExp(params.entranced_year, 'i');
  var fullname = new RegExp(params.fullname, 'i');

  dataUser
    .find({
      identity: { $regex: student_id },
      entranced_year: { $regex: entranced_year },
      fullname: { $regex: fullname },
    })
    .populate('department', null, {abbreviation: { $regex: department }})
    .populate('auth', null, {is_student: 1})
    .exec(function(err, collection) {

      if (err) res.send(err);
      datas = collection.filter(function(item) {
        if (item.department == null) return false;
        if (item.auth == null) return false;
        return true;
      })
      .map(function(item) {
        return item;
      });

      dataUser.find().distinct('entranced_year', function(error, entracnedYears) {
        dataDepartment.find({}, function(err, departments) {
          res.render('account/student', {
            datas: datas,
            departments: departments,
            departmentSearch: params.department,
            entrancedYearSearch: params.entranced_year,
            entracnedYears: entracnedYears,
            fullName: params.fullname,
            studentID: params.student_id,
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage'),
          });
        });
      });
    });
});

//========== End Search Student ==========

//========== Import CSV ==========

router.post('/csv', upload.single('csv'), function(req, res, next) {
  var today = dateFunction.getDate();
  var salt = authtentication.createSalt();
  var isColumn = true;

  if (req.file == undefined) {
    req.flash('errorMessage', ['Choose CSV file']);
    res.redirect('/students');
  } else if (req.file.mimetype != 'text/csv') {
    req.flash('errorMessage', ['Please use CSV file']);
    res.redirect('/students');
  } else {
    var read = readline.createInterface({
      input: fs.createReadStream(req.file.path),
      output: process.stdout,
      terminal: false,
    });

    read.on('line', function(line) {
      if (!isColumn) {
        var data = line.split(',');
        dataAuthUser.create({
          username: data[6],
          salt: salt,
          reset_password: authtentication.generate_reset_password(),
          password: 'start',
        }, function(err, authUser) {
          if (err) {
            message = validate.getMessage(err);
            res.send(message);
          } else {
            dataDepartment.findOne({abbreviation: data[1]}, function(err, department) {
              dataPlan.findOne({plan_name: data[5]}, function(err , plan) {
                console.log(department._id);
                dataUser.create({
                  fullname: data[0],
                  department: department._id,
                  email: data[2],
                  identity: data[3],
                  entranced_year: data[4],
                  plan: plan.course_list.plan,
                  auth: authUser._id,
                  last_update: today
                }, function(err) {
                  if (err) {
                    authUser.remove();
                    message = validate.getMessage(err);
                    res.send(message);
                  }
                });
              });
            }).then(function() {
              req.flash('successMessage', 'Import CSV Successfully');
              res.redirect('/students');
            });
          }
        });
      }

      isColumn = false;
    });

    fs.unlink(req.file.path);
  }
});

//========== End Import CSV ==========

//========== Export CSV ==========

router.get('/exports', function(req, res, next) {
  dataAuthUser.find({is_student: 1}, 'username reset_password', function(err, collection) {
    datas = collection.filter(function(item) {
      if (item.reset_password == '') return false;
      return true;
    })
    .map(function(item) {
      return item;
    });

    json2csv({data: datas, fields: ['username', 'reset_password']}, function(err, csv) {
      if (err) console.log(err);
      fs.writeFile('public/exports/file.csv', csv, function(err) {
        if (err) throw err;
        res.redirect('/exports/file.csv');
      });
    });
  });
});

//========== End Export CSV ==========

//========== Approve Plan ==========

router.get('/plan/:id', function(req, res) {
  res.render('account/approve', req.user);
});

router.get('/edit/plan_status/:id', function(req, res) {
  dataUser.findById(req.params.id)
    .populate('auth')
    .exec(function(err, collection) {
      res.render('account/student-edit-status', {data: collection});
    });
});

router.post('/edit/plan_status/:id', function(req, res) {
  var today = dateFunction.getDate();
  console.log(req.body);
  dataUser.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "status": req.body.status,
        "last_update": today,
      },
    },
    function(err, collection) {
      if (err) {
        message = validate.getMessage(err);
        res.send(message);
      } else {
        req.flash('successMessage', 'Change Status Successfully');
        res.redirect('/instructors/approve_plan');
      }
    }
  );
});

//========== End Approve Plan ==========

//========== DND ==========

router.post('/update', function(req, res) {
  var today = dateFunction.getDate();
  console.log(req.body.data);
  console.log(req.user._id);

  dataUser.findOneAndUpdate(
    {auth:req.user._id},
    {
      $set: {
        'status': 'Pending',
        'plan': req.body.data,
      },
    },
    function(err, collection) {
      if (err) {
        message = validate.getMessage(err);
        res.send(message);
      } else {
        res.send(collection);
      }
    }
  );
});

//========== End DND ==========

module.exports = router;
