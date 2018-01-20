//import { request } from 'http';

//sets environment variables in .env file
require('dotenv').config();

const express = require('express');
const router = express.Router();
const OpenTok = require('opentok');
const path = require('path');
const _ = require('lodash');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

const apiKey = process.env.API_KEY;
const secret = process.env.API_SECRET;

if (!apiKey || !secret) {
    console.error('=========================================================================================================');
    console.error('');
    console.error('Missing TOKBOX_API_KEY or TOKBOX_SECRET');
    console.error('Find the appropriate values for these by logging into your TokBox Dashboard at: https://tokbox.com/account/#/');
    console.error('Then add them to ', path.resolve('.env'), 'or as environment variables');
    console.error('');
    console.error('=========================================================================================================');
    process.exit();
}

const opentok = new OpenTok(apiKey, apiSecret);

// IMPORTANT: roomToSessionIdDictionary is a variable that associates room names with unique
// unique sesssion IDs. However, since this is stored in memory, restarting your server will
// reset these values if you want to have a room-to-session association in your production
// application you should consider a more persistent storage

let roomToSessionIdDictionary = {};

let users = {};

var userObj = function (email) {
    this.email = email;
    this.name = email.substr(0, email.indexOf('@'));
    this.sessionId = null;
    this.professor = false;
}
// returns the room name, given a session ID that was associated with it
function findRoomFromSessionId(sessionId) {
    return _.findKey(roomToSessionIdDictionary, function (value) {
        return value === sessionId;
    });
}


// let session = opentok.createSession(function (err, session) {
//     if (err) return console.log(err);
// });

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../signin.html'))
});

app.get('/room/:name', function (req, res) {

});


app.get('/room', (req, res) => {
    var email = req.body.email;
    console.log(email);
});

app.listen(port, () => console.log('OfficeHoursOnline listening on ' + port));