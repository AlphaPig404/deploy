const path = require("path")

function resolveLocal(_path){
   return path.resolve(process.env.PWD, _path)
}


module.exports = {
    resolveLocal: resolveLocal
}