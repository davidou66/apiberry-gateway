var fs = require('fs'),
    https = require('https'),
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

var app = express();

const WakeupHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
      },
      handle(handlerInput) {
        const speechText = 'Hello World!';
    
        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard('Hello World', speechText)
          .getResponse();
      }
};

app.post('/', function(req, res) {
    console.log(req, res);
});

app.get('/', function(req, res) {
    console.log("status");

    // ps4.getDeviceStatus()
    // .then(      
    //     data => res.status(200).send(data),
    //     err => res.status(500).send(JSON.stringify(err))
    // )
    // .then(() => ps4.close());
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


