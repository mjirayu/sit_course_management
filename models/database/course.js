var mongoose = require('mongoose');
var courseSchema = mongoose.Schema({
		course_name: String,
		course_id: String,
		credit: String,
		instructor: String,
		department: String,
		prerequisite: String,
		recommended_year: String,
    description: String,
		type: String,
	});


module.exports = courseSchema;
