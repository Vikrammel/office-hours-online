/*import { toASCII } from 'punycode';
import { read } from 'fs';*/

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

//array for storing professors that are connected
var professors = [];

//check goole login token
function checkAuth(token, profEmail){
    //check if student is currently in a prof's queue
    if(profEmail.length > 0){
        var profInd = checkProfs(profEmail);
        for (var student in professors[profInd].queue){
            if (student.gtoken == token){
                return student.email;
            }
        }
    }
    //check if token belongs to an existing professor
    else{
        for (var prof in professors){
            if (prof.gtoken == token){
                return prof.email;
            }
        }
    }
    //user not seen before, get info by sending token to gauth api

}

function checkProfs(email) {
    return professors.findIndex(function (element) {
         return element.email == email;
    });
}
//student constructor that can join queue and leave queue
var studentObj = function (name, profName) {
    var self = this;
    this.email = name + "@gmail.com";
    this.name = name;
    this.sessionId = null;
    this.profEmail = profName + "@gmail.com";
    this.token = null;
    this.gtoken = null;
    this.joinRoom = function () {
        if (checkProfs(this.profEmail)!=-1) {
            this.sessionId = professors[checkProfs(this.profEmail)].sessionId;
            professors[checkProfs(this.profEmail)].addToQueue(this);
            if(professors[checkProfs(this.profEmail)].queue[0].name == this.name){
                this.token = opentok.generateToken(self.sessionId, {role:"publisher"});
            }
            else{
                this.token = opentok.generateToken(self.sessionId, {role:"subscriber"});
            }
        }
    }
    this.leaveQueue = function () {
        if (checkProfs(this.profEmail)) {
            professors[checkProfs(this.profEmail)].removeFromQueue(this.name);
        }
    }
}

//professor constructor defining an individual professor with an email and queue functionality
var professorObj = function (name, res) {
    var self = this;
    this.email = name + "@gmail.com";
    this.name = name;
    this.sessionId = null;
    this.queue = [];
    this.token = null;
    this.gtoken = null;
    this.createSession = function () {
        if (checkProfs(this.email)==-1) {
            //generate session id
            opentok.createSession(function (err, session) {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        error: 'createSession error:' + err
                    });
                    return;
                }
                self.sessionId = session.sessionId;
                // now that the room name has a session associated with it, store it in memory
                // IMPORTANT: Because this is stored in memory, restarting your server will reset these values
                // if you want to store a room-to-session association in your production application
                // you should use a more persistent storage for them
                // generate token
                self.token = opentok.generateToken(session.sessionId, {role:"moderator"});
                //res.setHeader('Content-Type', 'application/json');
                professors.push(self);
                //console.log(professors);
            });
        }
    }

    this.addToQueue = function (student) {
        this.queue.push(student);
    };

    this.removeFromQueue = function (name) {
        this.queue = this.queue.filter(e => e.name == name);
    };

    this.popFront = function () {
        this.queue.shift();
    };
}


app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../signin.html'));
});

app.post('/auth', (req, res) => {
    console.log('hi');
});

//router.post('/room/:name',
app.get('/room/:profName/:name', (req, res) => {
    var stud = new studentObj(req.params.name, req.params.profName);
    stud.joinRoom();
    res.sendFile(path.join(__dirname, '../room.html'));
    // token = opentok.generateToken(session.sessionId);
    // console.log(req.params.profName);
    // console.log(req.params.name);
});


app.get('/room/:profName', (req, res) => {
    var prof = new professorObj(req.params.profName, res);
    prof.createSession();
    res.sendFile(path.join(__dirname, '../room.html'));
    // console.log(req.body.email);
    // console.log(req.body.role);
});

app.get('/getToxBoxToken/:name', (req, res) => {
    var name = req.params.name;
    //console.log(name);
    var from = req.header("Referer").split('/');
    var token;
    var sessionId;
    //console.log(from);
    if (from.length==5){
        //console.log("inside if" + from[4]);
        //look through profs to see if name matches, send token
        var profInd = checkProfs(name + "@gmail.com")
        //console.log("profInd: " + profInd);
        if (profInd != -1){
            token = professors[profInd].token;
            sessionId = professors[profInd].sessionId;
        }
    }
    else if (from.length==6){
        var profName = from[4];
        var profInd = checkProfs(profName + "@gmail.com");
        var queueInd;
        if(profInd != -1){
            queueInd = professors[profInd].queue.findIndex(function (element) {
                return element.name == name;
           });
           token = professors[profInd].queue[queueInd].token;
           sessionId = professors[profInd].sessionId;
        }
    }
    
    //console.log(token);
    //console.log(sessionId);
    //check if professor first
    //console.log(token + ' ' + sessionId + ' ' + apiKey);
    res.send(
        {token: token,
         sessionId: sessionId,
         apiKey: apiKey
        }
    );
});

app.listen(port, () => console.log('OfficeHoursOnline listening on ' + port));