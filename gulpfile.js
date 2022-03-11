const {
  src,
  dest,
  series,
  watch
} = require('gulp');
const postcss = require("gulp-postcss");
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const svgSprite = require('gulp-svg-sprite');
const fileInclude = require('gulp-file-include');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const csscomb = require("gulp-csscomb");
const cleanCSS = require('gulp-clean-css');

const clean = () => {
  return del(['build/*'])
}

const svgSprites = () => {
  return src('./src/img/svg/**.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest('./build/img'));
}

const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", notify.onError()))
    .pipe(postcss([
      autoprefixer({
        cascade: false,
      })
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./build/css/'))
    .pipe(csscomb())
    .pipe(dest('./build/css/'))
    .pipe(browserSync.stream());
};

const minifyLibs = () => {
  return src('./build/css/libs.css')
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(dest('./build/css/'))
};

const scripts = () => {
  src('./src/js/libs/**.js')
    //.pipe(concat('libs.js'))
    .pipe(dest('./build/js/libs'))
  return src(
      ['./src/js/components/**.js', './src/js/main.js'])
    .pipe(sourcemaps.init())
    //.pipe(babel({
    //  presets: ['@babel/env']
    //}))
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./build/js'))
    .pipe(browserSync.stream());
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./build'))
}

const images = () => {
  return src([
      './src/img/**.jpg',
      './src/img/**.png',
      './src/img/**.jpeg',
      './src/img/*.svg',
      './src/img/**/*.jpg',
      './src/img/**/*.png',
      './src/img/**/*.jpeg'
    ])
    .pipe(dest('./build/img'))
};

const htmlInclude = () => {
  return src(['./src/*.html'])
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }).on("error", notify.onError()))
    .pipe(dest('./build'))
    .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "./build"
    },
    notify: false,
    ui: false,
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/js/**/*.js', scripts);
  watch('./src/blocks/**/*.html', htmlInclude);
  watch('./src/*.html', htmlInclude);
  watch('./src/resources/**', resources);
  watch('./src/img/*.{jpg,jpeg,png,svg}', images);
  watch('./src/img/**/*.{jpg,jpeg,png}', images);
  watch('./src/img/svg/**.svg', svgSprites);
}

exports.default = series(clean, htmlInclude, scripts, styles, minifyLibs, resources, images, svgSprites, watchFiles);

exports.build = series(clean, htmlInclude, scripts, styles, minifyLibs, resources, images, svgSprites);

exports.server = series(watchFiles);

exports.clean = series(clean);
