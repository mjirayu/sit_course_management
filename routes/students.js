var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var readline = require('readline');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },

  filename: function(req, file, cb) {
    if (file.mimetype == 'image/jpeg') {
      filetype = '.jpg';
    } else if (file.mimetype == 'image/png') {
      filetype = '.png';
    } else if (file.mimetype == 'text/csv') {
      filetype = '.csv';
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

// Helpers
var dateFunction = require('./../helpers/date');
var authtentication = require('./../helpers/auth');
var validate = require('./../helpers/validate');

router.get('/', function(req, res, next) {
  dataUser.find({})
    .populate('auth', null, {is_student: 1})
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

      res.render('account/student', {
        datas: datas,
        successMessage: req.flash('successMessage'),
      });
        
    });
});

router.get('/edit/:id', function(req, res) {
  dataUser.findById(req.params.id)
    .populate('auth')
    .exec(function(err, collection) {
      res.render('account/student-edit', {data: collection});
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

router.get('/signup', function(req, res) {
  res.render('account/student-signup', {errorMessage: req.flash('errorMessage')});
});

router.post('/signup', function(req, res) {
  var today = dateFunction.getDate();
  var salt = authtentication.createSalt();

  if (req.body.password == req.body.confirm_password) {
    dataAuthUser.create({
        username: req.body.username,
        salt: salt,
        password: authtentication.hashPwd(salt, req.body.password),
      }, function(err, data) {
        if (err) {
          message = validate.getMessage(err);
          req.flash('errorMessage', message);
          res.redirect('/students/signup');
        }

        dataUser.create({
          fullname: req.body.fullname,
          department: req.body.department,
          email: req.body.email,
          identity: req.body.identity,
          entranced_year: req.body.entranced_year,
          plan: req.body.plan_id,
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
  }
});

router.post('/csv', upload.single('csv'), function(req, res, next) {
  var today = dateFunction.getDate();
  var salt = authtentication.createSalt();
  var isColumn = true;
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
        password: authtentication.hashPwd(salt, '1234'),
      }, function(err, authUser) {
        if (err) {
          message = validate.getMessage(err);
          res.send(message);
        } else {
          dataPlan.findOne({plan_name: data[5]}, function(err , plan) {
            dataUser.create({
              fullname: data[0],
              department: data[1],
              email: data[2],
              identity: data[3],
              entranced_year: data[4],
              plan: {
                plan_name: plan.plan_name,
                status: plan.status,
                department: plan.department,
                course_list: plan.course_list
              },
              auth: authUser._id,
              last_update: today
            }, function(err) {
              if (err) {
                message = validate.getMessage(err);
                res.send(message);
              } else {
                req.flash('successMessage', 'Import CSV Successfully');
                res.redirect('/students');
              }
            });
          });
        }
      });
    }

    isColumn = false;
  });

  fs.unlink(req.file.path);
});

module.exports = router;
