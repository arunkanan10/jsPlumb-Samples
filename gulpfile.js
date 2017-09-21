'use strict';

var gulp = require('gulp'),
    config = require('./config.json'),
    browserify = require('browserify'),
    resolutions = require('browserify-resolutions'),
    stream = require('vinyl-source-stream'),//This just converts the bundle into the type of stream gulp is expecting
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'del', 'run-sequence', 'browser-sync', 'merge-stream', 'karma*']
    });

var not = '!',
    Server = $.karma.Server,
    gulp_src = gulp.src;//overwrite gulp.src to add error handling

gulp.src = function () {
    return gulp_src.apply(gulp, arguments)
        .pipe($.plumber(function (error) {
            // Output an error message
            $.util.log($.util.colors.red('Error (' + error.plugin + '): ' + error.message));
            // emit the end event, to properly end the task
            this.emit('end');
        }));
};
/****************** copy and rename **********************/
gulp.task('index:create', function () {
    return gulp.src([config.paths.src + '/_index.html'])
        .pipe($.if('**/_index.html', $.rename('index.html')))
        .pipe(gulp.dest(config.paths.src));
});

/****************** Browserify **********************/
gulp.task('browserify', function(callback){
    return $.runSequence('browserify:vendor', 'browserify:dependency', 'browserify:component', 'uglify:dependency', 'uglify:component', callback);
});

gulp.task('browserify:vendor', function() {
    return browserify('./' + config.componentName + '.vendor.bundle.js')
        .plugin(resolutions, '*')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(stream(config.componentName + '.vendor.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest(config.paths.src));
});

gulp.task('browserify:dependency', function() {
    return browserify(['./' + config.componentName + '.vendor.bundle.js', './' + config.componentName + '.dependency.bundle.js'])
        .plugin(resolutions, '*')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(stream(config.componentName + '.dependency.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest(config.paths.src));
});

gulp.task('browserify:component', function() {
    return browserify('./' + config.componentName + '.component.bundle.js')
        .plugin(resolutions, '*')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(stream(config.componentName + '.component.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest(config.paths.src));
});

gulp.task('uglify:dependency', function(){
    return gulp.src(config.paths.src + '/' + config.componentName + '.dependency.js')
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task('uglify:component', function(){
    return gulp.src(config.paths.src + '/' + config.componentName + '.component.js')
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.dist));
});

/****************** Styles and SCSS **********************/
gulp.task('css', function(callback){
    return $.runSequence('images', 'clean:css:dependencies', 'clean:css:component', callback);
});

gulp.task('clean:css:dependencies', function(){
    return gulp.src(config.paths.src + '/scss/lcTree.dependencies.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({includePaths:[
            './src/scss/',
            './node_modules/lc-font/src/scss/',
            './node_modules/sw-webapp-theme/src/scss/',
            './node_modules/bootstrap-sass/assets/stylesheets/',
            './node_modules/bootstrap-sass/assets/stylesheets/bootstrap/mixins/',
            './node_modules/font-awesome/scss/',
            './node_modules/lc-context-menu/src/scss/'
        ]}))
        .pipe($.cleanCss())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});
gulp.task('clean:css:component', function(){
    return gulp.src(config.paths.src + '/scss/lc-tree.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({includePaths:[
            './src/scss/',
            './src/scss/partials/'
        ]}))
        .pipe($.cleanCss())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

/****************** Fonts **********************/
gulp.task('copy:fonts', function(callback){
    return $.runSequence('process:fontawesome:fonts', 'process:bootstrap:fonts', 'process:lc-font:fonts', callback);
});

// Font Awesome
gulp.task('process:fontawesome:fonts', function(){
    return gulp.src(config.paths.nodeModules + '/font-awesome/fonts/*')
        .pipe(gulp.dest(config.paths.dist + '/fonts'))
        .pipe(gulp.dest(config.paths.src + '/fonts'));
});

// Twitter Bootstrap
gulp.task('process:bootstrap:fonts', function(){
    return gulp.src(config.paths.nodeModules + '/bootstrap-sass/assets/fonts/bootstrap/*')
        .pipe(gulp.dest(config.paths.dist + '/fonts'))
        .pipe(gulp.dest(config.paths.src + '/fonts'));
});

// lc-font
gulp.task('process:lc-font:fonts', function(){
  return gulp.src([
      config.paths.nodeModules + '/lc-font/src/fonts/cisco-font/*',
      config.paths.nodeModules + '/lc-font/src/fonts/icons/*',
      config.paths.nodeModules + '/lc-font/src/fonts/lc-font/**/*'
    ])
    .pipe(gulp.dest(config.paths.dist + '/fonts'));
});

/****************** Templates **********************/

gulp.task('build:templates', function () {
    return gulp.src(config.paths.templates + '/*.html')
        .pipe($.minifyHtml())
        .pipe(gulp.dest(config.paths.dist + '/templates'));
});

gulp.task('dependency:templates', function(){
    return gulp.src([config.paths.nodeModules + '/lc-context-menu/src/templates/*.html'])
    .pipe($.minifyHtml())
    .pipe($.flatten())
    .pipe(gulp.dest(config.paths.src + '/templates'))
    .pipe(gulp.dest(config.paths.dist + '/templates'));
});

/****************** Images **********************/
gulp.task('images', function(callback){
    return $.runSequence('copy:images', 'jstree:theme', 'jstree:images', callback);
});
gulp.task('copy:images', function () {
    return gulp.src(config.paths.images + '/*.*')
        .pipe(gulp.dest(config.paths.dist + '/images'));
});

gulp.task('jstree:theme', function () {
    return gulp.src(config.paths.nodeModules + '/jstree/src/themes/default/**/*')
        .pipe(gulp.dest(config.paths.src + '/themes'));
});

gulp.task('jstree:images', function () {
    return gulp.src([config.paths.src + '/themes/*.png', config.paths.src + '/themes/*.gif'])
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

/****************** Injection ******************/
gulp.task('inject',function(callback){
    return $.runSequence('inject:styles', 'inject:scripts:component', callback);
});
gulp.task('inject:index', function (callback) {
    return $.runSequence('index:create', 'inject', callback);
});
gulp.task('inject:styles', function () {
    var target = gulp.src(config.paths.src + '/index.html');

    var cssStream = gulp.src([config.paths.dist + '/css/lcTree.dependencies.min.css', config.paths.dist + '/css/lc-tree.min.css']);

    return target
        .pipe($.inject(cssStream, {relative: true, starttag: '<!-- inject:styles:{{ext}} -->'}))
        .pipe(gulp.dest(config.paths.src));
});

gulp.task('inject:scripts:component', function(){
    var target = gulp.src(config.paths.src + '/index.html');

    var componentStream = gulp.src([config.paths.src + '/' + config.componentName + '.dependency.js', config.paths.src + '/' +config.componentName + '.component.js', config.paths.src + '/component/lcHostGroupApi.mock.service.js']);

    return target
        .pipe($.inject(componentStream,
            {
                relative: true,
                starttag: '<!-- inject:component:{{ext}} -->'
            }))
        .pipe(gulp.dest(config.paths.src));
});
/****************** Tests **********************/
gulp.task('test', function (done) {
    var karamConfig = {
        configFile: __dirname + '/test/config/karma.conf.js',
        singleRun: true
    };
    Server.start(karamConfig, function(error){
        error = error ? new Error('Karma returned with the error code: ' + error) : undefined;
        done(error);
    });
});

/****************** ngDocs **********************/

gulp.task('run:ngDocs', function(){
    var docOptions = {
        html5Mode: false,
        startPage: '/docs',
        title: config.componentName + " Documentation",
        titleLink: "/docs",
        scripts: [
            config.paths.nodeModules + '/angular-animate/angular-animate.min.js',
            config.paths.nodeModules + '/angular-animate/angular-animate.min.js.map',
            config.paths.nodeModules + '/marked/lib/marked.js'
        ]
    };

  return gulp.src(config.paths.src + '/component/**/*.js')
      .pipe($.ngdocs.process(docOptions))
      .pipe(gulp.dest(config.paths.docs));
});

/****************** Webservers **********************/

//open chrome for dev purposes only
gulp.task('run:browser-sync:dev', function () {
    return $.browserSync.init({
        server: ['./src', './'],
        files: [config.paths.dist + "css/*.css", config.paths.dist +  "fonts/**/*.(ttf|woff|woff2|svg|eot)"],
        injectChanges: true,
        reloadDelay: 2000,
        browser: ["google chrome"]
    });
});

//open multiple browsers to test styles
gulp.task('run:browser-sync:style', function () {
    return $.browserSync.init({
        server: ['./src', './'],
        files: [config.paths.dist + "css/*.css", config.paths.dist + "fonts/**/*.*"],
        injectChanges: true,
        reloadDelay: 2000,
        browser: ["google chrome", "safari"]
    });
});

// browser-sync reload all Browsers
gulp.task('browsersync-reload', function () {
    return $.browserSync.reload();
});

/****************** watch **********************/
gulp.task('watch:scss', function () {
    gulp.watch([config.paths.scss + '/*.scss'], ['css']);
});

gulp.task('watch:index', function () {
    gulp.watch([config.paths.src + '/_index.html'], ['inject:index']);
});

gulp.task('watch:js', function () {
    gulp.watch([config.paths.src + '/component/*.js'], ['browserify']);
});

gulp.task('watch:browsersync', function () {
    gulp.watch([
        config.paths.src + '/**/*',
        not + config.paths.scss + '/**/_*.scss',
        not + config.paths.css + '/**/*.css',
        not + config.paths.lib + '/**/*'], ['browsersync-reload']);
});

gulp.task('watch:test', function () {
    // Be sure to return the stream
    return gulp.src([config.paths.tests + '/*.js'])
        .pipe($.karma({
            configFile: config.paths.karmaConfig + '/karma.conf.js',
            action: 'watch'
        }))
});

/****************** i18n **********************/
gulp.task('i18n',function(callback){
    return $.runSequence('copy:i18n:depenencies', callback);
});
gulp.task('copy:i18n:depenencies', function () {
    return gulp.src([config.paths.nodeModules + '/lc-common/i18n/*'])
        .pipe(gulp.dest('./i18n'));
});

/****************** Generic Tasks **********************/
gulp.task('set-development', function () {
    config.production = false;
});

gulp.task('clean', ['del']);


gulp.task('del', function () {
    return $.del.sync([config.paths.dist, config.paths.coverage, config.paths.fonts, config.paths.docs, config.paths.src + '/index.html', config.paths.src + '/*.component.js', config.paths.src + '/*.dependency.js']);
});

gulp.task('dev', function (callback) {
    return $.runSequence('del', 'set-development', 'index:create', 'browserify', 'css', 'copy:images', 'copy:fonts',
        'build:templates', 'dependency:templates', 'inject', 'i18n', 'test', 'run:ngDocs', 'run:browser-sync:dev',
        'watch:scss', 'watch:js', 'watch:index','watch:browsersync', callback);
});

gulp.task('default', function (callback) {
    return $.runSequence('del', 'index:create', 'browserify', 'css', 'build:templates', 'dependency:templates', 'copy:images', 'copy:fonts', 'i18n', 'test', callback);
});
