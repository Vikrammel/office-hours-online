# OfficeHoursOnline (Oho)
### Student queuing video chat application using the Google login API, TokBox API by Mike Hamilton, Colin Maher, Vikram Melkote for CruzHacks 2018

## About

A web app in which users can connect to professors' rooms and queue up in the order they arrived in the room.

Site layout: professor's camera is visible in one part of the page at all times. A single student's camera is next to the professor's at any given time (student at the front of the queue). Other students can only subscribe to their streams until they are at the beginning of the queue. They are removed from this queue if they disconnect from the server.

Didn't get to: The rest of the page is a canvas visible to the room which the professor can write on in one color and the student who's camera is visible can write on in another color.

## Setup

1. clone repo with git or download contents
`git clone https://github.com/Vikrammel/office-hours-online.git`

2. Install node.js from [here](https://www.npmjs.com/get-npm)

3. run `npm install` in project directory

4. run server using `node app.js` or `nodemon`

5. visit the site on `localhost:8080` in a browser
