const fs = require('fs')
const { resolve } = require('path')
const pwd = process.env.PWD 

function writeOptions(){

}

function readOptions(){
    const filePath = resolve(pwd, './deploy.dev.conf')
    const file = fs.readFileSync(filePath, 'utf8')
    const options = JSON.parse(file)
    return options
}

module.exports = {
    readOptions: readOptions,
    writeOptions: writeOptions
}