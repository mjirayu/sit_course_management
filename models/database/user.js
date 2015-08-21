var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    department: String,
    student_email: String,
    username: String,
    salt: String,
    password: String,
    roles: [String],
    entranced_year: String,
    last_update: String,
});

module.exports = userSchema;
