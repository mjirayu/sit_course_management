var express = require('express');
var router = express.Router();

// Middlewares
var auth = require('./../middlewares/auth');
var passport = require('./../middlewares/passport');

// Models
var dataPlan = require('./../models/plan');
var dataUser = require('./../models/user_profile');



router.get('/', auth, function(req,res){
	console.log(req.user);
	res.render('./dnd/dnd',req.user);
});

router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/login',function(req, res){
	if(req.user){
		res.redirect('/');
	}else{
		res.render('login');
	}

});

router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
	}
));

router.get('/csv', function(req, res) {
	res.render('csv');
});

router.get('/test', function(req, res) {
	dataUser
		.findOne({})
		.populate('auth')
		.exec(function(err, data) {
			res.json(data);
		});
});

module.exports = router;
