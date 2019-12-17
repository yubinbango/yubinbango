"use strict";

var gulp = require("gulp");
var webserver = require("gulp-webserver");
var gulpProtractorAngular = require("gulp-angular-protractor");
var exit = require("gulp-exit");

gulp.task("webserver", () =>
  gulp.src("./").pipe(
    webserver({
      hot: "localhost",
      port: 8888
    })
  )
);

gulp.task("protractor", callback =>
  gulp
    .src(["test/spec.js"])
    .pipe(
      gulpProtractorAngular({
        configFile: "test/protractor.conf.js",
        args: ["--baseUrl", "http://localhost:8888"],
        debug: false,
        autoStartStopServer: true
      })
    )
    .on("error", function(e) {
      console.log(e);
    })
    .on("end", function() {
      callback();
    })
);

gulp.task(
  "test",
  gulp.series("webserver", "protractor", function(callback) {
    gulp.src("").pipe(exit());
    callback();
  })
);
