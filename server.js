var fs = require('fs'),
    http = require('http'),
    express = require('express');
require('dotenv').config();

/** Alexa */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

/** App */
const gamesid = require('./gamesid.js');
const port = process.env.PORT;
const env = process.env.NODE_ENV;
const urlWaker = process.env.URL_WAKER;
const portWaker = process.env.PORT_WAKER;

var app = express();

/**
 * Receive the post query from lambda function
 * 
 */
app.get('/api', function(req, res) {
    console.log(req.params);
    http.get(urlWaker + ":" + portWaker + '/ps4/' + req.body.uri, (resp) => {
        let data = '';
    
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
    
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(JSON.parse(data).explanation);
            data +=  ": " + JSON.parse(data).explanation;

            
            res.status(200).send(data);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
        data += ": " + err.message;
        
        res.status(500).send(data);
    });
    
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


if(env == "prod") {
    var certifOpt = {
        key: fs.readFileSync('/etc/letsencrypt/live/moulegeek.fr/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/moulegeek.fr/cert.pem'),
    };

    var server = https.createServer(certifOpt, app).listen(port, function(){
        console.log("Apiberry Gateway listening on port " + port + " in " + env +" env");
    });
} else {
    app.listen(port);
    console.log("Apiberry Gateway listening on port " + port + " in " + env +" env");
}


