const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: false },
  url: { type: String, required: true },
});

// User schema definition
const userSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default:
      "https://t3.ftcdn.net/jpg/03/64/62/36/360_F_364623623_ERzQYfO4HHHyawYkJ16tREsizLyvcaeg.jpg",
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },

  fcmToken: {
    type: String,
    default: null,
  },
  age: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },

  token: {
    type: String,
    default: null,
  },

  userType: {
    type: String,
    // required: true,
    default: "agent",
  },
  createdAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  adminId: {type: ObjectId,ref:"User", required: true},
});

module.exports = mongoose.model("User", userSchema);
