//import { request } from 'http';

//sets environment variables in .env file
//require('dotenv').config();

const express = require('express');
const OpenTok = require('opentok');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
//const opentok = new OpenTok(apiKey, apiSecret);

// let session = opentok.createSession(function (err, session) {
//     if (err) return console.log(err);
// });

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../room.html'))}
);

app.listen(port, () => console.log('OfficeHoursOnline listening on ' + port));