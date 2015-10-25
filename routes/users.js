var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var multer  = require('multer');
var fs = require('fs');
var readline = require('readline');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },

  filename: function (req, file, cb) {
    if (file.mimetype == 'image/jpeg') {
      filetype = '.jpg';
    } else if (file.mimetype == 'image/png') {
      filetype = '.png';
    } else {
      filetype = '.csv';
    }

    cb(null, file.fieldname + '-' + Date.now() + filetype);
  },
});

var upload = multer({ storage: storage });

var auth = require('./../middlewares/auth');
var dataAuthUser = require('./../models/auth_user');
var dataUser = require('./../models/user_profile');

router.get('/', function(req, res, next) {
  dataUser.find({}, function(err, collection) {
    res.render('account/user', {datas: collection});
  });
});

router.get('/api', function(req, res, next) {
  dataUser.find({}).populate('auth').exec(function(err, collection) {
    res.json(collection);
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

  if (req.body.password == req.body.confirm_password) {
    dataUser.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      department: req.body.department,
      student_email: req.body.student_email,
      student_id: req.body.username,
      salt: salt,
      password: hashPwd(salt, req.body.password),
      entranced_year: req.body.entranced_year,
      last_update: today,
    });
  } else {
    res.redirect('/users/signup');
  }

  res.redirect('/users');
});

router.post('/csv', upload.single('csv'), function(req, res, next) {
  var read = readline.createInterface({
      input: fs.createReadStream(req.file.path),
      output: process.stdout,
      terminal: false
  });

  read.on('line', function(line) {
    var data = line.split(',');
    dataAuthUser.create({
      username: 'test',
    }, function(err, authUser) {
      if (err) {
        res.send(err);
      } else {
        dataUser.create({
          firstname: data[0],
          lastname: data[1],
          student_id: data[2],
          auth: authUser._id,
        }, function(err) {
          if (err) {
            res.send(err);
          } else {
            res.redirect('/users');
          }
        });
      }
    });
  });
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
