var gulp       = require('gulp'),
	  $          = require('gulp-load-plugins')(),
    sassImport = require('sass-module-importer'),
    autoprefix = require('autoprefixer');

gulp.task('styles', function() {
  return gulp.src('src/styles/**/*.scss')
             .pipe($.sass({
                importer: sassImport(),
                outputStyle: 'compressed'
              }).on('error', $.sass.logError))
             .pipe($.sourcemaps.init())
             .pipe($.concat('miradademujer.css'))
             .pipe($.postcss([ autoprefix({ browsers: 'last 2 versions'} )]))
             .pipe($.sourcemaps.write())
             .pipe(gulp.dest('dist/css'));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
             .pipe(gulp.dest('dist/images'));
})

gulp.task('templates', ['styles'], function() {
  var template = gulp.src('src/templates/index.html');

  var stylesAndScripts = gulp.src(['dist/css/*.css', 'dist/js/*.js'], { read: false });

  return template.pipe($.inject(stylesAndScripts, { addRootSlash: false, ignorePath: 'dist' }))
                 .pipe(gulp.dest('dist/'));
});

gulp.task('dist', ['styles', 'images', 'templates'], function() { });

gulp.task('serve', ['dist'], function() {
  gulp.src('./dist/')
      .pipe($.webserver({
        livereload: true,
        open: true
      }));
});

gulp.task('deploy', ['dist'], function() {
  gulp.src('./dist/**/*')
      .pipe($.ghPages())
});
