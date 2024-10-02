const mongoose = require('mongoose');

const dispatchNoteSchema = new mongoose.Schema({
  orderId: {
    type: Date,
    required: true,
    default: Date.now().toString(),
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  flavor: {
    type: String,
    required: true,
  },
  messageOnCard: {
    type: String,
    required: true,
  },
  specialInstructions: {
    type: String,
  },
  shippingInfo: {
    type: String,
    required: true,
  },
  delivery_date: {
    type: Date,
    required: true,
  },
  shippingTime: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPayment: {
    type: Number,
    required: true,
  },
  advancedPayment: {
    type: Number,
    required: true,
  },
  balancePayment: {
    type: Number,
    required: true,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model('DispatchNote', dispatchNoteSchema);
