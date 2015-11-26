var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Department = require('./department');

var planSchema = new Schema({
  plan_name: String,
  description: String,
  department: {
    type: Schema.ObjectId,
    ref: 'Department',
  },
  course_list: {
    plan: Array
  },
  last_update: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', planSchema);
