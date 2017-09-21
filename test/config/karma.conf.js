module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../..',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      //Dependency Javascript
      'src/*.dependency.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',

      //Component Javascript
      'src/*.component.js',
      'src/component/lcHostGroupApi.mock.service.js',

      //Templates
      'src/templates/*.html',

      //Unit Test Javascript
      'test/unit/**/*.spec.js',

      {pattern: 'dist/*.js.map', included: false, served: true, watched: false, nocache: true},
      {pattern: 'dist/css/*.css.map', included: false, served: true, watched: false, nocache: true},

      {
        pattern: 'src/data/*.json',
        watched: true,
        served: true,
        included: false
      }
    ],

    preprocessors: {
      // Test Coverage preprocessor
      'src/*.component.js': ['coverage'],

      // Generate js files from html templates
      'src/templates/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      //prependPrefix: '../',
      // setting this option will create
      // only a single module that contains templates
      // from all the files, so you can load them all
      // with module('templates')
      moduleName: 'templates'
    },

    // optionally, configure the reporter
    coverageReporter: {
      dir : 'coverage/'
    },

    // list of files to exclude
    exclude: ['docs/**', 'coverage/**'],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,

    // cli runner port
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJS'], //'Chrome', 'Firefox', 'Safari']

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    plugins: [
      'karma-jasmine',
      'jasmine-core',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-safari-launcher',
      'karma-ng-html2js-preprocessor',
      'karma-coverage'
    ]
  });
};
