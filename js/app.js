const express = require('express');
const OT = require('opentok');
const app = express();
const port = 8080;

app.listen(port, () => console.log('OnlineOfficeHours listening on ' + port));

const apiKey = '46042852';
const apiSecret = '94fd8608d10645d74c3c76263c8a93e0d31ea885';
//let token = 'T1==cGFydG5lcl9pZD00NTgyODA2MiZzaWc9ZThiNzcyZTZjY2RiZDI1MTYwNDMyNzEzYmFkOTE1ZDMyZDIwYTFlZjpzZXNzaW9uX2lkPTFfTVg0ME5UZ3lPREEyTW41LU1UVXhOalF6T0RRNE1URTFNSDQzVDBNeU1FNTVaVmxxZVVFeWNtbEZaMFZGVjBSRWRYZC1VSDQmY3JlYXRlX3RpbWU9MTUxNjQzODQ4MyZub25jZT0wLjk4NzgzOTE0OTIyMDY2NDQmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTUxNjUyNDg4Mw==';
const opentok = new OpenTok(apiKey, apiSecret);

let session = opentok.createSession(function (err, session) {
    if (err) return console.log(err);
});

app.get('/', (req, res) => res.sendFile('./index.html'));