const Client = require('ssh2').Client;
const ProgressBar = require('progress');
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
        console.log('Client :: ready :: %s', options.host)
        conn.sftp(function(err, sftp){
            if(err) throw err;
            let bar;
            sftp.fastPut(localFilePath, remoteFilePath, {
                step: function(tt,chunk,total){
                    // console.log('upload: '+(tt/t * 100)+'%' )
                    if(bar){
                        bar.tick(chunk)
                    }else{
                        bar = new ProgressBar('uploading [:bar] :rate/bps :percent :etas',{
                            complete: '=',
                            incomplete: ' ',
                            width: 20,
                            total: total
                        })
                        bar.tick(chunk)
                    }
                }
            }, function(err){
                if(err) throw err;
                const command = commands.join(';')
                console.log('Exec commands: %s', command)
                conn.exec(command, (err, stream) => {
                    if(err) throw err;
                    stream.stderr.on('data', err =>{
                        cb(err.toString())
                    }).on('close', function() {
                        conn.end(); 
                        cb();
                    })
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

