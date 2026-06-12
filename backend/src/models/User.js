// src/models/User.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ["client", "admin"], default: "client" },
  skinType:  { type: String, default: null },
  addresses: [{
    label:     String,
    firstName: String,
    lastName:  String,
    address:   String,
    city:      String,
    zip:       String,
    country:   { type: String, default: "France" },
    isDefault: { type: Boolean, default: false },
  }],
}, { timestamps: true });

// Hash password avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode de comparaison de mot de passe
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Ne jamais renvoyer le mot de passe
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
