const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserDetail = require("./user.detail.model");
const User = require("./users.model");

const Pets = require("./pets.model");

const Booking = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: UserDetail,
    required: true,
  },
  pet: {
    type: Schema.Types.ObjectId,
    ref: Pets,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Booking", Booking);
