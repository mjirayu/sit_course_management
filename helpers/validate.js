module.exports.getMessage = function(err) {
  var message = [];
  for (field in err.errors) {
    message.push(err.errors[field].message);
  }

  return message;
};
