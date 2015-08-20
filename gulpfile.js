var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('default',['node']);

gulp.task('node',function(){
	nodemon({
    script: 'app.js',
  	ext: 'js html',
  	env: { 'NODE_ENV': 'development' }
  });
});
