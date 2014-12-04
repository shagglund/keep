'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  return gulp.src('src/index.html')
    .pipe(wiredep({
      directory: 'bower_components',
      overrides: {
        'components-font-awesome': {
          main: [
            'css/font-awesome.css',
            'fonts/fontawesome-webfont.eot',
            'fonts/fontawesome-webfont.svg',
            'fonts/fontawesome-webfont.ttf',
            'fonts/fontawesome-webfont.woff'
          ]
        },
        'angular-i18n': {
          main: [
            'angular-locale_fi-fi.js'
          ]
        }
      },
      exclude: [/bootstrap-sass-official/, /bootstrap.js/, /bootstrap.css/],
    }))
    .pipe(gulp.dest('src'));
});
