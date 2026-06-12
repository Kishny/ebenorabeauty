// src/models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  slug:      String,
  name:      String,
  image:     String,
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderNumber: { type: String, unique: true },

  items:    [orderItemSchema],

  delivery: {
    firstName: String,
    lastName:  String,
    address:   String,
    city:      String,
    zip:       String,
    country:   { type: String, default: "France" },
  },

  pricing: {
    subtotal:       Number,
    discount:       { type: Number, default: 0 },
    discountCode:   String,
    shipping:       { type: Number, default: 0 },
    total:          Number,
  },

  payment: {
    method:     { type: String, enum: ["stripe", "paypal"], required: true },
    status:     { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    intentId:   String,  // Stripe PaymentIntent ID ou PayPal order ID
    paidAt:     Date,
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },

  shippedAt:   Date,
  deliveredAt: Date,
}, { timestamps: true });

// Génère un numéro de commande lisible avant insertion
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `EB-${Date.now().toString(36).toUpperCase()}-${rand}`;
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
