# node-service
Node.JS module to help easily access service and process stats for services

## Requirements:
* Linux
* systemctl

## Install
```sh
# NPM
npm install --save node-service

# Yarn
yarn add node-service
```

## Use
```js
const nodeService = require('node-service')

// Promise
nodeService.getService('redis')
    .then(res => console.log(res))
    .catch(err => console.error(err))

// Try/catch
try {
    let service = await nodeService.getService('redis')
    console.log(service)
} catch (error) {
    console.error(error)
}

// Different process / service name
nodeService.getService('redis-server', 'redis')
    .then(res => console.log(res))
    .catch(err => console.error(err))

// Different ps arguments (node-service uses `aux` by default)
nodeService.getService('redis-server', 'redis', 'au')
    .then(res => console.log(res))
    .catch(err => console.error(err))

// Set debug value to get more errors
nodeService.DEBUG = true;
```