// src/middleware/auth.js — Vérification JWT
const jwt  = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non autorisé — token manquant." });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Utilisateur introuvable." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Accès réservé aux administrateurs." });
  }
  next();
}

module.exports = { protect, adminOnly };
