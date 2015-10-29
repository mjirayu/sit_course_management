var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Auth_User = require('./auth_user');
var Plan  = require('./plan');

var userProfileSchema = new Schema({
  fullname: {
    type: String,
    unique: true,
  },
  department: String,
  student_email: {
    type: String,
    unique: true,
  },
  student_id: {
    type: String,
    unique: true
  },
  entranced_year: String,
  plan: Object,
  auth: {
    type: Schema.ObjectId,
    ref: 'Auth_User'
  },
  last_update: String,
});

module.exports = mongoose.model('User_Profile', userProfileSchema);
