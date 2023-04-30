const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user.detail.model");
const Pet = require("./pets.model");

const favouritePets = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  petIds: [
    {
      type: Schema.Types.ObjectId,
      ref: Pet,
      required: true,
    },
  ],
});

module.exports = mongoose.model("FavouritePets", favouritePets);
