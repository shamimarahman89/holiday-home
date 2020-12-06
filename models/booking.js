var mongoose = require("mongoose");
require('dotenv').config();

// mongodb connection and code
mongoose.connect(process.env.DB_CONN);

var Schema = mongoose.Schema;
var bookingSchema = new Schema({
  
  "checkinDate": Date,
  "checkoutDate": Date,
  "guestNum": Number,
  "totalPrice": Number,
  "roomId": String,
  "userId": String
});

var Booking = mongoose.model("bookings", bookingSchema)
module.exports = Booking;



