var http = require('http');
var express = require('express');
const { Device } = require('ps4-waker');

var app = express();

var gamesid = require('./gamesid.js');

app.get('/ps4/status', function(req, res) {
    console.log("status");
    var opt = {
        timeout: 200,
        debug: true
    };
    var ps4 = new Device(opt);

    ps4.getDeviceStatus()
    .then(      
        data => res.status(200).send(JSON.stringify(data)),
        err => res.status(500).send(JSON.stringify(err))
    )
    .then(() => ps4.close());
}); 

app.get('/ps4/wakeup', function(req, res) {
    console.log("wakeup");
    var opt = {
        timeout: 200,
        debug: true
    };
    var ps4 = new Device(opt);

    ps4.turnOn()
    .then(
        data => res.status(200).send(JSON.stringify(data)),
        err => res.status(500).send(JSON.stringify(err))
    )
    .then(() => ps4.close());
}); 

app.get('/ps4/standby', function(req, res) {
    console.log("standby");
    var opt = {
        debug: true
    };
    var ps4 = new Device(opt);

    ps4.turnOff()
    .then(
        data => res.status(200).send(JSON.stringify(data)),
        err => res.status(500).send(JSON.stringify(err))
    )
    .then(() => ps4.close());
}); 

app.get('/ps4/title/:title', function(req, res) {
    console.log("title");
    var opt = {
        debug: true
    };
    var ps4 = new Device(opt);
    var title = req.params.title;

    console.log(title);

    var id = gamesid.ids[title];

    console.log(gamesid);

    ps4.startTitle(id)
    .then(
        data => res.status(200).send(JSON.stringify(data)),
        err => res.status(500).send(JSON.stringify(err))
    )
    .then(() => ps4.close());
}); 

app.get('*', function(req, res) {
    res.status(404).send("No route found for '" + req.params + "'");
});

app.use(function(err, req, res, next) {
    if (req.xhr) {
      res.status(500).send('Oops, Something went wrong!');
    } else {
      next(err);
    }
});

app.listen(3000);
console.log('App Server running at port 3000');