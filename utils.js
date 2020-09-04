const path = require("path")

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

function getConfName(env){
    return `deploy.${env}.conf`
}


module.exports = {
    resolveLocal: resolveLocal,
    readOptions: readOptions,
    getConfName: getConfName
}