const express = require("express");
const app = express();
const path = require("path");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const clientSessions = require("client-sessions");
var routes = require("./routes/routes")
require('dotenv').config();

const HTTP_PORT = process.env.PORT || 8080;

// Register handlerbars as the rendering engine for views
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// Setup client-sessions
app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "assignment_web322", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

// Setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static(path.join(__dirname, 'public')));

// add the routes
app.use('/', routes);
  

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);

