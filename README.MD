# Deploy Cli

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

## Description

Deploy your static website by one line command

## Installation
Install with [npm](https://npmjs.org/package/deploy-loopslive-web)
```bash
npm install -g deploy-loopslive-web
```
## Usage :
* init project
```
    deploy-loopsweb init
```
* config deploy.dev.conf/deploy.pro.conf
```
    {
        "name": "project name",
        "host": "Hostname or IP address of the server",
        "port": "Port number of the server",
        "username": "Username for authentication",
        "password": "Local path to password",
        "remotePath": "Remote path",
        "dist": "local path"
    }
```
* deploy
```
    npm run deploy:pre/pro
```

### Simple
```
    {
        "name": "project name",
        "host": "120.78.194.223",
        "port": 22,
        "username": "lun",
        "password": "/Users/chris/.ssh/pwd",
        "remotePath": "/var/www",
        "remoteDir": "targe",
        "dist": "./dist"
    }
```
## License

ISC

[npm-url]: https://npmjs.org/package/deploy-loopslive-web
[npm-image]: http://img.shields.io/npm/v/deploy-loopslive-web.svg

[downloads-url]: https://npmjs.org/package/deploy-loopslive-web
[downloads-image]: http://img.shields.io/npm/dm/deploy-loopslive-web.svg
