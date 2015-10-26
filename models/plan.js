var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({
  plan_name: String,
  department: String,
  status: String,
  course_list: Array
});

module.exports = mongoose.model('Plan', planSchema);
