// src/routes/products.js
const router  = require("express").Router();
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/products — liste avec filtres & pagination
router.get("/", async (req, res) => {
  const { category, sort, page = 1, limit = 20 } = req.query;
  const filter = { isActive: true };
  if (category) filter.categorySlug = category;

  const sortMap = {
    popular:    { reviewCount: -1 },
    "price-asc":  { price: 1 },
    "price-desc": { price: -1 },
    rating:     { rating: -1 },
  };
  const sortObj = sortMap[sort] || { reviewCount: -1 };

  const total    = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/products/:slug
router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) return res.status(404).json({ message: "Produit introuvable." });
  res.json({ product });
});

// POST /api/products — admin uniquement
router.post("/", protect, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
});

// PATCH /api/products/:id — admin uniquement
router.patch("/:id", protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: "Produit introuvable." });
  res.json({ product });
});

module.exports = router;
