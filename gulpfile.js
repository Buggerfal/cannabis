const gulp = require('gulp');
const minify = require('gulp-minify');
const concat = require('gulp-concat');

gulp.task('default', function() {
    gulp.src(['./js/utils.js', './js/aim.js', './js/global.js', './js/player.js', './js/shot.js', './js/enemy.js', './js/enemyTypes.js', './js/settings.js', './js/sound.js', './js/main.js'])
        .pipe(concat('all.js'))
        //.pipe(minify())
        .pipe(gulp.dest('dist'))
});