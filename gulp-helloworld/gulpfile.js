var gulp = require('gulp'),
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat = require('gulp-concat');


gulp.task('html', function () {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js', function () {
    gulp.src('./src/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', function() {
  // place code for your default task here
});