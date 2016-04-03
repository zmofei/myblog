const gulp = require('gulp');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const rollup = require('gulp-rollup');

gulp.task('imagemin', () => {
    return gulp.src('build/static/image/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/static/image/'));
});

gulp.task('rev', () => {
    return gulp.src('build/static/**/*')
        .pipe(gulp.dest('build/static/'))
        .pipe(rev())
        .pipe(gulp.dest('build/static/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/static/'));
});

gulp.task("revreplaceJade", ['rev'], () => {
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

gulp.task('prepareStatic', ['sass_noWatch'], () => {
    return gulp.src('static/**/*')
        .pipe(gulp.dest('build/static/'))
});

gulp.task('prepare', ['prepareStatic'], () => {
    return gulp.src('root/**/*')
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

gulp.task('online', ['prepare', /*'imagemin',*/ 'revreplaceJade', 'revreplaceStatic']);
