/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  cssmin = require("gulp-cssmin"),
  uglify = require("gulp-uglify"),
    merge = require("merge-stream");



var paths = {
  webroot: "./wwwroot/"
};

var deps = {
  "jquery": {
    "dist/*": ""
  },
  "popper.js": {
    "dist/**/*": ""
  },
  "bootstrap": {
    "/**/*": ""
  },
  "font-awesome": {
    "/**/*": ""
  }
  
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

//tasks
gulp.task("compile", function () {
    return gulp.src('./wwwroot/css/site.scss')
        .pipe(sass())
        .pipe(gulp.dest('wwwroot/css'));
});
gulp.task("clean:js", done => rimraf(paths.concatJsDest, done));
gulp.task("clean:css", done => rimraf(paths.concatCssDest, done));
gulp.task("clean", gulp.series(["clean:js", "clean:css"]));

gulp.task("min:js", () => {
  return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
    .pipe(concat(paths.concatJsDest))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task("min:css", () => {
  return gulp.src([paths.css, "!" + paths.minCss])
    .pipe(concat(paths.concatCssDest))
    .pipe(cssmin())
    .pipe(gulp.dest("."));
});

gulp.task("min", gulp.series(["min:js"]));
gulp.task("sass", gulp.series(["compile", "min:css"]));
//
gulp.task("scripts", function () {

  var streams = [];

  for (var prop in deps) {
    console.log("Prepping Scripts for: " + prop);
    for (var itemProp in deps[prop]) {
      streams.push(gulp.src("node_modules/" + prop + "/" + itemProp)
        .pipe(gulp.dest("wwwroot/" + prop + "/" + deps[prop][itemProp])));
    }
  }

  return merge(streams);

});

// A 'default' task is required by Gulp v4
gulp.task("default", gulp.series(["min"]));


