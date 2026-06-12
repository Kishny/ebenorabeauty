// src/routes/payment.js — Stripe + PayPal
const router = require("express").Router();
const Order  = require("../models/Order");
const { protect } = require("../middleware/auth");

// ─── STRIPE ──────────────────────────────────────────────────────────────────

// POST /api/payment/stripe/create-intent
router.post("/stripe/create-intent", protect, async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const { amount, currency = "eur", orderId } = req.body;

  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Montant invalide." });

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // centimes
    currency,
    metadata: { orderId: orderId || "", userId: req.user._id.toString() },
    automatic_payment_methods: { enabled: true },
  });

  res.json({ clientSecret: intent.client_secret, intentId: intent.id });
});

// POST /api/payment/stripe/webhook — Stripe envoie les événements ici
// ⚠️ Ce endpoint doit recevoir le body brut (pas JSON parsé)
router.post("/stripe/webhook", async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const sig    = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook Stripe invalide :", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    await Order.findOneAndUpdate(
      { "payment.intentId": intent.id },
      { "payment.status": "paid", "payment.paidAt": new Date(), status: "confirmed" }
    );
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    await Order.findOneAndUpdate(
      { "payment.intentId": intent.id },
      { "payment.status": "failed" }
    );
  }

  res.json({ received: true });
});

// ─── PAYPAL ──────────────────────────────────────────────────────────────────
// Utilise le nouveau SDK @paypal/paypal-server-sdk

function getPayPalConfig() {
  const { Client, Environment } = require("@paypal/paypal-server-sdk");
  return new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId:     process.env.PAYPAL_CLIENT_ID,
      oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    },
    environment: process.env.PAYPAL_MODE === "live"
      ? Environment.Production
      : Environment.Sandbox,
  });
}

// POST /api/payment/paypal/create-order
router.post("/paypal/create-order", protect, async (req, res) => {
  const { OrdersController } = require("@paypal/paypal-server-sdk");
  const { amount, orderId } = req.body;

  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Montant invalide." });

  const client = getPayPalConfig();
  const ordersController = new OrdersController(client);

  const { body } = await ordersController.ordersCreate({
    body: {
      intent: "CAPTURE",
      purchaseUnits: [{
        amount: { currencyCode: "EUR", value: amount.toFixed(2) },
        customId: orderId || "",
      }],
    },
  });

  res.json({ paypalOrderId: body.id });
});

// POST /api/payment/paypal/capture
router.post("/paypal/capture", protect, async (req, res) => {
  const { OrdersController } = require("@paypal/paypal-server-sdk");
  const { paypalOrderId, orderId } = req.body;

  const client = getPayPalConfig();
  const ordersController = new OrdersController(client);

  const { body } = await ordersController.ordersCapture({ id: paypalOrderId });

  if (body.status === "COMPLETED") {
    await Order.findByIdAndUpdate(orderId, {
      "payment.status":  "paid",
      "payment.paidAt":  new Date(),
      "payment.intentId": paypalOrderId,
      status: "confirmed",
    });
    res.json({ success: true });
  } else {
    res.status(400).json({ message: "Capture PayPal échouée.", status: body.status });
  }
});

module.exports = router;
