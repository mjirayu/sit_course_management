var express = require('express');
var router = express.Router();
var yearSemesterData = require('./../models/year_semester');

router.get('/',function(req,res){
  res.render('years/year-add');
});
router.get('/current',function(req,res){
  yearSemesterData.findOne({status:'active'}).sort('-year').exec(function(err,collection){
    if(err) res.send(err);
    res.send(collection);
  });
});
router.post('/',function(req,res){
  data = {};
  data.year = req.body.Year;
  data.startSemesterOne = req.body.startsemester1;
  data.endSemesterOne = req.body.endsemester1;
  data.startSemesterTwo = req.body.startsemester2;
  data.endSemesterTwo = req.body.endsemester2;
  console.log(data);
  yearSemesterData.create(data,function(err,collection){
    if(err) res.send(err);
    res.redirect('/years');
  })
});

module.exports = router;
