// src/routes/orders.js
const router  = require("express").Router();
const Order   = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

// POST /api/orders — créer une commande (protégé)
router.post("/", protect, async (req, res) => {
  const { items, delivery, pricing, payment } = req.body;

  if (!items?.length) return res.status(400).json({ message: "Panier vide." });
  if (!delivery?.address) return res.status(400).json({ message: "Adresse de livraison requise." });
  if (!payment?.method) return res.status(400).json({ message: "Méthode de paiement requise." });

  // Vérifier stock et recalculer les prix côté serveur
  const resolvedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findOne({ slug: item.slug, isActive: true });
    if (!product) return res.status(404).json({ message: `Produit introuvable : ${item.slug}` });
    if (product.stock < item.quantity)
      return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });

    resolvedItems.push({
      product:  product._id,
      slug:     product.slug,
      name:     product.name,
      image:    product.image,
      price:    product.price,
      quantity: item.quantity,
    });
    subtotal += product.price * item.quantity;
  }

  // Calcul livraison serveur
  const shippingCost = subtotal >= 50 ? 0 : 4.9;

  // Réduction code promo
  const PROMO = { EBENORA10: 10, BIENVENUE: 15 };
  const promoCode = pricing?.discountCode?.toUpperCase();
  const discountPct = promoCode && PROMO[promoCode] ? PROMO[promoCode] : 0;
  const discountAmt = parseFloat(((subtotal * discountPct) / 100).toFixed(2));
  const total = parseFloat((subtotal - discountAmt + shippingCost).toFixed(2));

  const order = await Order.create({
    user:     req.user._id,
    items:    resolvedItems,
    delivery,
    pricing:  { subtotal, discount: discountAmt, discountCode: promoCode || null, shipping: shippingCost, total },
    payment:  { method: payment.method, status: "pending", intentId: payment.intentId || null },
  });

  // Décrémente le stock
  for (const item of resolvedItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  res.status(201).json({ order });
});

// GET /api/orders/my — commandes de l'utilisateur connecté
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json({ orders });
});

// GET /api/orders/:id — détail d'une commande (propriétaire uniquement)
router.get("/:id", protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product", "name image slug");
  if (!order) return res.status(404).json({ message: "Commande introuvable." });
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
    return res.status(403).json({ message: "Accès refusé." });
  res.json({ order });
});

// PATCH /api/orders/:id/status — admin uniquement
router.patch("/:id/status", protect, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin uniquement." });
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Commande introuvable." });
  res.json({ order });
});

module.exports = router;
