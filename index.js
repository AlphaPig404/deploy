/**
 *
 * Usage :
 *
 * npm run build ; gulp packing ; gulp upload
 */

const path = require('path')
const gulp = require("gulp")
const zip = require("gulp-zip")
const del = require("del")
const argv = require('yargs').argv
const fs= require('fs')
const chalk = require('chalk')
const error = chalk.bold.red
const warning = chalk.keyword('orange')
const { startUpload } = require('./upload')
const { resolveLocal, readOptions }= require('./utils')

const clean = (cb) => {
  del([resolveLocal("./dist.zip")], {force: true});
  cb()
}

const compress = () => {
  const config = readOptions()
  return gulp
    .src(resolveLocal(path.join(config.dist, '/**')))
    .pipe(zip("dist.zip"))
    .pipe(gulp.dest(resolveLocal('./')));
}

const publish = function(cb) {
  const config = readOptions()
  console.log(chalk.green.bold('Uploading...'))
  startUpload((err)=>{
    if(err){
      console.log(chalk.red.bold('STDERR:'), err)
    }else{
      console.log(chalk.green.bold(`Complete deploying ${config.name}!`));
    }
    cb()
  })
}

const start = gulp.series(
  clean,
  compress,
  publish,
  clean
)

exports.start = start