var mongoose = require('mongoose');
var crypto = require('crypto');

module.exports = function(config) {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection errer...'));
  db.once('open', function() {
    console.log('multivision db opened');
  });

  var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    salt: String,
    hashed_pwd: String,
    roles: [String],
  });
  userSchema.methods = {
    authenticate: function(passwordToMatch) {
      return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    },
  };
  var User = mongoose.model('User', userSchema);

  User.find({}, function(err, collection) {
    if (collection.length === 0) {
      var salt;
      var hash;
      salt = createSalt();
      hash = hashPwd(salt, 'joe');
      User.create({firstName:'Joe', lastName: 'Eames', username:'joe', salt: salt, hashed_pwd: hash, roles: ['admin']});
      salt = createSalt();
      hash = hashPwd(salt, 'john');
      User.create({firstName:'John', lastName: 'Papa', username:'john', salt: salt, hashed_pwd: hash, roles: []});
      salt = createSalt();
      hash = hashPwd(salt, 'dan');
      User.create({firstName:'Dan', lastName: 'Wahlin', username:'dan', salt: salt, hashed_pwd: hash});
    }
  });
};

function createSalt() {
  return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(pwd).digest('hex');
}
