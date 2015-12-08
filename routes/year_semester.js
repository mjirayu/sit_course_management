var express = require('express');
var router = express.Router();
var yearSemesterData = require('./../models/year_semester');

// Middlewares
var auth = require('./../middlewares/auth');

// Heplers
var validate = require('./../helpers/validate');

router.get('/', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  yearSemesterData.find({}, function(err, collection) {
    if (err)
      res.send(err);
    res.render('years/years', {
      datas: collection,
      is_admin: req.user.is_admin,
      is_instructor: req.user.is_instructor,
      username: req.user.username,
    });
  });
});

router.get('/add', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  res.render('years/year-add', req.user);
});

router.get('/current', auth, function(req, res) {


    yearSemesterData.findOne({status:'Active'})
      .sort('-year')
      .exec(function(err, collection) {
        if (err){
          res.send(err);
        }else{
          res.send(collection);
        }


      });



});

router.post('/', auth, function(req, res) {


  data = {};
  data.year = req.body.Year;
  data.startSemesterOne = req.body.startsemester1;
  data.endSemesterOne = req.body.endsemester1;
  data.startSemesterTwo = req.body.startsemester2;
  data.endSemesterTwo = req.body.endsemester2;
  data.courselist = null;

  yearSemesterData.create(data, function(err, collection) {
    res.redirect('/years');
  });
});

router.get('/edit/:id', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  yearSemesterData.findById(req.params.id, function(err, collection) {
    if (err)
      res.send(err);

    data = {};
    data.id = collection._id;
    data.year = collection.year;
    data.status = collection.status;
    var temp = new Date(collection.startSemesterOne);
    data.startSemesterOne = (temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear();
    temp = new Date(collection.endSemesterOne);
    data.endSemesterOne = (temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear();
    temp = new Date(collection.startSemesterTwo);
    data.startSemesterTwo = (temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear();
    temp = new Date(collection.endSemesterTwo);
    data.endSemesterTwo = (temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear();
    data.is_admin =  req.user.is_admin,
    data.is_instructor = req.user.is_instructor,
    data.username = req.user.username,
    res.render('years/edit', data);
  });

});

router.post('/edit/:id', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  yearSemesterData.findByIdAndUpdate(
    req.params.id,
      {
        $set: {
          'year': req.body.year,
          'status': req.body.status,
          'startSemesterOne': req.body.startsemester1,
          'endSemesterOne': req.body.endsemester1,
          'startSemesterTwo': req.body.startsemester2,
          'endSemesterTwo': req.body.endsemester2,
        },
      },
      function(err, collection) {
        if (err) {
          message = validate.getMessage(err);
          res.send(message);
        } else {
          res.redirect('/years');
        }
      }
    );
});

router.post('/delete/:id', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  yearSemesterData.findById(req.params.id).remove().exec();
  res.redirect('/years');
});

module.exports = router;
