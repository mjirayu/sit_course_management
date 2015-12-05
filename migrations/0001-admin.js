var mongodb = require('mongodb');
var authtentication = require('./../helpers/auth');

var salt = authtentication.createSalt();

exports.up = function(db, next){
    var users = db.collection('auth_users')
    users
        .insert({
          username: 'admin',
          salt: salt,
          password: authtentication.hashPwd(salt, 'root'),
          reset_password: '',
          is_admin: 1,
          is_instructor: 0,
          is_student: 0,
        }, next);
};

exports.down = function(db, next){
    next();
};
