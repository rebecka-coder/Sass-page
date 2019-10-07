//Variabler för olika paket inom gulp
const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");

// Sökvägar
const files = {
    htmlPath: "src/**/*.html",
    jsPath: "src/**/*.js",
    sassPath: "src/**/*.scss",
    imagePath: "src/**/*.png",
    imagePaths: "src/**/*.jpg"
}

//Task: Sourcemaps
function sourceMaps() {
    return src(files.jsPath)
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat("main.js"))
      .pipe(sourcemaps.write())
      .pipe(dest("pub/js"))
      .pipe(browserSync.stream());
}
//Task: Sass
function sassTask() {
    return src(files.sassPath)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(dest('pub')
    );
}
// Task: kopiera HTML
function copyHTML() {
    return src(files.htmlPath)
        .pipe(dest('pub'))
        .pipe(browserSync.stream())
}
//Task: kopiera bilder
function copyImages() {
    return src(files.imagePath)
        .pipe(dest('pub'))
        .pipe(browserSync.stream())
    return src(files.imagePaths)
        .pipe(dest('pub'))
        .pipe(browserSync.stream())  
}
//Task: Sammanslå jsfiler, minifiera filer
function jsTask() {
    return src(files.jsPath)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('pub/js'))
        .pipe(browserSync.stream())
}
// Task: watcher
function watchTask() { 
   browserSync.init({
       server: {
           baseDir: 'pub/'
       }
   });
    watch([files.htmlPath, files.jsPath, files.sassPath, files.imagePath, files.imagePaths],
    parallel(copyHTML, copyImages, jsTask, sassTask, sourceMaps)).on('change', browserSync.reload);
}
//Kalla på funktioner
exports.default = series(
    sassTask,
    copyHTML, 
    copyImages, 
    jsTask,
    sourceMaps,
    watchTask
);