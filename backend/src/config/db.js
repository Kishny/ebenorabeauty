// src/config/db.js — Connexion MongoDB via Mongoose
const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI manquant dans .env");

  await mongoose.connect(uri);
  console.log(`✅ MongoDB connecté : ${mongoose.connection.host}`);
}

module.exports = connectDB;
