// src/routes/auth.js
const router = require("express").Router();
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");
const { protect } = require("../middleware/auth");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, skinType } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Tous les champs sont requis." });
  if (password.length < 8)
    return res.status(400).json({ message: "Mot de passe : 8 caractères minimum." });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Cet email est déjà utilisé." });

  const user  = await User.create({ name, email, password, skinType: skinType || null });
  const token = signToken(user._id);
  res.status(201).json({ token, user });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email et mot de passe requis." });

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Email ou mot de passe incorrect." });

  const token = signToken(user._id);
  res.json({ token, user: user.toJSON() });
});

// GET /api/auth/me  (protégé)
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

// PATCH /api/auth/me  (protégé) — modifier son profil
router.patch("/me", protect, async (req, res) => {
  const allowed = ["name", "skinType"];
  const updates = {};
  allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ user });
});

// ── Adresses ──────────────────────────────────────────────────────────────────

// GET /api/auth/addresses
router.get("/addresses", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("addresses");
  res.json({ addresses: user.addresses });
});

// POST /api/auth/addresses — ajouter (max 4)
router.post("/addresses", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.addresses.length >= 4)
    return res.status(400).json({ message: "Maximum 4 adresses enregistrées." });

  const { label, firstName, lastName, address, city, zip, country, isDefault } = req.body;
  if (!address || !city || !zip)
    return res.status(400).json({ message: "Adresse, ville et code postal requis." });

  // Si isDefault, on retire le défaut des autres
  if (isDefault) user.addresses.forEach(a => { a.isDefault = false; });

  // Première adresse = défaut automatiquement
  const setDefault = isDefault || user.addresses.length === 0;

  user.addresses.push({ label, firstName, lastName, address, city, zip, country: country || "France", isDefault: setDefault });
  await user.save();
  res.status(201).json({ addresses: user.addresses });
});

// PATCH /api/auth/addresses/:id — modifier une adresse
router.patch("/addresses/:id", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  const addr = user.addresses.id(req.params.id);
  if (!addr) return res.status(404).json({ message: "Adresse introuvable." });

  const fields = ["label","firstName","lastName","address","city","zip","country","isDefault"];
  fields.forEach(f => { if (req.body[f] !== undefined) addr[f] = req.body[f]; });

  // Unicité du défaut
  if (req.body.isDefault) {
    user.addresses.forEach(a => { if (a._id.toString() !== req.params.id) a.isDefault = false; });
  }

  await user.save();
  res.json({ addresses: user.addresses });
});

// DELETE /api/auth/addresses/:id — supprimer une adresse
router.delete("/addresses/:id", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  const addr = user.addresses.id(req.params.id);
  if (!addr) return res.status(404).json({ message: "Adresse introuvable." });

  addr.deleteOne();

  // Si on supprime le défaut, le premier restant devient défaut
  if (addr.isDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  res.json({ addresses: user.addresses });
});

module.exports = router;
