var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var multer  = require('multer');
var fs = require('fs');
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

// ========== Middlewares ==========
var auth = require('./../middlewares/auth');

// ========== Models ==========
var dataAuthUser = require('./../models/auth_user');
var dataUser = require('./../models/user_profile');
var dataPlan = require('./../models/plan');

// ========== Helpers ==========
var dateFunction = require('./../helpers/date');
var authtentication = require('./../helpers/auth');
var validate = require('./../helpers/validate');

//========== GET Instrutor ==========

router.get('/', function(req, res, next) {
  dataUser.find({})
    .populate('auth', null, {is_instructor: 1})
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

      res.render('account/instructor', {
        datas: datas,
        successMessage: req.flash('successMessage'),
        errorMessage: req.flash('errorMessage'),
      });

    });
});

// ========== End Instructor ==========

// ========== Edit Instructor ==========

router.get('/edit/:id', function(req, res) {
  dataUser.findById(req.params.id)
    .populate('auth')
    .exec(function(err, collection) {
      res.render('account/instructor-edit', {data: collection});
    });
});

router.post('/edit/:id', function(req, res) {
  var today = dateFunction.getDate();
  dataUser.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "fullname": req.body.fullname,
        "department": req.body.department,
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

router.post('/delete/:id', function(req, res) {
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

router.get('/signup', function(req, res) {
  res.render('account/instructor-signup', {errorMessage: req.flash('errorMessage')});
});

router.post('/signup', function(req, res) {
  var today = dateFunction.getDate();
  var salt = authtentication.createSalt();

  if (req.body.password == req.body.confirm_password) {
    dataAuthUser.create({
        username: req.body.username,
        salt: salt,
        password: authtentication.hashPwd(salt, req.body.password),
        is_instructor: 1,
        is_student: 0,
      }, function(err, data) {
        if (err) {
          message = validate.getMessage(err);
          req.flash('errorMessage', message);
          res.redirect('/instructors/signup');
        }

        dataUser.create({
          fullname: req.body.fullname,
          email: req.body.email,
          identity: req.body.identity,
          auth: data._id,
          last_update: today,
        }, function(err) {
          if (err) {
            data.remove();
            message = validate.getMessage(err);
            req.flash('errorMessage', message);
            res.redirect('/instructors/signup');
          }

          req.flash('successMessage', 'Sign Up Successfully');
          res.redirect('/instructors');
        });
      });
  }
});

// ========== End Signup Instructor ==========

// ========== CSV Instructor ==========

router.post('/csv', upload.single('csv'), function(req, res, next) {
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
          is_instructor: 1,
          is_student: 0,
        }, function(err, authUser) {
          if (err) {
            message = validate.getMessage(err);
            req.flash('errorMessage', message);
            res.redirect('/instructors');
          } else {
            dataUser.create({
              fullname: data[0],
              email: data[1],
              identity: data[2],
              auth: authUser._id,
              last_update: today,
            }, function(err) {
              if (err) {
                authUser.remove();
                message = validate.getMessage(err);
                req.flash('errorMessage', message);
                res.redirect('/instructors');
              } else {
                req.flash('successMessage', 'Import CSV Successfully');
                res.redirect('/instructors');
              }
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

router.get('/search', function(req, res, next) {
  var params = req.query;
  var instructor_id = new RegExp(params.instructor_id, 'i');
  var fullname = new RegExp(params.fullname, 'i');

  dataUser
    .find({
      identity: { $regex: instructor_id },
      fullname: { $regex: fullname },
    })
    .populate('auth', null, {is_instructor: 1})
    .exec(function(err, collection) {

      datas = collection.filter(function(item) {
        if (item.auth == null) return false;
        return true;
      })
      .map(function(item) {
        return item;
      });

      res.render('account/instructor', {
        datas: datas,
        fullName: params.fullname,
        instructorID: params.instructor_id,
        successMessage: req.flash('successMessage'),
        errorMessage: req.flash('errorMessage'),
      });
    });
});

//========== End Search Instructor ==========

// ========== Approve Plan ==========

router.get('/approve_plan', function(req, res) {
  dataUser.find({status: 'Pending'}, function(err, collection) {
    res.render('account/instructor-approve', {
      datas: collection,
      successMessage: req.flash('successMessage'),
      errorMessage: req.flash('errorMessage'),
    });
  });
});

// ========== End Approve Plan ==========

module.exports = router;
