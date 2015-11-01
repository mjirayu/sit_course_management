var crypto = require('crypto');
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

// Models
var dataAuthUser = require('./../models/auth_user');

// Helpers
var authtentication = require('./../helpers/auth');

// Passport configure
passport.use(new LocalStrategy(function(username, password, done) {
		dataAuthUser.findOne({username: username}, function(err, data) {
			var authenticated = authtentication.checkPWD(data, password);
			if (err) {
				return done(err);
			}
			if (!data) {
				return done(null, false, {message: 'Oops! invalid username!'});
			}
			if(!authenticated) {
				return done(null, false, {message:'Oops! invalid password!'});
			}
			return done(null, authenticated);
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

module.exports = passport;
