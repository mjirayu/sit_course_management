var express = require('express');
var router = express.Router();
var yearSemesterData = require('./../models/year_semester');

var validate = require('./../helpers/validate');

router.get('/', function(req, res) {
  yearSemesterData.find({}, function(err, collection) {
    if (err)
      res.send(err);
    res.render('years/years', {datas: collection});
  });
});

router.get('/add', function(req, res) {
  res.render('years/year-add');
});

router.get('/current', function(req, res) {
  yearSemesterData.findOne({status:'active'})
    .sort('-year')
    .exec(function(err, collection) {
      if (err)
        res.send(err);
      res.send(collection);
    });
});

router.post('/', function(req, res) {
  data = {};
  data.year = req.body.Year;
  data.startSemesterOne = req.body.startsemester1;
  data.endSemesterOne = req.body.endsemester1;
  data.startSemesterTwo = req.body.startsemester2;
  data.endSemesterTwo = req.body.endsemester2;
  data.courselist = null;
  console.log(data);
  yearSemesterData.create(data, function(err, collection) {
    res.redirect('/years');
  });
});

router.get('/edit/:id', function(req, res) {
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
    res.render('years/edit', data);
  });

});

router.post('/edit/:id', function(req, res) {
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

router.post('/delete/:id', function(req, res) {
  yearSemesterData.findById(req.params.id).remove().exec();
  res.redirect('/years');
});

module.exports = router;
