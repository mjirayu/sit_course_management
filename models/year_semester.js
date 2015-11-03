var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var yearSemesterSchema = new Schema({
  year: {
    type: Number,
    unique: true,
  },
  startSemesterOne: Date,
  endSemesterOne: Date,
  startSemesterTwo: Date,
  endSemesterTwo: Date,
  reserve_date: Boolean,
  status: {
    type: String,
    default: 'Inactive',
  },
  courselist: [{
    user_id:{
      type: Schema.ObjectId,
      ref: 'Auth_User',
      unique: true
    },
    course_id: {
      type: Schema.ObjectId,
      ref: 'courses',
      unique: true
    },
    message: String
    ,
    update_date: Date,
    action: String
  }],
  update_date: {
		type: Date,
		default: Date.now,
	}
}
);

module.exports = mongoose.model('Year_Semester', yearSemesterSchema);
