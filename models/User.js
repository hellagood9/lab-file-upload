const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    password: String,
    profilePhoto: String,
    email: String,
    confirmCode: {
      type: String,
      unique: true
    },
    googleID: String,
    status: {
      type: String,
      enum: ["Active", "Pending"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
