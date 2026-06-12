// server.js — Point d'entrée Ebenora Backend
require("dotenv").config();
require("express-async-errors");

const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const rateLimit  = require("express-rate-limit");
const connectDB  = require("./src/config/db");

const authRoutes    = require("./src/routes/auth");
const productRoutes = require("./src/routes/products");
const orderRoutes   = require("./src/routes/orders");
const paymentRoutes = require("./src/routes/payment");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Stripe webhook — doit lire le body RAW avant le parser JSON ──────────────
app.use("/api/payment/stripe/webhook", express.raw({ type: "application/json" }), (req, res, next) => {
  req.rawBody = req.body;
  next();
});

// ── Middlewares globaux ──────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
}));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate limiting — protection anti-brute force sur l'auth
app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { message: "Trop de tentatives. Réessaie dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Rate limiting général
app.use("/api", rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",    authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/orders",  orderRoutes);
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route introuvable : ${req.method} ${req.path}` });
});

// Gestion d'erreurs globale
app.use((err, req, res, next) => {
  console.error("❌", err.message);
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} déjà utilisé.` });
  }
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur." });
});

// ── Démarrage ────────────────────────────────────────────────────────────────
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Serveur Ebenora démarré sur http://localhost:${PORT}`);
  });
}

start();
