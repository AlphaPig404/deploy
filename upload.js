const Client = require('ssh2').Client;
const {readOptions} = require('./config')
const { resolve } = require('path');
const { connect } = require('http2');

function startUpload(cb){
    const conn = new Client;
    const pwd = process.env.PWD
    const options = readOptions()

    const localFilePath = resolve(pwd, './dist.zip')
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
                    console.log('upload',tt, c, t)
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
        password: options.password
    })
}

module.exports = {
    startUpload: startUpload
}

