var createPagination = function(pages, page, params) {
  var url = require('url');
  var qs = require('querystring');
  var params = params;
  var str = '';

  params.page = 0;
  var clas = page == 0 ? 'active' : 'no';
  str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">First</a></li>';
  for (var p = 1; p < pages; p++) {
    params.page = p;
    clas = page == p ? 'active' : 'no';
    str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">' + p + '</a></li>';
  }

  params.page = --p;
  clas = page == params.page ? 'active' : 'no';
  str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">Last</a></li>';
  return str;
};

module.exports.createPagination = createPagination;
