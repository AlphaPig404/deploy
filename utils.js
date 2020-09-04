const path = require('path')
const fs = require('fs')

function resolveLocal(_path){
   return path.resolve(process.env.PWD, _path)
}

function readOptions(){
    const env = process.env.DEPLOY_ENV
    const filePath = resolveLocal(getConfName(env))
    const file = fs.readFileSync(filePath, 'utf8')
    const options = JSON.parse(file)
    return options
}

function getPassword(){
    const options = readOptions()
    try{
       const pwd = fs.readFileSync(options.password, 'utf8').replace(/[\r\n]/g,'')
       return pwd
    }catch(err){
        console.log(err)
    }
}
function getConfName(env){
    return `deploy.${env}.conf`
}


module.exports = {
    resolveLocal: resolveLocal,
    readOptions: readOptions,
    getConfName: getConfName,
    getPassword: getPassword
}