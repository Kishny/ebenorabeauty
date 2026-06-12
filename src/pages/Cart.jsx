// src/pages/Cart.jsx
// Page panier premium — photo produit, livraison, récap, code promo.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  Leaf,
  Minus,
  Plus,
  RefreshCw,
  ScanFace,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

const PROMO_CODES = { EBENORA10: 10, BIENVENUE: 15 };
const FREE_SHIPPING_THRESHOLD = 50;

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState("");

  const discount = promoApplied ? PROMO_CODES[promoApplied] : 0;
  const discountAmount = (total * discount) / 100;
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 4.9;
  const finalTotal = total - discountAmount + shipping;
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total).toFixed(2);

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setPromoApplied(code);
      setPromoError("");
    } else {
      setPromoError("Code invalide ou expiré.");
      setPromoApplied(null);
    }
  }

  /* ── Panier vide ── */
  if (items.length === 0) {
    return (
      <div className="cart-empty-page section-pad">
        <div className="cart-empty-inner">
          <div className="cart-empty-icon">
            <ShoppingBag size={32} />
          </div>
          <p className="eyebrow">Panier</p>
          <h1>Ton panier est vide.</h1>
          <p>Explore la boutique pour trouver les soins adaptés à ta peau mélaninée.</p>
          <div className="cart-empty-actions">
            <Link className="btn btn-primary" to="/boutique">
              Découvrir la boutique
              <ArrowRight size={18} />
            </Link>
            <Link className="btn btn-secondary" to="/diagnostic">
              <ScanFace size={17} />
              Faire mon diagnostic
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Panier rempli ── */
  return (
    <div className="cart-page">

      {/* ── Header page ── */}
      <div className="cart-page-header section-pad">
        <div className="cart-page-header-inner">
          <div>
            <p className="eyebrow">Panier</p>
            <h1>{items.reduce((s, i) => s + i.quantity, 0)} article{items.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""} sélectionné{items.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}.</h1>
          </div>
          {/* Barre livraison offerte */}
          {shipping > 0 ? (
            <div className="cart-shipping-bar">
              <Truck size={16} />
              <span>Plus que <strong>{toFreeShipping} €</strong> pour la livraison offerte</span>
              <div className="cart-shipping-progress">
                <div
                  className="cart-shipping-fill"
                  style={{ width: `${Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="cart-shipping-bar cart-shipping-bar--free">
              <CheckCircle2 size={16} />
              <span><strong>Livraison offerte</strong> sur ta commande 🎉</span>
            </div>
          )}
        </div>
      </div>

      <section className="cart-section section-pad">
        <div className="cart-layout">

          {/* ── Colonne articles ── */}
          <div className="cart-items-col">
            {items.map((item) => (
              <article className="cart-item-card" key={item.id}>
                {/* Image produit */}
                <div className="cart-item-img-wrap" style={{ "--accent": item.accent }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div className="cart-item-img-fallback">
                    <div className="bottle" aria-hidden="true" />
                  </div>
                </div>

                {/* Infos */}
                <div className="cart-item-body">
                  <div className="cart-item-meta">
                    <p className="cart-item-category">{item.category}</p>
                    <Link className="cart-item-name" to={`/produit/${item.slug}`}>
                      {item.name}
                    </Link>
                    <p className="cart-item-unit-price">{item.price.toFixed(2)} € / unité</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-qty">
                      <button
                        type="button"
                        aria-label="Diminuer"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={13} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Augmenter"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <strong className="cart-item-line-price">
                      {(item.price * item.quantity).toFixed(2)} €
                    </strong>

                    <button
                      type="button"
                      className="cart-item-delete"
                      aria-label={`Retirer ${item.name}`}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <button type="button" className="cart-clear-btn" onClick={clearCart}>
              Vider le panier
            </button>

            {/* Trust bar */}
            <div className="cart-trust-bar">
              <span><Truck size={14} /> Livraison offerte dès 50 €</span>
              <span><RefreshCw size={14} /> Retours sous 30 jours</span>
              <span><Leaf size={14} /> Formules clean</span>
              <span><ShieldCheck size={14} /> Paiement sécurisé</span>
            </div>
          </div>

          {/* ── Récapitulatif ── */}
          <aside className="cart-summary-col">
            <div className="cart-summary-card">
              <h2>Récapitulatif</h2>

              {/* Lignes produits */}
              <div className="cart-summary-lines">
                {items.map((item) => (
                  <div className="cart-summary-line" key={item.id}>
                    <span className="cart-summary-line-name">
                      {item.name}
                      <span className="cart-summary-line-qty"> ×{item.quantity}</span>
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              {/* Code promo */}
              <div className="cart-promo">
                <div className="cart-promo-input-row">
                  <Tag size={15} className="cart-promo-icon" />
                  <input
                    type="text"
                    placeholder="Code promo"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                    className="cart-promo-input"
                  />
                  <button
                    type="button"
                    className="cart-promo-btn"
                    onClick={applyPromo}
                  >
                    Appliquer
                  </button>
                </div>
                {promoError && <p className="cart-promo-error">{promoError}</p>}
                {promoApplied && (
                  <p className="cart-promo-success">
                    <CheckCircle2 size={13} />
                    Code <strong>{promoApplied}</strong> appliqué — {discount} % de réduction
                  </p>
                )}
              </div>

              {/* Totaux */}
              <div className="cart-totals">
                <div className="cart-total-line">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                {promoApplied && (
                  <div className="cart-total-line cart-total-line--promo">
                    <span>Réduction ({discount} %)</span>
                    <span>− {discountAmount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="cart-total-line">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? <span className="cart-free-shipping">Offerte</span> : `${shipping.toFixed(2)} €`}</span>
                </div>
                <div className="cart-total-final">
                  <span>Total</span>
                  <strong>{finalTotal.toFixed(2)} €</strong>
                </div>
              </div>

              <button
                className="btn btn-primary cart-checkout-btn"
                type="button"
                onClick={() => isLoggedIn ? navigate("/commander") : navigate("/connexion?redirect=/commander")}
              >
                Passer commande
                <ArrowRight size={18} />
              </button>

              <Link className="cart-continue-link" to="/boutique">
                Continuer mes achats
              </Link>

              {/* Gift */}
              <div className="cart-gift-note">
                <Gift size={14} />
                <span>Codes promo disponibles : <strong>EBENORA10</strong> (−10 %) ou <strong>BIENVENUE</strong> (−15 %)</span>
              </div>
            </div>
          </aside>

        </div>
      </section>
    </div>
  );
}
