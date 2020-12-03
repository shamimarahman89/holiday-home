var mongoose = require("mongoose");
require('dotenv').config();

// mongodb connection and code
mongoose.connect(process.env.DB_CONN);

var Schema = mongoose.Schema;
var roomSchema = new Schema({
  
  "roomTitle": String,
  "roomPrice": Number,
  "roomDetail": String,
  "roomLocation": String,
  "roomImage": String 
});

var Room = mongoose.model("rooms", roomSchema)
module.exports = Room;