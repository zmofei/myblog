const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const sass = require('gulp-sass');

gulp.task('imagemin', () => {
  return gulp.src('_dev/static/image/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('_dev/build/static/image'));
});

gulp.task('rev', () => {
  return gulp.src('_dev/static/**/*')
    .pipe(gulp.dest('_dev/build/static/'))
    .pipe(rev())
    .pipe(gulp.dest('_dev/build/static/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('_dev/build/static/'));
});

gulp.task("revreplaceJade", ['rev'], () => {
  var manifest = gulp.src("_dev/build/static/rev-manifest.json");
  return gulp.src('_dev/root/**/*.jade')
    .pipe(gulp.dest('_dev/build/root/'))
    .pipe(revReplace({
      manifest: manifest,
      replaceInExtensions: '.jade'
    }))
    .pipe(gulp.dest('_dev/build/root/'));
});

gulp.task("revreplaceStatic", ['rev'], () => {
  var manifest = gulp.src("_dev/build/static/rev-manifest.json");
  return gulp.src('_dev/build/static/**/*')
    .pipe(revReplace({
      manifest: manifest
    }))
    .pipe(gulp.dest('_dev/build/static/'));
});

gulp.task('sass', () => {
  return gulp.src('_dev/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('_dev/static/css/'));
})

gulp.task('clean', () => {
  return del(['_dev/build']);
});

gulp.task('copy', () => {
  gulp.src('_dev/build/root/**/*')
    .pipe(gulp.dest('root/'));
  gulp.src('_dev/build/static/**/*')
    .pipe(gulp.dest('static/'));
});


gulp.task('default', ['imagemin', 'sass', 'revreplaceJade', 'revreplaceStatic', 'copy'])
