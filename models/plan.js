var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({
  plan_name: String,
  description: String,
  department: String,
  course_list: {
    plan: Array
  },
  last_update: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', planSchema);
