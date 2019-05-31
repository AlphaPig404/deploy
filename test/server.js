const express = require('express');
const timeout = require('connect-timeout'); //express v4
const skipper = require('skipper');
const shelljs = require('shelljs');
const path = require('path')

const app = express();
app.use(timeout(120000));

let port = 3030;

app.post('/upload', skipper({limit:'50mb'}));
app.post('/upload', function (req, res) {
    const body = req.body || {};

    const options = {
        dirname: __dirname + (body.dirname || ''),
        saveAs: body.fileName
    };
    req.file('file').upload(options, function (err, uploadedFiles) {
        if (err) {
            console.log("error:", err.toString());
            return res.status(500).send(err.toString())
        } else {
            const project = body.project
            console.log('project',project)
            const staticDir = '/var/www/loopslive/web'
            const serverPath = path.join(staticDir, project)

            const cacheDir = path.join(__dirname,'./cache/')
            console.log('serverPath',serverPath)
            
            console.log('cleanning');
            shelljs.rm('-rf', './cache/*');
            console.log("copying");
            shelljs.mv('-f',uploadedFiles[0].fd, cacheDir);
            shelljs.cd(cacheDir)
            console.log('unziping');
            if (shelljs.exec(`unzip -o dist.zip -d ${serverPath}`).code !== 0) {
                shelljs.echo('Unzip failed');
                shelljs.exit(1);
                return res.send('Failed');
            }
            console.log('removing dist.zip ');
            shelljs.rm('-rf', './dist.zip');
            return res.send('Deploy ' + project + ' successfully!');
        }
    });
});

app.listen(port, function () {
    port = (port !== '80' ? ':' + port : '');
    const url = 'http://localhost' + port + '/';
    console.log('Running at ' + url);
});
