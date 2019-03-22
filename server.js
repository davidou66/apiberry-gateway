var fs = require('fs'),
    https = require('https'),
    express = require('express')
const { Device } = require('ps4-waker');

var app = express();

var gamesid = require('./gamesid.js');
var port = process.env.PORT;
var env = process.env.NODE_ENV;
var certifOpt = {
    key: fs.readFileSync('/etc/letsencrypt/live/moulegeek.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/moulegeek.fr/cert.pem'),
};

app.get('/ps4/status', function(req, res) {
    console.log("status");
    var opt = {
        timeout: 200,
        debug: true
    };
    var ps4 = new Device(opt);

    ps4.getDeviceStatus()
    .then(      
        data => res.status(200).send(data),
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

    var id = gamesid.ids[title];

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

var server = https.createServer(options, app).listen(port, function(){
    console.log("Apiberry Gateway listening on port " + port);
});