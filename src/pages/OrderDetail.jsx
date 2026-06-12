// src/pages/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, CheckCircle2, Clock, MapPin, Package,
  RotateCcw, ShoppingBag, Truck, XCircle,
} from "lucide-react";
import { ordersAPI } from "../services/api.js";

const STATUS_CONFIG = {
  pending:   { label: "En attente",    icon: Clock,         color: "#f57f17", bg: "#fff8e1" },
  confirmed: { label: "Confirmée",     icon: CheckCircle2,  color: "#2e7d32", bg: "#e8f5e9" },
  shipped:   { label: "En livraison",  icon: Truck,         color: "#1565c0", bg: "#e3f2fd" },
  delivered: { label: "Livrée",        icon: Package,       color: "#2e7d32", bg: "#e8f5e9" },
  cancelled: { label: "Annulée",       icon: XCircle,       color: "#c62828", bg: "#fce4ec" },
};

const STEPS = ["confirmed","shipped","delivered"];
const STEP_LABELS = { confirmed: "Confirmée", shipped: "Expédiée", delivered: "Livrée" };

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ordersAPI.get(id)
      .then(({ order: o }) => setOrder(o))
      .catch(err => setError(err.message || "Commande introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="order-detail-loading section-pad">
      <p>Chargement de la commande…</p>
    </div>
  );

  if (error || !order) return (
    <div className="order-detail-error section-pad">
      <XCircle size={32} />
      <p>{error || "Commande introuvable."}</p>
      <Link className="btn btn-secondary" to="/compte">← Mes commandes</Link>
    </div>
  );

  const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = st.icon;
  const currentStep = STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="order-detail-page">

      {/* ── Header ── */}
      <div className="order-detail-header section-pad">
        <div className="order-detail-header-inner">
          <button type="button" className="order-back-btn" onClick={() => navigate("/compte")}>
            <ArrowLeft size={16} /> Mes commandes
          </button>
          <div className="order-detail-title">
            <div>
              <p className="eyebrow">Détail de commande</p>
              <h1>{order.orderNumber}</h1>
              <p className="order-detail-date">
                Passée le {new Date(order.createdAt).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" })}
              </p>
            </div>
            <div className="order-status-badge" style={{ color: st.color, background: st.bg }}>
              <StatusIcon size={15} />
              {st.label}
            </div>
          </div>
        </div>
      </div>

      <div className="order-detail-body section-pad">
        <div className="order-detail-layout">

          {/* ── Colonne principale ── */}
          <div className="order-detail-main">

            {/* Progression */}
            {!isCancelled && (
              <div className="order-progress-card">
                <h3>Suivi de commande</h3>
                <div className="order-progress-steps">
                  {STEPS.map((step, i) => (
                    <div key={step} className={`order-progress-step${i <= currentStep ? " is-done" : ""}`}>
                      <div className="order-progress-dot">
                        {i <= currentStep ? <CheckCircle2 size={16} /> : <span>{i + 1}</span>}
                      </div>
                      <span>{STEP_LABELS[step]}</span>
                      {i < STEPS.length - 1 && (
                        <div className={`order-progress-line${i < currentStep ? " is-done" : ""}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Articles */}
            <div className="order-items-card">
              <h3>Articles commandés</h3>
              <div className="order-items-list">
                {order.items.map((item, i) => (
                  <div className="order-item-row" key={i}>
                    <div className="order-item-img">
                      {item.image
                        ? <img src={item.image} alt={item.name} onError={e => e.target.style.display="none"} />
                        : <ShoppingBag size={18} />
                      }
                    </div>
                    <div className="order-item-info">
                      <Link to={`/produit/${item.slug}`} className="order-item-name">{item.name}</Link>
                      <span className="order-item-qty">Quantité : {item.quantity}</span>
                    </div>
                    <strong className="order-item-price">
                      {(item.price * item.quantity).toFixed(2)} €
                    </strong>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Sidebar ── */}
          <aside className="order-detail-aside">

            {/* Récap financier */}
            <div className="order-recap-card">
              <h3>Récapitulatif</h3>
              <div className="order-recap-lines">
                <div className="order-recap-line">
                  <span>Sous-total</span>
                  <span>{order.pricing?.subtotal?.toFixed(2)} €</span>
                </div>
                {order.pricing?.discount > 0 && (
                  <div className="order-recap-line order-recap-promo">
                    <span>Réduction {order.pricing.discountCode && `(${order.pricing.discountCode})`}</span>
                    <span>− {order.pricing.discount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="order-recap-line">
                  <span>Livraison</span>
                  <span>{order.pricing?.shipping === 0 ? "Offerte" : `${order.pricing?.shipping?.toFixed(2)} €`}</span>
                </div>
                <div className="order-recap-total">
                  <span>Total payé</span>
                  <strong>{order.pricing?.total?.toFixed(2)} €</strong>
                </div>
              </div>
              <div className="order-payment-info">
                <span className="order-payment-method">
                  {order.payment?.method === "stripe" ? "💳 Carte bancaire" : "🅿️ PayPal"}
                </span>
                <span className={`order-payment-status ${order.payment?.status === "paid" ? "is-paid" : ""}`}>
                  {order.payment?.status === "paid" ? "✓ Payé" : order.payment?.status}
                </span>
              </div>
            </div>

            {/* Adresse livraison */}
            <div className="order-recap-card">
              <h3><MapPin size={15} /> Adresse de livraison</h3>
              {order.delivery ? (
                <address className="order-delivery-address">
                  <strong>{order.delivery.firstName} {order.delivery.lastName}</strong>
                  <span>{order.delivery.address}</span>
                  <span>{order.delivery.zip} {order.delivery.city}</span>
                  <span>{order.delivery.country}</span>
                </address>
              ) : <p className="order-no-data">Non renseignée</p>}
            </div>

            {/* Actions */}
            <div className="order-actions">
              <Link className="btn btn-secondary" to="/boutique">
                <ShoppingBag size={15} /> Racheter des produits
              </Link>
              {order.status === "delivered" && (
                <button type="button" className="order-return-btn">
                  <RotateCcw size={15} /> Faire un retour
                </button>
              )}
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
