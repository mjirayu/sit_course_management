var crypto = require('crypto');

module.exports.createSalt = function() {
  return crypto.randomBytes(128).toString('base64');
};

module.exports.generate_reset_password = function() {
  return crypto.randomBytes(16).toString('base64');
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

  if (data.reset_password != '') {
    if (data.reset_password === pwd) {
      return data;
    }
  }

  var salt = data.salt;
  var password = hashPwd(salt, pwd);

  if (!(password === data.password)) {
    return false;
  }

  return data;
};
