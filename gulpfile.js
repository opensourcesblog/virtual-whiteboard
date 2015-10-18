var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
 
// Lint Tasks
gulp.task('lint', function() {
    return gulp.src(['public/js/*.js', 'server/*.js', '!public/js/*.min.js','!public/js/keymaster.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Task
gulp.task('run', function() {
	// listen for changes
	livereload.listen();
	// configure nodemon
	nodemon({
		// the script to run the app
		script: 'server/server.js',
		ext: 'js',
        env: {
            'DEBUG': 'whiteboard*'
        }
	}).on('restart', function(){
		// when the app has restarted, run livereload.
		gulp.src('server/server.js')
			.pipe(livereload())
			.pipe(notify('Reloading page, please wait...'));
	})
});

gulp.task('default', ['lint', 'run']);