const mongoose = require("mongoose");

const User = require("../models/users.model");
const Schema = mongoose.Schema;

const UserDetails = Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  image: {
    type: String,
    required: true,
    unique: false,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  phone: {
    type: String,
    required: true,
    unique: false,
  },
  mobile: {
    type: String,
    required: true,
    unique: false,
  },
  address: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("UserDetails", UserDetails);
