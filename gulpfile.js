var gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
var pipeline = require('readable-stream').pipeline;
const $ = require('gulp-load-plugins')();

gulp.task('pug', function buildHTML() {
  return gulp.src('source/*.pug')
    .pipe($.plumber())
    .pipe($.pug({

    }))
    .pipe(gulp.dest('./public'))
    .pipe($.livereload())
});

gulp.task('sass', function () {
  return gulp.src('source/sass/*.sass')
    .pipe($.plumber())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss($.autoprefixer({
      browsers: ['last 2 version']
    })))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('./public/css'))
    .pipe($.livereload())
});

gulp.task('babel', () =>
  gulp.src('source/js/*.js')
  .pipe($.sourcemaps.init())
  .pipe($.babel({
    presets: ['@babel/env']
  }))
  .pipe($.concat('index.js'))
  .pipe($.uglify({
    compress: {
      drop_console: true
    }
  }))
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest('./public/js'))
  .pipe($.livereload())
);

gulp.task('clean', function () {
  return gulp.src('./public', {
      read: false
    })
    .pipe($.clean());
});

gulp.task('img-min', () =>
  gulp.src('source/imgs/*')
  .pipe($.imagemin())
  .pipe(gulp.dest('./public/imgs'))
);

gulp.task('watch', function () {
  gulp.watch('source/*.pug', gulp.series('pug'));
  gulp.watch('source/sass/*.sass', gulp.series('sass'));
  gulp.watch('source/js/*.js', gulp.series('babel'));
});

gulp.task('default', gulp.series(['pug', 'sass', 'babel', 'watch']));