const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browsersync = require('browser-sync').create();
const fileinclude = require("gulp-file-include");


// INCLUDE FILE COMPILED
function fileincludeTask(cb) {
  src(["app/pages/**/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("./dist"));
  cb();
}

// SASS COMPILED
function scssCompileTask() {
  return src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(dest('dist/css'));
}

// SASS COPY ALL
function scssCopyTask() {
  return src('app/scss/**/*')
    .pipe(dest('dist/css'));
}

// IMAGE COPY ALL
function imageCopyTask() {
  return src('app/images/**/*')
    .pipe(dest('dist/images'));
}

// JS COPY ALL
function jsCopyTask() {
  return src('app/js/**/*')
    .pipe(dest('dist/js'));
}

// INIT SERVER
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

// RELOAD SERVER
function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// WATCH HTML SCSS JS ON CHANGE
function watchTask() {
  // watch('app/**/*.html', series(fileincludeTask));
  // watch('*.html', series(browsersyncReload));
  // watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssCompileTask, jsCopyTask, scssCopyTask, imageCopyTask, browsersyncReload));
  watch(['app'], series(
    fileincludeTask, 
    scssCompileTask, 
    scssCopyTask, 
    jsCopyTask, 
    imageCopyTask, 
    browsersyncReload
  ));
}

exports.default = series(
  fileincludeTask,
  scssCompileTask,
  scssCopyTask,
  jsCopyTask,
  imageCopyTask,
  browsersyncServe,
  watchTask
)