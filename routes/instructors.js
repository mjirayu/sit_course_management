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

router.get('/', function(req, res, next) {
  dataUser.find({})
    .populate('auth', null, {is_instructor: 1})
    .exec(function(err, collection) {
      if (err) res.send(err);
      datas = collection.filter(function(item) {
        if (item.auth == null) return false;
        return true;
      })
      .map(function(item) {
        return item;
      });

      res.render('account/instructor', {datas: datas});
    });
});

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
        "fullname": req.body.firstname,
        "department": req.body.department,
        "last_update": today,
      },
    },
    function(err, collection) {
      if (err) {
        res.send(err);
      }
    }
  );
  res.redirect('/instructors');
});

router.post('/delete/:id', function(req, res) {
  dataUser.findById(req.params.id, function(err, data) {
      dataAuthUser.findById(data.auth, function(err, authUser) {
        authUser.remove(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.redirect('/instructors');
          }
        });
      });

      data.remove();
    });
});

router.get('/signup', function(req, res) {
  res.render('account/instructor-signup');
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
          res.send(err);
        }

        dataUser.create({
          fullname: req.body.fullname,
          email: req.body.email,
          identity: req.body.identity,
          auth: data._id,
          last_update: today,
        }, function(err) {
          if (err) {
            res.send(err);
          }

          res.redirect('/instructors/signup');
        });
      });
  }

  res.redirect('/instructors');
});

router.post('/csv', upload.single('csv'), function(req, res, next) {
  var today = dateFunction.getDate();
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
        password: '1234',
      }, function(err, authUser) {
        if (err) {
          res.send(err);
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
              last_update: today,
            }, function(err) {
              if (err) {
                res.send(err);
              } else {
                res.redirect('/instructors');
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
