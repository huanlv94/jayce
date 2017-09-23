var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');

gulp.task('hello', function() {
  console.log('Hello huan');
});

gulp.task('css', function(){
  return gulp.src('assets/**/*.css')
    .pipe(minifyCSS())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('scripts', function() {
  return gulp.src('assets/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function(){
  return gulp.src('assets/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('assets/**/*.+(eot|svg|ttf|woff)')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('useref', function(){
  return gulp.src('demo/admin-template/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('.+(png|jpg|jpeg|gif|svg)', imagemin()))
    .pipe(gulp.dest('dist'))
});

gulp.task('build', function(callback) {
  runSequence('scripts', 'css', 'useref', 'images', 'fonts', callback);
});

gulp.task('builddev', [`scripts`, `css`, `useref`, `images`, `fonts`], function (){
  console.log('Building files');
})
