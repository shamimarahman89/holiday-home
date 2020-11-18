const express = require("express");
var router = express.Router();
const path = require("path");
var nodemailer = require('nodemailer');
var User = require('../models/user');
var bcrypt = require('bcryptjs');
require('dotenv').config();


var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.NODE_MAILER_USERNAME, //generated by Mailtrap
      pass: process.env.NODE_MAILER_PASSWORD //generated by Mailtrap
    }
  });

 
// This is a helper middleware function that checks if a user is logged in
// we can use it in any route that we want to protect against unauthenticated access.
// A more advanced version of this would include checks for authorization as well after
// checking if the user is authenticated
function ensureLogin(req, res, next) {
    if (req.session.user === undefined) {
      res.redirect("/");
    } else {
      next();
    }
  }

// setup a 'route' to listen on the default url path (http://localhost)
router.get("/", function(req,res){
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.get("/rooms", function(req,res){
    res.sendFile(path.join(__dirname, '../views', 'roomListing.html'));
});

router.get("/signup", function(req,res){
    res.sendFile(path.join(__dirname, '../views', 'signup.html'));
});

// a route that ensures that the session is set and user is logged in
router.get("/regular-dashboard", ensureLogin, (req, res) => {
    res.render("regular-user-dashboard", {user: req.session.user, layout: false});
});

// a route that ensures that the session is set and user is logged in
router.get("/admin-dashboard", ensureLogin, (req, res) => {
    res.render("admin-user-dashboard", {user: req.session.user, layout: false});
});


// Respond to the client with data
router.post("/signup-submit", (req, res) => {
    var signupData = req.body;
  
    // checking if user exist in db
    User.find({ email: signupData.email })
    .exec()
    .then((user) => {
      if(user === undefined || user.length == 0) {
        console.log("No user could be found");
        
        
        // use salt for password encryption
        var salt = bcrypt.genSaltSync(10);
  
        // envrypting the password
        var hash = bcrypt.hashSync(signupData.password, salt);
        
        // To check a password
        // Load hash from your password DB.
        // bcrypt.compareSync("B4c0/\/", hash); // true
      
  
        // creating model for db insert
        var newUser = new User({
          "email": signupData.email,
          "firstName": signupData.firstname,
          "lastName": signupData.lastname,
          "password": hash,
          "birthdate": new Date(signupData.date),
          "userType": "regular"
        });
  
        // save the user
        newUser.save((err) => {
          if(err) {
            console.log(`There was an error saving the user : ${err}`);
            var errormessage = "Sorry something went wrong."
            res.render('error_dashboard', {
              error: errormessage,
              layout: false 
            }); 
          } 
          else {
            console.log("The user was saved to the users collection");
  
            // code to mail confirmation of signup
            var mailOptions = {
              from: 'rahmanshamima328@gmail.com',
              to: signupData.email,
              subject: 'Signup confirmation',
              text: 'Welcome...Thank you for signing up ' + signupData.firstname + ' ' + signupData.lastname +'.'
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } 
              else {
                console.log('Email sent: ' + info.response);
              }
            });
  
            // forward the user to a signup dashboard
            res.render('signup-dashboard', {
              data: signupData,
              layout: false 
            }); 
          }
        });
  
      } 
      else {
        console.log("user already exists.");
        console.log(user);
        var errormessage = "This email: " + user[0].email + " already exists.";
        res.render('error_dashboard', {
          error: errormessage,
          layout: false 
        }); 
      }
    })
    .catch((err) => {
      console.log(`There was an error: ${err}`);
      var errormessage = "Sorry something went wrong."
      res.render('error_dashboard', {
        error: errormessage,
        layout: false 
      }); 
    });
  });

  router.post("/login-submit", (req, res) => {
    var loginData = req.body;
    // checking if user exist in db
    User.find({ email: loginData.email })
    .exec()
    .then((user) => {
        if(user === undefined || user.length == 0) {
            var errormessage = "Sorry, the email does not match"
            res.render('error_dashboard',{
            error: errormessage,
            layout: false 
            });
        } 
        else {
            if(bcrypt.compareSync(loginData.password, user[0].password)){
                // login successful
                // Add the user on the session and redirect them to the dashboard page.
                req.session.user = {
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    userType: user[0].userType
                };

                if(user[0].userType === "regular"){
                    res.redirect("/regular-dashboard");
                }
                else{
                    res.redirect("/admin-dashboard");
                }
            }
            else{
                var errormessage = "Sorry, the password does not match, try again"
                res.render('error_dashboard',{
                    error: errormessage,
                    layout: false 
                });
            }                

        }
    })
    .catch((err) => {
        console.log(`There was an error: ${err}`);
        var errormessage = "Sorry something went wrong."
        res.render('error_dashboard', {
        error: errormessage,
        layout: false 
        }); 
    });
});

// route for logout
router.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/");
  });



  module.exports = router;