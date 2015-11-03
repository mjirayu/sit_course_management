var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({
  name: String,
  plan_description: String,
  status: String,
  user_id:{
    type: Schema.ObjectId,
    ref: 'auth_user'
  },
  roles: Array,
  message: Array,
  course_list: Array,
  last_update: Date,
});

module.exports = mongoose.model('Plan', planSchema);
