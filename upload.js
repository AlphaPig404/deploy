const Client = require('ssh2').Client;
const { readOptions, resolveLocal, getPassword } = require('./utils')
const { resolve } = require('path');
const { connect } = require('http2');


function startUpload(cb){
    const conn = new Client;
    const options = readOptions()

    const localFilePath = resolveLocal('./dist.zip')
    const remoteFilePath = resolve(options.remotePath, './dist.zip')
    const remotePath = resolve(options.remotePath, options.remoteDirName)

    const commands = [
        `unzip -o ${remoteFilePath} -d ${remotePath}`,
    ]

    conn.on('ready',() => {
        console.log('Client :: ready')
        conn.sftp(function(err, sftp){
            if(err) throw err;
            sftp.fastPut(localFilePath, remoteFilePath, {
                step: function(tt,c,t){
                    console.log('upload: '+(tt/t * 100)+'%' )
                }
            }, function(err){
                if(err) throw err;
                console.log('exec commands')
                conn.exec(commands.join(';'), err => {
                    if(err) throw err;
                    conn.end()

                    cb()
                })
                
            })
        })
    })

    conn.on('error', err => {
        console.log(err)
    })

    conn.connect({
        host: options.host,
        port: options.port,
        username: options.username,
        password: getPassword()
    })
}

module.exports = {
    startUpload: startUpload
}

