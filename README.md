Express Api for [ps4-waker](https://www.npmjs.com/package/ps4-waker)

## Requirements ##
- [npm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04)
- ps4 second screen [application](https://play.google.com/store/apps/details?id=com.playstation.mobile2ndscreen&hl=fr) 

- Ps4-waker in global for first config. We need the client
```bash
$ npm install ps4-waker -g
```

- Get the credentials
In your ps4 go to settings > Mobile application parameters > add new device . This will show a pincode that we will use next.

```bash
# This command need sudo rights for first config (see doc for more informations)
$ sudo ps4-waker
```
In the mobile application, there is a Ps4-Waker device. Select it and the device must load.
Go to ps4-waker and enter the pincode.

Congratulations, your ps4-Waker is configured !

## Install ##
```bash
$ npm install
```

## Usage ##
Start the project
```bash
$ node server.js
```

Routes available: 


## Usefull links ##
- Games id https://ps4database.io/search