var crypto = require('crypto');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var dataUser = mongoose.model('user');
var flash = require('connect-flash');

// Passport configure
passport.use(new LocalStrategy(
	function(username, password, done){
		dataUser.findOne({username: username}, function(err, collection){
			var authenticated = checkPWD(collection, password);
			if(err) {
				return done(err);
			}
			if(!collection) {
				return done(null, false, {message:'Oops! invalid username!'});
			}
			if(!authenticated) {
				return done(null, false, {message:'Oops! invalid password!'});
			}
			return done(null, authenticated);
		});
	}
));

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(user, done){
	done(null, user);
});

module.exports = passport;

function hashPwd(salt, password) {
	var hmac = crypto.createHmac('sha1', salt);
	return hmac.update(password).digest('hex');
}

function checkPWD(data, pwd){
	if(!data){
		return false;
	}
	var salt = data.salt;
	var password = hashPwd(salt, pwd);
	if (!(password === data.password)) {
		return false;
	}
	return data;
}
