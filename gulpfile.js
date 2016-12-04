'use strict';
var gulp = require('gulp'),
  del = require('del'),
  merge = require('merge-stream'),

  tsc = require('gulp-typescript'),
  tsProject = tsc.createProject('tsconfig.json'),
  SystemBuilder = require('systemjs-builder'),
  jsMinify = require('gulp-uglify'),

  mocha = require('gulp-mocha'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  runSequence = require('run-sequence'),
  sourcemaps = require('gulp-sourcemaps'),
  inlineNg2Template = require('gulp-inline-ng2-template'),

  cssPrefixer = require('gulp-autoprefixer'),
  cssMinify = require('gulp-cssnano');

var browserSync = require("browser-sync").create();
var config = require('./gulp.config.js')();

gulp.task('clean', () => {
  return del(config.dev);
});

gulp.task('shims', () => {
  return gulp.src([
    'node_modules/core-js/client/shim.js',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/reflect-metadata/Reflect.js'
  ])
    .pipe(concat('shims.js'))
    .pipe(gulp.dest(config.dev + '/js/'));
});

gulp.task('system-build', ['tsc'], () => {
  var builder = new SystemBuilder();

  return builder.loadConfig('systemjs.config.js')
    .then(() => builder.buildStatic('app', config.dev + '/js/bundle.js', { sourceMaps: true }))
    .then(() => del(config.temp));
});

gulp.task('tsc', () => {
  del(config.temp);

var tsResult = gulp.src(config.app + '**/*.ts')
    .pipe(inlineNg2Template({ base: '/src' }))
    .pipe(sourcemaps.init())
    .pipe(tsProject());
  return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.temp));
});

gulp.task('html', () => {
  return gulp.src([config.root + '**/*.html', '!' + config.app + '**/*.html', config.root + 'favicon.png'])
    .pipe(gulp.dest(config.dev));
});

gulp.task('images', () => {
  return gulp.src(config.root + 'images/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest(config.dev + '/images/'));
});

gulp.task('css', () => {
  return gulp.src([config.root + '**/*.css', '!' + config.app + '**/*.css'])
    .pipe(cssPrefixer())
    .pipe(gulp.dest(config.dev));
});

gulp.task('php', () => {
  return gulp.src(config.root + '**/*.php')
    .pipe(imagemin())
    .pipe(gulp.dest(config.dev));
});

gulp.task('test-run', ['tsc'], () => {
  return gulp.src(config.root + 'test/**/*.spec.js')
    .pipe(mocha());
});

gulp.task('test', ['test-run'], () => {
  return del(config.temp);
});

gulp.task('watch', () => {
  var watchTs = gulp.watch(config.root + 'app/**/**.*', ['dev-ts-reload']),
    watchCss = gulp.watch([config.root + 'css/**/*.css', '!' + config.app + '**/*.css'], ['css-reload']),
    watchHtml = gulp.watch([config.root + '**/*.html', '!' + config.app + '**/*.html'], ['html-reload']),
    watchImages = gulp.watch(config.root + 'images/**/*.*', ['images-reload']),
    watchPhp = gulp.watch(config.root + '**/*.php', ['php-reload']),

    onChanged = function (event) {
      console.log('File ' + event.path + ' was ' + event.type + '. Running tasks...');
    };

  watchTs.on('change', onChanged);
  watchCss.on('change', onChanged);
  watchHtml.on('change', onChanged);
  watchImages.on('change', onChanged);
  watchPhp.on('change', onChanged);
});

gulp.task('dev-ts-reload', ['dev-ts'], (cb) => {
    browserSync.reload();
    console.log('Reloaded');
    cb();
});
gulp.task('css-reload', ['css'], (cb) => {
    browserSync.reload();
    console.log('Reloaded');
    cb();
});
gulp.task('html-reload', ['html'], (cb) => {
    browserSync.reload();
    console.log('Reloaded');
    cb();
});
gulp.task('images-reload', ['images'], (cb) => {
    browserSync.reload();
    console.log('Reloaded');
    cb();
});
gulp.task('php-reload', ['php'], (cb) => {
    browserSync.reload();
    console.log('Reloaded');
    cb();
});

gulp.task('watchtests', () => {
  var watchTs = gulp.watch(config.root + 'app/**/**.ts', ['test-run']),
    watchTests = gulp.watch(config.root + 'test/**/*.spec.js', ['test-run']),

    onChanged = function (event) {
      console.log('File ' + event.path + ' was ' + event.type + '. Running tasks...');
    };

  watchTs.on('change', onChanged);
  watchTests.on('change', onChanged);
});

gulp.task('build', [
  'shims',
  'system-build',
  'html',
  'images',
  'css',
  'php'
]);

gulp.task('build', (cb) => {  
  runSequence('clean', ['shims',
  'system-build',
  'html',
  'images',
  'css',
  'php'], cb);
});


gulp.task('dev-ts', ['system-build'], () => {
  return gulp.src(config.app + '**/*.ts')
    .pipe(gulp.dest(config.dev + '/' + config.app));
});

gulp.task('default', ['build']);

gulp.task('copy', () => {
  return gulp.src([config.dev + '/**/*', '!' + config.dev + '/**/*.map', '!' + config.dev + '/**/*.bak'])
    .pipe(gulp.dest(config.dist));
});

gulp.task('minify', () => {
  /*
  not works for bundle.js !
  */
  var js = gulp.src(config.dist + '/js/shims.js')
    .pipe(jsMinify())
    .pipe(gulp.dest(config.dist + '/js/'));
  var css = gulp.src(config.dist + '/css/styles.css')
    .pipe(cssMinify())
    .pipe(gulp.dest(config.dist + '/css/'));
  return merge(js, css);
});

gulp.task('dist', ['build'], (cb) => {  
  runSequence('copy', 'minify', cb);
});


gulp.task('dev', ['build'], (cb) => {  
  runSequence('dev-ts', 'watch', cb);
});

gulp.task('serve', ['dev'], () => {
  browserSync.init(config.browserSync.dev);
});