/**
 *
 * Usage :
 *
 * npm run build ; gulp packing ; gulp upload
 */

const path = require('path')
const gulp = require("gulp")
const zip = require("gulp-zip")
const upload = require("gulp-upload")
const del = require("del")
const shelljs = require('shelljs')
const runSequence = require("run-sequence")
const argv = require('yargs').argv
const GulpSSH = require('gulp-ssh')
const fs= require('fs')
const writeFile = require('write')
const chalk = require('chalk')
const error = chalk.bold.red
const warning = chalk.keyword('orange')

const cwd = process.env.INIT_CW
const env = process.env.DEPLOY_ENV

function resolve(_path){
  return path.resolve(cwd, _path);
}

const envMap = {
  'pre': 'deploy.dev.conf',
  'pro': 'deploy.pro.conf'
}

let config = fs.readFileSync(resolve(envMap[env]), 'utf8')
config = JSON.parse(config)
config.password = fs.readFileSync(config.password, 'utf8').replace(/[\r\n]/g,'')

const commands = [
  `unzip -o ${config.remotePath}/dist.zip -d ${config.remotePath}`
]

let gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
})

gulp.task('deploy', ['upload'], () => {
  return gulpSSH.shell(commands, {filePath: 'commands.log'})
      .pipe(gulp.dest('logs'))
})

gulp.task('upload', () => {
  const distZipPath = resolve('./dist.zip')
  return gulp.src(distZipPath)
        .pipe(gulpSSH.dest(config.remotePath))
})

gulp.task("clean", () => {
  del([resolve("./dist.zip")], {
    force: true
  });
})

gulp.task("compress", () => {
  return gulp
    .src(resolve(path.join(config.dist,'./**')))
    .pipe(zip("dist.zip"))
    .pipe(gulp.dest(resolve('./')));
})

gulp.task("packing", (cb) => {
  return runSequence("clean", "compress", cb);
})

gulp.task("default",["packing", "deploy"], function(cb) {
  console.log(chalk.green.bold('Complete deploy!'));
})

gulp.start.apply(gulp, ['default']);