var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var departmentSchema = new Schema({
  name: {
    type: String,
    unique: 'This name is already exist',
    required: 'name is required!',
  },
  abbreviation: {
    type: String,
    unique: 'This name is already exist',
    required: 'name is required!',
  },
});

module.exports = mongoose.model('Department', departmentSchema);
