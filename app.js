const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => res.send('Welcome to OnlineOfficeHours beta'))

app.listen(port, () => console.log('OnlineOfficeHours listening on ' + port))
