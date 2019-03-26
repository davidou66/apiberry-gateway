var fs = require('fs'),
    http = require('http'),
    express = require('express');
require('dotenv').config();

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
    console.log(req.query);

    let data = '';

    http.get(makeUrl(req.query), (resp) => {
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
    
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(data);
            data +=  ": " + data;

            res.status(200).send(data);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
        data += ": " + err.message;
        
        res.status(500).send(data);
    });
    
});

/**
 * Construct url from .env and query parameters
 * 
 * @param {} queryObj 
 */
function makeUrl(queryObj){
    let url = "";

    url += urlWaker + ':' + portWaker + '/ps4/' + queryObj.route;
    if (queryObj.params) {
        url += '/' + queryObj.params.title;
    }

    console.log("Url to call: " + url);

    return url;
}

app.get('*', function(req, res) {
    console.log("No route found")
    res.status(404).send("No route found for '" + makeUrl(req.query) + "'");
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


