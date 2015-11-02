var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var authUserSchema = new Schema({
  username: {
    type: String,
    unique: 'This username is already exist!',
    required: 'username is required!',
  },
  password: {
    type: String,
    required: 'password is required!',
  },
  reset_password: String,
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

authUserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Auth_User', authUserSchema);
