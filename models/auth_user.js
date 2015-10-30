var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authUserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  salt: String,
  is_student: {
    type: Number,
    default: 1
  },
  is_instructor: {
    type: Number,
    default: 0
  },
  is_admin: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Auth_User', authUserSchema);
