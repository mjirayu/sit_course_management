var crypto = require('crypto');

module.exports.createSalt = function() {
  return crypto.randomBytes(128).toString('base64');
};

var hashPwd = function(salt, password) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(password).digest('hex');
};

module.exports.hashPwd = hashPwd;

module.exports.checkPWD = function(data, pwd) {
  if (!data) {
    return false;
  }

  var salt = data.salt;
  var password = hashPwd(salt, pwd);
  if (!(password === data.password)) {
    return false;
  }

  return data;
};
