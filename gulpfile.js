const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rev = require('gulp-rev');
const revReplace  = require('gulp-rev-replace');

gulp.task('imagemin', () => {
	return gulp.src('static_dev/image/**/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('static/image'));
});

gulp.task('rev', () => {
	return gulp.src('static_dev/**/*')
		.pipe(gulp.dest('build/assets'))
		.pipe(rev())
		.pipe(gulp.dest('static/'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('static/'));
});

gulp.task("revreplace",['rev'],function(){
  var manifest = gulp.src("static/rev-manifest.json");
  return gulp.src('root3/index.jade')
    .pipe(revReplace({
			manifest: manifest,
			replaceInExtensions: '.jade'
		}))
    .pipe(gulp.dest('root3/'));
});

gulp.task('default', ['imagemin','rev','revreplace'])
