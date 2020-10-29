const express = require("express");
const app = express();
// const multer = require("multer");
const path = require("path");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
var nodemailer = require('nodemailer');

const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ac110aa0de2962", //generated by Mailtrap
    pass: "fecbd95e009b93" //generated by Mailtrap
  }
});
// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
/*const storage = multer.diskStorage({
  destination: "./public/photos/",
  filename: function (req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage }); */

app.use(express.static(path.join(__dirname, 'public')));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get("/rooms", function(req,res){
    res.sendFile(path.join(__dirname, 'views', 'roomListing.html'));
});

app.get("/signup", function(req,res){
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});
// now add a route that we can POST the form data to
// IE: http://localhost/register-user
// add the middleware function (upload.single("photo")) for multer to process the file upload in the form
// the string you pass the single() function is the value of the
// 'name' attribute on the form for the file input element
/* app.post("/signup", upload.single("photo"), (req, res) => {
    res.send("signup");
  }); */
  

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);

// Respond to the client with data
app.post("/dashboard", (req, res) => {
  var signupData = req.body;
  var mailOptions = {
    from: 'rahmanshamima328@gmail.com',
    to: signupData.email,
    subject: 'Signup confirmation',
    text: 'Welcome...Thank you for signing up ' + signupData.firstname + ' ' + signupData.lastname +'.'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  /* const dataReceived = "Your submission was received:<br/><br/>" +
    "Your form data was:<br/>" + JSON.stringify(signupData) + "<br/><br/>";
  res.send(dataReceived); */
  res.render('dashboard', {
    data: signupData,
    layout: false 
  }); 
});