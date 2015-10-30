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
  today = getTodayInString();
  dataUser.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        'fullname': req.body.firstname,
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
  today = getTodayInString();
  salt = createSalt();

  if (req.body.password == req.body.confirm_password) {
    dataUser.create({
      fullname: req.body.fullname,
      email: req.body.email,
      identity: req.body.identity,
      salt: salt,
      password: hashPwd(salt, req.body.password),
      last_update: today,
    });
  } else {
    res.redirect('/instructors/signup');
  }

  res.redirect('/instructors');
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
              last_update: date
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
