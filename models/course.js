var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User_Profile = require('./user_profile');

var courseSchema = new Schema({
  course_name: String,
  course_id: {
    type: String,
    unique: true,
  },
  credit: String,
  instructor: {
    type: Schema.ObjectId,
    ref: 'User_Profile'
  },
  department: String,
  prerequisite: Array,
  description: String,
  recommended_year: Number,
  type: String,
  last_update: String,
});

module.exports = mongoose.model('Course', courseSchema);
