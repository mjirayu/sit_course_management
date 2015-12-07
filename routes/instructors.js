var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var multer  = require('multer');
var fs = require('fs');
var readline = require('readline');
var url = require('url');
var qs = require('querystring');

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

// ========== Middlewares ==========
var auth = require('./../middlewares/auth');

// ========== Models ==========
var dataAuthUser = require('./../models/auth_user');
var dataUser = require('./../models/user_profile');
var dataPlan = require('./../models/plan');
var dataDepartment = require('./../models/department');

// ========== Helpers ==========
var dateFunction = require('./../helpers/date');
var authtentication = require('./../helpers/auth');
var validate = require('./../helpers/validate');
var pagination = require('./../helpers/pagination');

//========== GET Instrutor ==========

router.get('/', auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  var perPage = 10;
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var params = qs.parse(url.parse(req.url).query);

  res.locals.createPagination = function(pages, page) {
    return pagination.createPagination(pages, page, params);
  };

  dataUser.find({position: { $ne: null } })
    .populate('auth', null, {is_instructor: 1})
    .populate('department')
    .skip(perPage * page)
    .limit(perPage)
    .sort('identity')
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

      dataUser.find({ position: { $ne: null } }).count().exec(function(err, count) {
        dataDepartment.find({}, function(err, departments) {
          res.render('account/instructor', {
            datas: datas,
            page: page,
            pages: count / perPage,
            departments: departments,
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage'),
            is_admin: req.user.is_admin,
            is_instructor: req.user.is_instructor,
            username: req.user.username,
          });
        });
      });

    });
});

// ========== End Instructor ==========

// ========== Edit Instructor ==========

router.get('/edit/:id', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  dataUser.findById(req.params.id)
    .populate('auth')
    .populate('department')
    .exec(function(err, collection) {
      dataDepartment.find({}, function(err, departments) {
        res.render('account/instructor-edit', {
          data: collection,
          is_admin: req.user.is_admin,
          is_instructor: req.user.is_instructor,
          username: req.user.username,
          departments: departments,
        });
      });
    });
});

router.post('/edit/:id', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  var today = dateFunction.getDate();
  dataUser.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "fullname": req.body.fullname,
        "department": req.body.department,
        "position": req.body.position,
        "entranced_year": req.body.entranced_year,
        "last_update": today,
      },
    },
    function(err, collection) {
      if (err) {
        message = validate.getMessage(err);
        res.send(message);
      }
    }
  );
  res.redirect('/instructors');
});

// ========== End Edit Instructor ==========

// ========== Delete Instructor ==========

router.post('/delete/:id', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  dataUser.findById(req.params.id, function(err, data) {
      dataAuthUser.findById(data.auth, function(err, authUser) {
        authUser.remove(function(err) {
          if (err) {
            message = validate.getMessage(err);
            res.send(message);
          } else {
            res.redirect('/instructors');
          }
        });
      });

      data.remove();
    });
});

// ========== End Delete Instructor ==========

// ========== Signup Instructor ==========

router.get('/signup', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  dataDepartment.find({}, function(err, departments) {
    res.render('account/instructor-signup', {
      errorMessage: req.flash('errorMessage'),
      is_admin: req.user.is_admin,
      is_instructor: req.user.is_instructor,
      departments: departments,
      username: req.user.username,
    });
  });
});

router.post('/signup', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  var today = dateFunction.getDate();
  var salt = authtentication.createSalt();

  if (req.body.password == req.body.confirm_password) {
    dataAuthUser.create({
        username: req.body.username,
        salt: salt,
        password: authtentication.hashPwd(salt, req.body.password),
        reset_password: '',
        is_instructor: 1,
        is_student: 0,
      }, function(err, data) {
        if (err) {
          message = validate.getMessage(err);
          req.flash('errorMessage', message);
          res.redirect('/instructors/signup');
        } else {
          dataUser.create({
            fullname: req.body.fullname,
            email: req.body.email,
            identity: req.body.identity,
            department: req.body.department,
            position: req.body.position,
            entranced_year: req.body.entranced_year,
            auth: data._id,
            last_update: today,
          }, function(err) {
            if (err) {
              data.remove();
              message = validate.getMessage(err);
              req.flash('errorMessage', message);
              res.redirect('/instructors/signup');
            } else {
              req.flash('successMessage', 'Sign Up Successfully');
              res.redirect('/instructors');
            }
          });
        }
      });
  }
});

// ========== End Signup Instructor ==========

// ========== CSV Instructor ==========

router.post('/csv', upload.single('csv'), auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  var salt = authtentication.createSalt();
  var today = dateFunction.getDate();
  var isColumn = true;

  if (req.file == undefined) {
    req.flash('errorMessage', ['Choose CSV file']);
    res.redirect('/instructors');
  } else if (req.file.mimetype != 'text/csv') {
    req.flash('errorMessage', ['Please use CSV file']);
    res.redirect('/instructors');
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
          username: data[3],
          password: '1234',
          salt: salt,
          reset_password: authtentication.generate_reset_password(),
          is_instructor: 1,
          is_student: 0,
        }, function(err, authUser) {
          if (err) {
            message = validate.getMessage(err);
            res.send(message);
          } else {
            dataDepartment.findOne({abbreviation: data[4]}, function(err, department) {
              dataUser.create({
                fullname: data[0],
                email: data[1],
                identity: data[2],
                department: department._id,
                position: data[5],
                auth: authUser._id,
                last_update: today,
              }, function(err) {
                if (err) {
                  authUser.remove();
                  message = validate.getMessage(err);
                  req.flash('errorMessage', message);
                  res.redirect('/instructors');
                }
              }).then(function() {
                req.flash('successMessage', 'Import CSV Successfully');
                res.redirect('/instructors');
              });
            });
          }
        });
      }

      isColumn = false;
    });
  }

  fs.unlink(req.file.path);
});

// ========== End CSV Instructor ==========

//========== Search Instructor ==========

router.get('/search', auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  var perPage = 10;
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var paramsPage = qs.parse(url.parse(req.url).query);

  var params = req.query;
  var instructor_id = new RegExp(params.instructor_id, 'i');
  var fullname = new RegExp(params.fullname, 'i');
  var position = new RegExp(params.position, 'i');

  res.locals.createPagination = function(pages, page) {
    return pagination.createPagination(pages, page, paramsPage);
  };

  dataUser
    .find({
      identity: { $regex: instructor_id },
      fullname: { $regex: fullname },
      position: { $regex: position},
      department: params.department,
      position: { $regex: position},
    })
    .populate('auth', null, {is_instructor: 1})
    .populate('department')
    .skip(perPage * page)
    .limit(perPage)
    .sort('identity')
    .exec(function(err, collection) {

      datas = collection.filter(function(item) {
        if (item.auth == null) return false;
        if (item.department == null) return false;
        return true;
      })
      .map(function(item) {
        return item;
      });

      dataUser.find({
        identity: { $regex: instructor_id },
        fullname: { $regex: fullname },
        department: params.department,
        position: { $regex: position},
      })
      .populate('auth')
      .populate('department')
      .exec(function(err, collection) {
        if (err) res.send(err);

        count = collection.filter(function(item) {
          if (item.department == null) return false;
          if (item.auth == null) return false;
          return true;
        })
        .map(function(item) {
          return item;
        }).length;

        dataDepartment.find({}, function(err, departments) {
          res.render('account/instructor', {
            datas: datas,
            fullName: params.fullname,
            instructorID: params.instructor_id,
            position: params.position,
            departmentSearch: params.department,
            page: page,
            pages: count / perPage,
            departments: departments,
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage'),
            is_admin: req.user.is_admin,
            is_instructor: req.user.is_instructor,
            username: req.user.username,
          });
        });
      });
    });
});

//========== End Search Instructor ==========

// ========== Approve Plan ==========

router.get('/approve_plan', auth, function(req, res) {
  if (req.user.is_instructor != 1) {
    res.redirect('/');
  }

  dataUser
    .findOne({
      auth: req.user._id,
    })
    .exec(function(err, data){
      dataUser.find({
        status: 'Pending',
        entranced_year: data.entranced_year,
        department: data.department,
      })
        .populate('department')
        .exec(function(err, collection) {
          res.render('account/instructor-approve', {
            datas: collection,
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage'),
            is_admin: req.user.is_admin,
            is_instructor: req.user.is_instructor,
            username: req.user.username,
          });
      });
    });
});


// ========== End Approve Plan ==========

module.exports = router;
