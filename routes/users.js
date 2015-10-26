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

var auth = require('./../middlewares/auth');
var dataAuthUser = require('./../models/auth_user');
var dataUser = require('./../models/user_profile');
var dataPlan = require('./../models/plan');

router.get('/', function(req, res, next) {
  dataUser.find({}, function(err, collection) {
    res.render('account/user', {datas: collection});
  });
});

router.get('/edit/:id', function(req, res) {
  dataUser.findById(req.params.id)
    .populate('auth')
    .exec(function(err, collection) {
      res.render('account/user-edit', {data: collection});
    });
});

router.post('/edit/:id', function(req, res) {
  today = getTodayInString();
  dataUser.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        'firstname': req.body.firstname,
        'lastname': req.body.lastname,
        'department': req.body.department,
        'last_update': today,
      },
    },
    function(err, collection) {
      if (err) {
        res.send(err);
      }
    }
  );
  res.redirect('/users');
});

router.post('/delete/:id', function(req, res) {
  dataUser.findById(req.params.id, function(err, data) {
      dataAuthUser.findById(data.auth, function(err, authUser) {
        authUser.remove(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.redirect('/users');
          }
        });
      });

      data.remove();
    });
});

router.get('/signup', function(req, res) {
  res.render('account/user-signup');
});

router.post('/signup', function(req, res) {
  today = getTodayInString();
  salt = createSalt();

  if (req.body.password == req.body.confirm_password) {
    dataUser.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      department: req.body.department,
      student_email: req.body.student_email,
      student_id: req.body.student_id,
      salt: salt,
      password: hashPwd(salt, req.body.password),
      entranced_year: req.body.entranced_year,
      plan: req.body.plan_id,
      last_update: today,
    });
  } else {
    res.redirect('/users/signup');
  }

  res.redirect('/users');
});

router.post('/csv', upload.single('csv'), function(req, res, next) {
  date = getTodayInString();
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
        username: data[7],
        password: '1234',
      }, function(err, authUser) {
        if (err) {
          res.send(err);
        } else {
          dataPlan.findOne({plan_name: data[6]}, function(err , plan) {
            dataUser.create({
              firstname: data[0],
              lastname: data[1],
              department: data[2],
              student_email: data[3],
              student_id: data[4],
              entranced_year: data[5],
              plan: {
                plan_name: plan.plan_name,
                status: plan.status,
                department: plan.department,
                course_list: plan.course_list
              },
              auth: authUser._id,
              last_update: date
            }, function(err) {
              if (err) {
                res.send(err);
              } else {
                res.redirect('/users');
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

function createSalt() {
  return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, password) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(password).digest('hex');
}

function getTodayInString() {
  today = new Date();
  date = today.getDate();
  month = today.getMonth() + 1;
  year = today.getFullYear();
  today = month + '/' + date + '/' + year;
  return today;
}
