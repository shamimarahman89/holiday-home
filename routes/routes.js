const express = require("express");
var router = express.Router();
const path = require("path");
var nodemailer = require('nodemailer');
var User = require('../models/user');
var Room = require('../models/room');
var Booking = require('../models/booking');
var bcrypt = require('bcryptjs');
require('dotenv').config();
const multer = require("multer");


// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
  destination: "./public/images/listing",
  filename: function (req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

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
      res.render('error_dashboard', {
        error: "You are not logged in. Please login to continue..",
        layout: false 
      }); 
    } else {
      next();
    }
  }
// This is a middleware function for checking if an admin is logged in or not
function ensureAdminLogin(req, res, next) {
  if(req.session.user === undefined || req.session.user.userType !== "admin"){
    res.render('error_dashboard', {
      error: "You are not logged in or do not have admin priviledge. Please login with admin credential to continue..",
      layout: false 
    });
  } 
  else {
    next();
  }
}


// setup a 'route' to listen on the default url path (http://localhost)
router.get("/", function(req,res){
  res.render('index',{ data: {"session": req.session.user}, layout: false }); 
    
}); 


router.get("/signup", function(req,res){
  res.render('signup',{ data: {"session": req.session.user}, layout: false });
});

// a route that ensures that the session is set and user is logged in
router.get("/regular-dashboard", ensureLogin, (req, res) => {
    res.render("regular-user-dashboard", {data: {"session": req.session.user}, layout: false});
});

// a route that ensures that the session is set and user is logged in
router.get("/admin-dashboard", ensureAdminLogin, (req, res) => {
    res.render("admin-user-dashboard", {data: {"session": req.session.user}, layout: false});
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
    

      // creating model for db insert user
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
                  email: user[0].email,
                  firstName: user[0].firstName,
                  lastName: user[0].lastName,
                  userType: user[0].userType,
                  login: true,
                  _id: user[0]._id
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

router.get("/create-listing", ensureAdminLogin, function(req,res){
  res.render("admin_listing", {data: {"session": req.session.user}, layout: false});
});

router.post("/submit-listing", upload.single("room_image"), (req,res) => {
  var roomData = req.body;
  var roomFile = req.file;
  

  // creating model for db insert room
  var newRoom = new Room({
    "roomTitle": roomData.room_title,
    "roomPrice": roomData.room_price,
    "roomDetail": roomData.room_detail,
    "roomLocation": roomData.room_location,
    "roomImage": roomFile.filename,
    "roomGuest": roomData.room_guest 
  });
  // save the room
  newRoom.save((err) => {
    if(err) {
      console.log(`There was an error saving the listing : ${err}`);
      var errormessage = "Sorry something went wrong."
      res.render('error_dashboard', {
        error: errormessage,
        layout: false 
      }); 
    }
    else {
      console.log("Listing Saved successfully");
      res.render("list_success", {data: {"session": req.session.user}, layout: false});
    }
  });
  
});

router.get("/lising-success", ensureAdminLogin,  function(req,res){
  res.render("list_success", {data: {"session": req.session.user}, layout: false});
});

// show the edit listing form
router.post("/edit-listing-form", ensureAdminLogin, function(req,res){
  var roomId = req.body.room_id;
  if(roomId === undefined){
    res.render('error_dashboard', {
      error: errormessage,
      layout: false 
    }); 
  }
  else{
    Room.findById(roomId).lean()
    .exec()
    .then((room) => {
      console.log(room);
      res.render('edit_listing', {data: {"session": req.session.user, "room" : room}, layout: false});
    })
    .catch((err) => {
      console.log(`There was an error: ${err}`);
      var errormessage = "Sorry something went wrong."
      res.render('error_dashboard', {
        error: errormessage,
        layout: false 
      }); 
    });
  }  
});


// edit listing in DB after edit listing form is submitted
router.post("/edit-listing", upload.single("room_image"), function(req,res){
  var roomData = req.body;
  var roomFile = req.file;
  console.log(roomData);
  var update = {
    "roomTitle": roomData.room_title,
    "roomPrice": roomData.room_price,
    "roomDetail": roomData.room_detail,
    "roomLocation": roomData.room_location,
    "roomGuest": roomData.room_guest 
  };
  if (roomFile !== undefined){
    update.roomImage = roomFile.filename;
  }
  Room.updateOne(
    { _id: roomData.room_id}, 
    { $set: update}  
  )
  .exec()
  .then(() => {
    res.render("room_update", {data: {"session": req.session.user}, layout: false});
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


router.post("/delete-listing", ensureAdminLogin, function(req, res){
  var roomId = req.body.room_id;
  if(roomId === undefined){
    res.render('error_dashboard', {
      error: errormessage,
      layout: false 
    }); 
  }
  else {
    Room.deleteOne({"_id": roomId})
    .exec()
    .then(() => {
      // removed room listing
      console.log("removed listing with id: " + req.params.roomId);
      res.render("room_delete", {data: {"session": req.session.user}, layout: false});
    })
    .catch((err) => {
      console.log(`There was an error: ${err}`);
        var errormessage = "Sorry something went wrong."
        res.render('error_dashboard', {
        error: errormessage,
        layout: false 
        }); 
    });
  }
  
});

router.get("/rooms", function(req,res){
    Room.find({}).lean()
    .exec()
    .then((room) => {
      res.render("roomListing", {data: {"session": req.session.user, "room" : room}, layout: false});
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

router.post("/search", function(req,res){
  var formData = req.body
  Room.find({roomLocation: formData.city}).lean()
  .exec()
  .then((room) => {
    res.render("roomListing", {data: {"session": req.session.user, "room" : room}, layout: false});
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


router.get("/room-detail", function(req,res){
  if(req.query.roomId === undefined) {
    res.render('error_dashboard', {
      error: "Sorry something went wrong",
      layout: false 
    }); 
  }
  else {
    Room.findById(req.query.roomId).lean()
    .exec()
    .then((room) => {
      console.log(room);
      res.render('room_detail', {data: {"session": req.session.user, "room" : room}, layout: false});
    })
    .catch((err) => {
      console.log(`There was an error: ${err}`);
      var errormessage = "Sorry something went wrong."
      res.render('error_dashboard', {
        error: errormessage,
        layout: false 
      }); 
    });
  }
});

router.post("/submit-booking", ensureLogin, (req,res) => {
  var bookingData = req.body;
  console.log("Inside booking submit.");
  console.log(bookingData);
  
  // creating model for db insert booking
  var newBooking = new Booking({
    "checkinDate": new Date(bookingData.checkin_date),
    "checkoutDate": new Date(bookingData.checkout_date),
    "guestNum": bookingData.guestNum,
    "totalPrice": bookingData.total_price,
    "roomId": bookingData.room_id,
    "userId": req.session.user._id,
  });
  // save the booking
  newBooking.save((err) => {
    if(err) {
      console.log(`There was an error saving booking : ${err}`);
      var errormessage = "Sorry something went wrong."
      res.render('error_dashboard', {
        error: errormessage,
        layout: false 
      }); 
    }
    else {
      console.log("Booking successful");
      // code to mail confirmation of booking
      var mailOptions = {
        from: 'rahmanshamima328@gmail.com',
        to: req.session.user.email,
        subject: 'Booking confirmation',
        text: 'Your booking has been cofirmed. Name of the Guest: ' + req.session.user.firstName + ' ' + req.session.user.lastName + '.' + 
        'Start date: ' + bookingData.checkin_date + ' End Date: ' + bookingData.checkout_date +'.'+
        'Total amount is: ' + bookingData.total_price +'.'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } 
        else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.render('booking_success',{
        data: {"session": req.session.user, "booking" : bookingData},
        layout: false 
      });

    }
  });
});

module.exports = router;
