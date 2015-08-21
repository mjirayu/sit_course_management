var mongoose = require('mongoose');
var coursePlanSchema = mongoose.Schema({
		plan_name: String,
		plan_course: [{
			years: Number,
			years_course: [{
				semester: Number,
				course_list: [{
					course_id: String,
					course_code: String
				}]
			}]
		}],
		plan_description: String,
		student_id: Number,
		message: Object,
		status: String,
		department:String,
	});


module.exports = coursePlanSchema;
