
var mongoose = require("mongoose");
require('dotenv').config();

// mongodb connection and code
mongoose.connect(process.env.DB_CONN);

var Schema = mongoose.Schema;
var userSchema = new Schema({
  "email": {
    type: String,
    unique: true
  },
  "firstName": String,
  "lastName": String,
  "password": String,
  "birthdate": Date,
  "userType": String 
});

var User = mongoose.model("users", userSchema)
module.exports = User;