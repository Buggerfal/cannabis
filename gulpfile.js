const gulp = require('gulp');
const minify = require('gulp-minify');
const concat = require('gulp-concat');

gulp.task('default', function() {
    gulp.src(['./js/global.js', './js/shot.js', './js/enemy.js', './js/main.js'])
        .pipe(concat('all.js'))
        //.pipe(minify())
        .pipe(gulp.dest('dist'))
});