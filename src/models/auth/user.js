const mongoose = require("mongoose");
const userSchema = mongoose.Schema;

const User = new userSchema({
  username: {
    type: String,
    required: true,
  },
  email_address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: String,
  },
});

module.exports = mongoose.model("Users_CodeLand", User);
