// src/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  slug:         { type: String, required: true, unique: true },
  name:         { type: String, required: true },
  category:     { type: String, required: true },
  categorySlug: { type: String, required: true },
  skinTypes:    [String],
  concern:      String,
  description:  String,
  price:        { type: Number, required: true, min: 0 },
  accent:       { type: String, default: "#601521" },
  image:        String,
  images:       [String],
  badge:        String,
  rating:       { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:  { type: Number, default: 0 },
  isFeatured:   { type: Boolean, default: false },
  ingredients:  [String],
  stock:        { type: Number, default: 100 },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

// slug est déjà indexé via unique:true — on n'ajoute que l'index composite
productSchema.index({ categorySlug: 1, isActive: 1 });

module.exports = mongoose.model("Product", productSchema);
