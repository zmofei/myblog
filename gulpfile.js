const gulp = require('gulp');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const sass = require('gulp-sass');
const rollup = require('gulp-rollup');

gulp.task('rev', ['prepareStatic', 'prepareRoot'], () => {
    return gulp.src('build/static/**/*')
        .pipe(gulp.dest('build/static/'))
        .pipe(rev())
        .pipe(gulp.dest('build/static/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/static/'));
});

gulp.task("revreplaceJade", ['revreplaceStatic'], () => {
    var manifest = gulp.src("build/static/rev-manifest.json");
    return gulp.src('build/root/**/*.jade')
        .pipe(gulp.dest('build/root/'))
        .pipe(revReplace({
            manifest: manifest,
            replaceInExtensions: '.jade'
        }))
        .pipe(gulp.dest('build/root/'));
});

gulp.task("revreplaceStatic", ['rev'], () => {
    var manifest = gulp.src("build/static/rev-manifest.json");
    return gulp.src('build/static/**/*')
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest('build/static/'));
});

gulp.task('prepareStatic', ['bundle', 'sass'], () => {
    return gulp.src('static/**/*')
        .pipe(gulp.dest('build/static/'))
});

gulp.task('prepareRoot', () => {
    return gulp.src('root/**/*.*')
        .pipe(gulp.dest('build/root/'))
});

gulp.task('sass', () => {
    return gulp.src('dev/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('static/css/'));
});

gulp.task('bundle', () => {
    gulp.src('dev/es6/**/*.main.js')
        .pipe(rollup())
        .pipe(gulp.dest('static/js'));
});

gulp.task('watch', function() {
    gulp.watch('dev/es6/**/*', ['bundle']);
    gulp.watch('dev/scss/**/*', ['sass']);
});

gulp.task('default', ['sass', 'bundle', 'watch']);

gulp.task('online', ['revreplaceJade']);
