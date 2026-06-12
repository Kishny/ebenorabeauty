// src/pages/Checkout.jsx
// Page de commande et paiement — accessible uniquement si connecté.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, CreditCard, Lock, Package, ShieldCheck, Truck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const PROMO_CODES = { EBENORA10: 10, BIENVENUE: 15 };
const FREE_SHIPPING = 50;

function formatCard(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val) {
  return val.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=livraison, 2=paiement, 3=confirmation
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [loading, setLoading] = useState(false);

  const [delivery, setDelivery] = useState({ firstName: user?.name || "", lastName: "", address: "", city: "", zip: "", country: "France" });
  const [deliveryErrors, setDeliveryErrors] = useState({});

  const [payment, setPayment] = useState({ card: "", expiry: "", cvv: "", name: "" });
  const [paymentErrors, setPaymentErrors] = useState({});

  const discount = promoApplied ? PROMO_CODES[promoApplied] : 0;
  const discountAmount = (total * discount) / 100;
  const shipping = total >= FREE_SHIPPING ? 0 : 4.9;
  const finalTotal = total - discountAmount + shipping;

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) { setPromoApplied(code); setPromoError(""); }
    else { setPromoError("Code invalide ou expiré."); setPromoApplied(null); }
  }

  function validateDelivery() {
    const e = {};
    if (!delivery.firstName.trim()) e.firstName = "Requis";
    if (!delivery.lastName.trim()) e.lastName = "Requis";
    if (!delivery.address.trim()) e.address = "Requis";
    if (!delivery.city.trim()) e.city = "Requis";
    if (!delivery.zip.trim()) e.zip = "Requis";
    return e;
  }

  function validatePayment() {
    const e = {};
    if (payment.card.replace(/\s/g, "").length < 16) e.card = "Numéro de carte invalide";
    if (payment.expiry.length < 5) e.expiry = "Date invalide";
    if (payment.cvv.length < 3) e.cvv = "CVV invalide";
    if (!payment.name.trim()) e.name = "Requis";
    return e;
  }

  function handleDeliveryNext(e) {
    e.preventDefault();
    const errs = validateDelivery();
    if (Object.keys(errs).length) { setDeliveryErrors(errs); return; }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePaymentSubmit(e) {
    e.preventDefault();
    const errs = validatePayment();
    if (Object.keys(errs).length) { setPaymentErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      clearCart();
      setStep(3);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  }

  // ── Confirmation ──
  if (step === 3) {
    return (
      <div className="checkout-success section-pad">
        <div className="checkout-success-inner">
          <div className="checkout-success-icon"><CheckCircle2 size={40} /></div>
          <h1>Commande confirmée !</h1>
          <p>Merci <strong>{user?.name}</strong>. Un email de confirmation a été envoyé à <strong>{user?.email}</strong>.</p>
          <div className="checkout-success-meta">
            <div><Package size={16} /> Préparation sous 24h</div>
            <div><Truck size={16} /> Livraison estimée : 3–5 jours ouvrés</div>
          </div>
          <div className="checkout-success-actions">
            <Link className="btn btn-primary" to="/compte">Voir mes commandes</Link>
            <Link className="btn btn-secondary" to="/boutique">Continuer mes achats</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* ── Breadcrumb étapes ── */}
      <div className="checkout-steps">
        <div className={`checkout-step${step >= 1 ? " is-done" : ""}`}>
          <span>1</span> Livraison
        </div>
        <ChevronRight size={14} className="checkout-step-sep" />
        <div className={`checkout-step${step >= 2 ? " is-done" : ""}`}>
          <span>2</span> Paiement
        </div>
        <ChevronRight size={14} className="checkout-step-sep" />
        <div className="checkout-step"><span>3</span> Confirmation</div>
      </div>

      <div className="checkout-layout section-pad">

        {/* ── Colonne formulaire ── */}
        <div className="checkout-form-col">

          {/* STEP 1 — Livraison */}
          {step === 1 && (
            <form className="checkout-form" onSubmit={handleDeliveryNext} noValidate>
              <h2 className="checkout-form-title">
                <Truck size={18} /> Adresse de livraison
              </h2>
              <div className="checkout-row">
                <div className="checkout-field">
                  <label>Prénom *</label>
                  <input className={deliveryErrors.firstName ? "is-error" : ""} value={delivery.firstName} onChange={e => setDelivery({...delivery, firstName: e.target.value})} placeholder="Ton prénom" />
                  {deliveryErrors.firstName && <p className="checkout-error">{deliveryErrors.firstName}</p>}
                </div>
                <div className="checkout-field">
                  <label>Nom *</label>
                  <input className={deliveryErrors.lastName ? "is-error" : ""} value={delivery.lastName} onChange={e => setDelivery({...delivery, lastName: e.target.value})} placeholder="Ton nom" />
                  {deliveryErrors.lastName && <p className="checkout-error">{deliveryErrors.lastName}</p>}
                </div>
              </div>
              <div className="checkout-field">
                <label>Adresse *</label>
                <input className={deliveryErrors.address ? "is-error" : ""} value={delivery.address} onChange={e => setDelivery({...delivery, address: e.target.value})} placeholder="12 rue des Roses" />
                {deliveryErrors.address && <p className="checkout-error">{deliveryErrors.address}</p>}
              </div>
              <div className="checkout-row">
                <div className="checkout-field">
                  <label>Code postal *</label>
                  <input className={deliveryErrors.zip ? "is-error" : ""} value={delivery.zip} onChange={e => setDelivery({...delivery, zip: e.target.value})} placeholder="75001" maxLength={10} />
                  {deliveryErrors.zip && <p className="checkout-error">{deliveryErrors.zip}</p>}
                </div>
                <div className="checkout-field">
                  <label>Ville *</label>
                  <input className={deliveryErrors.city ? "is-error" : ""} value={delivery.city} onChange={e => setDelivery({...delivery, city: e.target.value})} placeholder="Paris" />
                  {deliveryErrors.city && <p className="checkout-error">{deliveryErrors.city}</p>}
                </div>
              </div>
              <div className="checkout-field">
                <label>Pays</label>
                <select value={delivery.country} onChange={e => setDelivery({...delivery, country: e.target.value})}>
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>Canada</option>
                  <option>Côte d'Ivoire</option>
                  <option>Sénégal</option>
                  <option>Cameroun</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary checkout-next">
                Continuer vers le paiement <ChevronRight size={16} />
              </button>
            </form>
          )}

          {/* STEP 2 — Paiement */}
          {step === 2 && (
            <form className="checkout-form" onSubmit={handlePaymentSubmit} noValidate>
              <h2 className="checkout-form-title">
                <CreditCard size={18} /> Informations de paiement
              </h2>
              <div className="checkout-secure-note">
                <Lock size={13} />
                <span>Paiement 100 % sécurisé — vos données sont chiffrées</span>
              </div>
              <div className="checkout-field">
                <label>Numéro de carte *</label>
                <input className={paymentErrors.card ? "is-error" : ""}
                  value={payment.card}
                  onChange={e => setPayment({...payment, card: formatCard(e.target.value)})}
                  placeholder="1234 5678 9012 3456" maxLength={19} inputMode="numeric" />
                {paymentErrors.card && <p className="checkout-error">{paymentErrors.card}</p>}
              </div>
              <div className="checkout-row">
                <div className="checkout-field">
                  <label>Date d'expiration *</label>
                  <input className={paymentErrors.expiry ? "is-error" : ""}
                    value={payment.expiry}
                    onChange={e => setPayment({...payment, expiry: formatExpiry(e.target.value)})}
                    placeholder="MM/AA" maxLength={5} />
                  {paymentErrors.expiry && <p className="checkout-error">{paymentErrors.expiry}</p>}
                </div>
                <div className="checkout-field">
                  <label>CVV *</label>
                  <input className={paymentErrors.cvv ? "is-error" : ""}
                    value={payment.cvv}
                    onChange={e => setPayment({...payment, cvv: e.target.value.replace(/\D/g,"").slice(0,4)})}
                    placeholder="123" maxLength={4} inputMode="numeric" />
                  {paymentErrors.cvv && <p className="checkout-error">{paymentErrors.cvv}</p>}
                </div>
              </div>
              <div className="checkout-field">
                <label>Nom sur la carte *</label>
                <input className={paymentErrors.name ? "is-error" : ""}
                  value={payment.name}
                  onChange={e => setPayment({...payment, name: e.target.value})}
                  placeholder="PRÉNOM NOM" />
                {paymentErrors.name && <p className="checkout-error">{paymentErrors.name}</p>}
              </div>
              <div className="checkout-back-row">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                  ← Modifier la livraison
                </button>
                <button type="submit" className={`btn btn-primary checkout-next${loading ? " is-loading" : ""}`} disabled={loading}>
                  {loading ? "Traitement…" : <><Lock size={15} /> Payer {finalTotal.toFixed(2)} €</>}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Récapitulatif ── */}
        <aside className="checkout-summary">
          <h3>Récapitulatif</h3>
          <div className="checkout-summary-items">
            {items.map(item => (
              <div className="checkout-summary-item" key={item.id}>
                <div className="checkout-item-img" style={{ background: `color-mix(in srgb, ${item.accent || "#601521"} 12%, white)` }}>
                  {item.image && <img src={item.image} alt={item.name} onError={e => e.target.style.display="none"} />}
                </div>
                <div className="checkout-item-info">
                  <p>{item.name}</p>
                  <span>× {item.quantity}</span>
                </div>
                <strong>{(item.price * item.quantity).toFixed(2)} €</strong>
              </div>
            ))}
          </div>

          {/* Code promo */}
          <div className="checkout-promo">
            <input type="text" placeholder="Code promo" value={promoInput}
              onChange={e => setPromoInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applyPromo()} />
            <button type="button" onClick={applyPromo}>Appliquer</button>
          </div>
          {promoError && <p className="checkout-promo-error">{promoError}</p>}
          {promoApplied && <p className="checkout-promo-ok">✓ {promoApplied} — {discount} % appliqué</p>}

          <div className="checkout-totals">
            <div className="checkout-total-line"><span>Sous-total</span><span>{total.toFixed(2)} €</span></div>
            {promoApplied && <div className="checkout-total-line checkout-total-promo"><span>Réduction ({discount} %)</span><span>− {discountAmount.toFixed(2)} €</span></div>}
            <div className="checkout-total-line"><span>Livraison</span><span>{shipping === 0 ? "Offerte" : `${shipping.toFixed(2)} €`}</span></div>
            <div className="checkout-total-final"><span>Total</span><strong>{finalTotal.toFixed(2)} €</strong></div>
          </div>

          <div className="checkout-trust">
            <span><ShieldCheck size={13} /> Paiement sécurisé</span>
            <span><Truck size={13} /> Livraison offerte dès 50 €</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
