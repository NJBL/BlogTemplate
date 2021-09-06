const express = require('express'); //Line 1
const app = express(); //Line 2
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000; //Line 3
const dbo = require("./db/conn");

// This displays message that the server running and listening to specified port
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
}); //Line 6

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
}); //Line 11