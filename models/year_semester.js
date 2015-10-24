var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var yearSemesterSchema = new Schema({
  year: Number,
  startSemesterOne: Date,
  endSemesterOne: Date,
  startSemesterTwo: Date,
  endSemesterTwo: Date,
  reserve_date: Array,
  status: {
    type: String,
    default: 'Inactive',
  },
});

module.exports = mongoose.model('Year_Semester', yearSemesterSchema);
