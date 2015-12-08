var express = require('express');
var router = express.Router();
var objectId = require('mongoose').Types.ObjectId;

var auth = require('./../middlewares/auth');
var dataPlan = require('./../models/plan');
var dataUser = require('./../models/user_profile');
var dataCourse = require('./../models/course');
var datayearsemester = require('./../models/year_semester');
var dataDepartment = require('./../models/department');

router.get('/', auth, function(req, res, next) {
  res.redirect('/');
});

router.get('/department', auth, function(req, res, next) {
  dataDepartment.find({}, function(err, collection) {
    res.json(collection);
  });
});

router.get('/user/:id', auth, function(req, res, next) {
  dataUser.findOne({auth:req.params.id}, function(err, collection) {
    res.json(collection);
  });
});

router.post('/user/plan', auth, function(req, res) {
  console.log(req.body);
  data = {
    update_date: new Date(),
    course_id: objectId(req.body.course_id),
    user_id: objectId(req.user._id),
    action: req.body.action,
  };

  datayearsemester.findOne({status:'active'})
    .sort('year').update({}, { $push: {'courselist': data} })
    .exec(function(err, collection) {
    if (err) res.send(err);
    res.send(collection);
  });

});

router.post('/user/user_profile', auth, function(req, res) {
  data = req.body.data;
  if (data) {
    dataUser.findOne({_id:req.user._id}).update({}, { $set: {'plan':data} });
    res.send('success');
  } else {
    res.send('error');
	}
});

router.get('/defaultplan/:id', function(req, res, next) {
  dataPlan.findById(req.params.id)
    .populate('department')
    .exec(function(err, collection) {
      res.json(collection);
    });
});

router.get('/course', function(req, res) {
  dataCourse.find({})
  .populate('department')
  .exec(function(err, collection) {
    res.json(collection);
  });
});

router.post('/plan/:id', function(req, res, next) {
  var data = JSON.parse(req.body.data);
  dataPlan.findOne({_id:req.params.id}, function(err, collection) {
    console.log(data);
    collection.plan_course = data.plan_course;
    collection.save(function(err, data) {
      if (err) {
        res.send('Error');
      } else {
        res.send('Success');
			}
    });
  });
});

router.post('/plan', function(req, res, next) {
  dataPlan.create(req.body.data, function(err, collection) {
    if (err) {
			res.send(err);
    } else {
      res.send(collection);
    }
  });
});

router.put('/defaultplan/:id', function(req, res, next) {
  console.log(req.params.id);
  console.log(req.body);
  if (req.body.data) {
    console.log(JSON.parse(req.body.data));
    dataPlan.findByIdAndUpdate(
      req.params.id,
	    {
        $set: {
          'course_list': JSON.parse(req.body.data).course_list,
	      },
	    },
	    function(err, collection) {
        if (err) {
					console.log("ERRRRRRRRRRRRRRRRRRRRRR");
	        res.send(err);
        } else {
					res.send('ok');
				}
	    }
	  );
  } else {
    console.log('NO DATA');
    res.sendStatus(500);
	}
});

router.post('/plan/delete/:id', function(req, res, next) {
  dataPlan.findById(req.params.id).remove().exec();
  res.redirect('/plan');
});

router.get('/students/plan/:id', function(req, res) {
  dataUser
    .findById(req.params.id)
    .populate('department')
    .exec(function(err, data) {
      res.json(data);
    });
});

module.exports = router;
