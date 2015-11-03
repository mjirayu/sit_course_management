var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var Auth_User = require('./auth_user');
var Plan  = require('./plan');

var userProfileSchema = new Schema({
  fullname: {
    type: String,
    unique: 'This name is already exist!',
    required: 'fullname is requried!',
  },
  department: {
    type: String,
  },
  email: {
    type: String,
    unique: 'This email is already exist!',
    required: 'email is requried!',
  },
  identity: {
    type: String,
    unique: 'This ID is already exist!',
  },
  entranced_year: String,
  plan: Array,
  auth: {
    type: Schema.ObjectId,
    ref: 'Auth_User',
    unique: 'This auth id is already exist!',
    required: 'auth id is requried!',
  },
  last_update: {
    type: String,
    required: 'last_update is required!',
  }
});

userProfileSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User_Profile', userProfileSchema);
