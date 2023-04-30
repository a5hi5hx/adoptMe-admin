const mongoose = require("mongoose");
const User = require("../models/user.detail.model");
const Schema = mongoose.Schema;

const Pets = Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
    unique: false,
  },
  nickname: {
    type: String,
    required: true,
    unique: false,
  },
  category: {
    type: String,
    required: true,
    unique: false,
  },
  breed: {
    type: String,
    required: true,
    unique: false,
  },
  age: {
    type: String,
    required: true,
    unique: false,
  },
  weight: {
    type: String,
    required: true,
    unique: false,
  },
  health: {
    type: String,
    required: true,
    unique: false,
  },
  color: {
    type: String,
    required: true,
    unique: false,
  },
  location: {
    type: String,
    required: true,
    unique: false,
  },
  image: {
    type: String,
    required: true,
  },
  bookedFlag: {
    type: String,
    unique: false,
  },
  stars: {
    type: Number,
    min: 0,
    unique: false,
  },
  gender: {
    type: String,
    required: true,
    unique: false,
  },
  playerId: {
    type: String,
    required: true,
    unique: false,
  },
  displayFlag: {
    type: String,
    unique: false,
  },
});

module.exports = mongoose.model("Pets", Pets);
