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

app.use(bodyParser.json());

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

const opentok = new OpenTok(apiKey, secret);

// IMPORTANT: roomToSessionIdDictionary is a variable that associates room names with unique
// unique sesssion IDs. However, since this is stored in memory, restarting your server will
// reset these values if you want to have a room-to-session association in your production
// application you should consider a more persistent storage

var roomToSessionIdDictionary = {};

//array for storing professors that are connected
var professors = [];

//student constructor that can join queue and leave queue
var studentObj = function (email) {
    this.email = email;
    this.name = email.substr(0, email.indexOf('@'));
    this.sessionId = null;
    this.professorEmail = null;
    this.joinRoom = function () {
        var index = professors.findIndex(function (element) {
            return element.email == this.professorEmail;
        });
        if (index !== -1) {
            professors[index].addToQueue(this);
        } else {
            console.log("professor not found");
        }
    }
    this.leaveQueue = function() {
        var index = professors.findIndex(function (element) {
            return element.email == this.professorEmail;
        });
        if (index !== -1) {
            professors[index].removeFromQueue(this);
        } else {
            return "not found";
            console.log("professor not found");
        }
    }
}

//professor constructor defining an individual professor with an email and queue functionality
var professorObj = function (email) {
    this.email = email;
    this.name = email.substr(0, email.indexOf('@'));
    this.sessionId = null;
    this.queue = [];
    this.addToQueue = function (student) {
        this.queue.push(student);
    };
    this.removeFromQueue = function () {
        this.queue.shift();
    };
}

//var student = new studentObj('csmaher@ucsc.edu');
//var prof = new professorObj('professor@ucsc.edu');
//professors.push(prof);

//student.joinRoom('professor@ucsc.edu');
// console.log(professors);
// console.log(professors[0].queue);
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

//router.post('/room/:name',
app.get('/room/:profName/:name', function (req, res) {
    console.log(req.params.profName);
    console.log(req.params.name);
});


app.post('/room', (req, res) => {
    console.log(req.body.email);
    console.log(req.body.role);
});

app.listen(port, () => console.log('OfficeHoursOnline listening on ' + port));