const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

// Media schema definition
const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "User", required: true },
  orderId: String,
  senderName: String,
  senderPhoneNumber: String,
  receiverName: String,
  receiverPhoneNumber: String,
  shippingAddress: String,
  shippingInfo: String,
  cakeName: String,
  flavor: String,
  cakeType: String,
  weight: String,
  messageOnCard: String,
  specialInstructions: String,
  time: String, // Time of delivery
  quantity: Number, // If you still want to keep quantity
  advance_payment: Number,
  balance_payment: Number,
  paymentType: String,
  deliveryBoyId: { type: ObjectId, ref: "User", required: true },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the date when a document is created
  },
  status: {
    type: String,
    default: "pending",
  },
  order_date: {
    type: String,
    required: true,
  },
  deliveryDate: {
    type: String,
    required: true,
  },
  agentName: {
    type: String,
    required: true,
  },
  agentId: String,
  paymentMethod: String,
  source: String,
  image: String,
  dispatchImage: String,

  // createdBy: String,
});

module.exports = mongoose.model("Order", orderSchema);
