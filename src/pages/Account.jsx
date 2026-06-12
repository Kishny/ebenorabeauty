// src/pages/Account.jsx
// Dashboard client premium — commandes, routine, diagnostic, favoris, paramètres.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  ChevronRight,
  ClipboardList,
  Edit2,
  Heart,
  LogOut,
  MapPin,
  Package,
  Plus,
  ScanFace,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { authAPI, ordersAPI } from "../services/api.js";

/* ── Données fictives de démo ── */
const MOCK_USER = {
  name: "Aïssatou K.",
  email: "aissatou@exemple.fr",
  skinType: "Peau mixte",
  joinDate: "Membre depuis mars 2025",
  avatar: "AK",
};

const MOCK_ORDERS = [
  {
    id: "#EB-2248",
    date: "28 mai 2025",
    status: "Livré",
    statusClass: "acc-badge--delivered",
    items: ["Gel matifiant Sébum Control", "Sérum éclat Ébène"],
    total: "54,80 €",
  },
  {
    id: "#EB-2103",
    date: "12 avril 2025",
    status: "Livré",
    statusClass: "acc-badge--delivered",
    items: ["Crème apaisante Sensitive Melanin"],
    total: "29,90 €",
  },
  {
    id: "#EB-1987",
    date: "3 mars 2025",
    status: "Livré",
    statusClass: "acc-badge--delivered",
    items: ["Routine anti-imperfections", "Huile corps Nude Glow"],
    total: "78,00 €",
  },
];

const MOCK_FAVORITES = [
  { name: "Sérum éclat Ébène", category: "Sérums", price: "32,90 €", slug: "serum-eclat-ebene", accent: "#601521" },
  { name: "Gel matifiant Sébum Control", category: "Hydratants", price: "24,90 €", slug: "gel-matifiant-sebum-control", accent: "#7A2433" },
  { name: "Crème apaisante Sensitive Melanin", category: "Soins visage", price: "29,90 €", slug: "creme-apaisante-sensitive-melanin", accent: "#D96B8A" },
];

const MOCK_ROUTINE = {
  slug: "peau-mixte",
  title: "Routine peau mixte",
  accent: "#7A2433",
  steps: [
    "Nettoyant mousse légère",
    "Gel matifiant zone T",
    "SPF fluide léger",
    "Sérum régulateur soir",
  ],
};

const SKIN_TYPE_OPTIONS = [
  "Peau grasse",
  "Peau mixte",
  "Peau sèche",
  "Peau déshydratée",
  "Peau sensible",
  "Acné & imperfections",
  "Pilosité faciale",
];

const COUNTRIES = ["France","Belgique","Suisse","Canada","Côte d'Ivoire","Sénégal","Cameroun","Autre"];

const EMPTY_ADDR = { label: "", firstName: "", lastName: "", address: "", city: "", zip: "", country: "France", isDefault: false };

const TABS = [
  { id: "orders",    label: "Commandes",  icon: Package },
  { id: "routine",   label: "Ma routine", icon: Sparkles },
  { id: "addresses", label: "Adresses",   icon: MapPin },
  { id: "favorites", label: "Favoris",    icon: Heart },
  { id: "settings",  label: "Paramètres", icon: Settings },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState("orders");

  // ── Commandes réelles ──
  const [orders, setOrders]         = useState(null); // null = pas encore chargé
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "orders" && orders === null) loadOrders();
  }, [activeTab]);

  async function loadOrders() {
    try {
      setOrdersLoading(true);
      const { orders: list } = await ordersAPI.mine();
      setOrders(list);
    } catch {
      setOrders([]); // en mode mock, on affiche vide
    } finally {
      setOrdersLoading(false);
    }
  }

  // ── Adresses ──
  const [addresses, setAddresses]   = useState([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr, setEditingAddr]   = useState(null); // { id, ...fields }
  const [addrForm, setAddrForm]         = useState(EMPTY_ADDR);
  const [addrError, setAddrError]       = useState("");

  useEffect(() => {
    if (activeTab === "addresses") loadAddresses();
  }, [activeTab]);

  async function loadAddresses() {
    try {
      setAddrLoading(true);
      const { addresses: list } = await authAPI.getAddresses();
      setAddresses(list);
    } catch { /* token absent en mode mock */ }
    finally { setAddrLoading(false); }
  }

  function openAdd() {
    setEditingAddr(null);
    setAddrForm(EMPTY_ADDR);
    setAddrError("");
    setShowAddrForm(true);
  }

  function openEdit(addr) {
    setEditingAddr(addr._id);
    setAddrForm({
      label: addr.label || "", firstName: addr.firstName || "",
      lastName: addr.lastName || "", address: addr.address || "",
      city: addr.city || "", zip: addr.zip || "",
      country: addr.country || "France", isDefault: addr.isDefault || false,
    });
    setAddrError("");
    setShowAddrForm(true);
  }

  async function saveAddress(e) {
    e.preventDefault();
    if (!addrForm.address || !addrForm.city || !addrForm.zip) {
      setAddrError("Adresse, ville et code postal sont requis.");
      return;
    }
    try {
      setAddrLoading(true);
      let res;
      if (editingAddr) {
        res = await authAPI.updateAddress(editingAddr, addrForm);
      } else {
        res = await authAPI.addAddress(addrForm);
      }
      setAddresses(res.addresses);
      setShowAddrForm(false);
    } catch (err) {
      setAddrError(err.message || "Erreur lors de la sauvegarde.");
    } finally {
      setAddrLoading(false);
    }
  }

  async function deleteAddress(id) {
    if (!window.confirm("Supprimer cette adresse ?")) return;
    try {
      const { addresses: list } = await authAPI.deleteAddress(id);
      setAddresses(list);
    } catch {}
  }

  async function setDefaultAddress(id) {
    try {
      const { addresses: list } = await authAPI.updateAddress(id, { isDefault: true });
      setAddresses(list);
    } catch {}
  }

  return (
    <div className="acc-page">

      {/* ── Hero profil ── */}
      <div className="acc-hero section-pad">
        <div className="acc-hero-inner">
          <div className="acc-avatar">{MOCK_USER.avatar}</div>
          <div className="acc-hero-info">
            <p className="eyebrow">Ton espace beauté</p>
            <h1>{MOCK_USER.name}</h1>
            <p className="acc-hero-meta">
              <span>{MOCK_USER.email}</span>
              <span className="acc-dot">·</span>
              <span>{MOCK_USER.joinDate}</span>
            </p>
          </div>
          <div className="acc-hero-skin-badge">
            <ScanFace size={15} />
            <span>{MOCK_USER.skinType}</span>
          </div>
        </div>
      </div>

      {/* ── Stats rapides ── */}
      <div className="acc-stats section-pad">
        <div className="acc-stats-inner">
          {[
            { icon: ShoppingBag, value: "3",  label: "Commandes" },
            { icon: Heart,       value: "3",  label: "Favoris" },
            { icon: Award,       value: "162 €", label: "Dépensé" },
            { icon: Star,        value: "4,9",label: "Note moy." },
          ].map(({ icon: Icon, value, label }) => (
            <div className="acc-stat-card" key={label}>
              <Icon size={18} />
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs + contenu ── */}
      <section className="acc-tabs-section section-pad">
        <div className="acc-tabs-layout">

          {/* Sidebar tabs */}
          <nav className="acc-sidebar">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`acc-tab-btn${activeTab === id ? " active" : ""}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={16} />
                {label}
                <ChevronRight size={14} className="acc-tab-chevron" />
              </button>
            ))}
            <button type="button" className="acc-logout-btn">
              <LogOut size={15} />
              Déconnexion
            </button>
          </nav>

          {/* Contenu */}
          <div className="acc-content">

            {/* ── Commandes ── */}
            {activeTab === "orders" && (
              <div className="acc-panel">
                <div className="acc-panel-header">
                  <h2>Mes commandes</h2>
                  <p className="acc-panel-sub">Suivi et historique de tes achats Ebenora.</p>
                </div>

                {ordersLoading ? (
                  <p className="acc-panel-sub">Chargement…</p>
                ) : orders === null || orders?.length === 0 ? (
                  <div className="acc-empty-state">
                    <Package size={28} />
                    <p>Tu n'as pas encore passé de commande.</p>
                    <Link className="btn btn-primary" to="/boutique">
                      <ShoppingBag size={15} /> Découvrir la boutique
                    </Link>
                  </div>
                ) : (
                  <div className="acc-orders-list">
                    {orders.map((order) => {
                      const STATUS_LABELS = { pending:"En attente", confirmed:"Confirmée", shipped:"En livraison", delivered:"Livrée", cancelled:"Annulée" };
                      const STATUS_CLASS  = { pending:"acc-badge--pending", confirmed:"acc-badge--delivered", shipped:"acc-badge--pending", delivered:"acc-badge--delivered", cancelled:"acc-badge--cancelled" };
                      return (
                        <div className="acc-order-card" key={order._id}>
                          <div className="acc-order-top">
                            <div>
                              <p className="acc-order-id">{order.orderNumber}</p>
                              <p className="acc-order-date">
                                {new Date(order.createdAt).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" })}
                              </p>
                            </div>
                            <span className={`acc-badge ${STATUS_CLASS[order.status] || "acc-badge--pending"}`}>
                              {STATUS_LABELS[order.status] || order.status}
                            </span>
                          </div>
                          <ul className="acc-order-items">
                            {order.items.map((item, i) => (
                              <li key={i}>{item.name} × {item.quantity}</li>
                            ))}
                          </ul>
                          <div className="acc-order-footer">
                            <strong>{order.pricing?.total?.toFixed(2)} €</strong>
                            <Link to={`/commande/${order._id}`} className="acc-link-btn">
                              Voir la commande <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Routine ── */}
            {activeTab === "routine" && (
              <div className="acc-panel">
                <div className="acc-panel-header">
                  <h2>Ma routine personnalisée</h2>
                  <p className="acc-panel-sub">Basée sur ton dernier diagnostic peau.</p>
                </div>
                <div className="acc-routine-card" style={{ "--r-accent": MOCK_ROUTINE.accent }}>
                  <div className="acc-routine-header">
                    <Sparkles size={18} />
                    <h3>{MOCK_ROUTINE.title}</h3>
                  </div>
                  <ol className="acc-routine-steps">
                    {MOCK_ROUTINE.steps.map((step, i) => (
                      <li key={i}>
                        <span className="acc-step-num">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="acc-routine-actions">
                    <Link
                      className="btn btn-primary"
                      to={`/routines/${MOCK_ROUTINE.slug}`}
                      style={{ "--btn-accent": MOCK_ROUTINE.accent }}
                    >
                      Voir la routine complète <ArrowRight size={15} />
                    </Link>
                    <Link className="btn btn-secondary" to="/diagnostic">
                      <ScanFace size={15} />
                      Refaire le diagnostic
                    </Link>
                  </div>
                </div>
                <div className="acc-diag-cta">
                  <ClipboardList size={16} />
                  <p>Ton diagnostic a été réalisé le <strong>15 avril 2025</strong>. Refais-le si ta peau a évolué.</p>
                </div>
              </div>
            )}

            {/* ── Adresses ── */}
            {activeTab === "addresses" && (
              <div className="acc-panel">
                <div className="acc-panel-header">
                  <h2>Mes adresses de livraison</h2>
                  <p className="acc-panel-sub">Jusqu'à 4 adresses enregistrées. L'adresse par défaut est pré-sélectionnée à la commande.</p>
                </div>

                {addrLoading && !showAddrForm ? (
                  <p className="acc-panel-sub">Chargement…</p>
                ) : (
                  <>
                    <div className="acc-addresses-grid">
                      {addresses.map((addr) => (
                        <div key={addr._id} className={`acc-address-card${addr.isDefault ? " is-default" : ""}`}>
                          <div className="acc-address-top">
                            <div className="acc-address-label">
                              {addr.isDefault && <span className="acc-default-badge">Par défaut</span>}
                              <strong>{addr.label || "Adresse"}</strong>
                            </div>
                            <div className="acc-address-actions">
                              <button type="button" onClick={() => openEdit(addr)} aria-label="Modifier"><Edit2 size={14} /></button>
                              <button type="button" onClick={() => deleteAddress(addr._id)} aria-label="Supprimer" className="acc-addr-delete"><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <p>{addr.firstName} {addr.lastName}</p>
                          <p>{addr.address}</p>
                          <p>{addr.zip} {addr.city}</p>
                          <p>{addr.country}</p>
                          {!addr.isDefault && (
                            <button type="button" className="acc-set-default" onClick={() => setDefaultAddress(addr._id)}>
                              Définir par défaut
                            </button>
                          )}
                        </div>
                      ))}

                      {addresses.length < 4 && !showAddrForm && (
                        <button type="button" className="acc-add-address" onClick={openAdd}>
                          <Plus size={20} />
                          <span>Ajouter une adresse</span>
                        </button>
                      )}
                    </div>

                    {/* Formulaire ajout / édition */}
                    {showAddrForm && (
                      <form className="acc-addr-form" onSubmit={saveAddress}>
                        <h3>{editingAddr ? "Modifier l'adresse" : "Nouvelle adresse"}</h3>
                        {addrError && <p className="acc-addr-error">{addrError}</p>}

                        <div className="acc-addr-row">
                          <div className="acc-field-group">
                            <label className="acc-label">Étiquette</label>
                            <input className="acc-input" placeholder="Maison, Bureau…" value={addrForm.label} onChange={e => setAddrForm({...addrForm, label: e.target.value})} />
                          </div>
                        </div>

                        <div className="acc-addr-row">
                          <div className="acc-field-group">
                            <label className="acc-label">Prénom</label>
                            <input className="acc-input" value={addrForm.firstName} onChange={e => setAddrForm({...addrForm, firstName: e.target.value})} />
                          </div>
                          <div className="acc-field-group">
                            <label className="acc-label">Nom</label>
                            <input className="acc-input" value={addrForm.lastName} onChange={e => setAddrForm({...addrForm, lastName: e.target.value})} />
                          </div>
                        </div>

                        <div className="acc-field-group">
                          <label className="acc-label">Adresse *</label>
                          <input className="acc-input" placeholder="12 rue des Roses" value={addrForm.address} onChange={e => setAddrForm({...addrForm, address: e.target.value})} />
                        </div>

                        <div className="acc-addr-row">
                          <div className="acc-field-group">
                            <label className="acc-label">Code postal *</label>
                            <input className="acc-input" placeholder="75001" value={addrForm.zip} onChange={e => setAddrForm({...addrForm, zip: e.target.value})} />
                          </div>
                          <div className="acc-field-group">
                            <label className="acc-label">Ville *</label>
                            <input className="acc-input" placeholder="Paris" value={addrForm.city} onChange={e => setAddrForm({...addrForm, city: e.target.value})} />
                          </div>
                        </div>

                        <div className="acc-field-group">
                          <label className="acc-label">Pays</label>
                          <select className="acc-input" value={addrForm.country} onChange={e => setAddrForm({...addrForm, country: e.target.value})}>
                            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>

                        <label className="acc-addr-default-check">
                          <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm({...addrForm, isDefault: e.target.checked})} />
                          Définir comme adresse par défaut
                        </label>

                        <div className="acc-addr-form-actions">
                          <button type="submit" className="btn btn-primary" disabled={addrLoading}>
                            {addrLoading ? "Enregistrement…" : editingAddr ? "Modifier" : "Ajouter"}
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={() => setShowAddrForm(false)}>
                            Annuler
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── Favoris ── */}
            {activeTab === "favorites" && (
              <div className="acc-panel">
                <div className="acc-panel-header">
                  <h2>Mes favoris</h2>
                  <p className="acc-panel-sub">Les produits que tu as mis de côté.</p>
                </div>
                {MOCK_FAVORITES.length === 0 ? (
                  <div className="acc-empty-state">
                    <Heart size={28} />
                    <p>Aucun favori pour l'instant.</p>
                    <Link className="btn btn-primary" to="/boutique">Explorer la boutique</Link>
                  </div>
                ) : (
                  <div className="acc-favorites-grid">
                    {MOCK_FAVORITES.map((p) => (
                      <Link
                        className="acc-fav-card"
                        to={`/produit/${p.slug}`}
                        key={p.slug}
                        style={{ "--fav-accent": p.accent }}
                      >
                        <div className="acc-fav-img">
                          <div className="bottle" aria-hidden="true" />
                        </div>
                        <div className="acc-fav-body">
                          <p className="acc-fav-category">{p.category}</p>
                          <p className="acc-fav-name">{p.name}</p>
                          <p className="acc-fav-price">{p.price}</p>
                        </div>
                        <Heart size={15} className="acc-fav-heart" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Paramètres ── */}
            {activeTab === "settings" && (
              <div className="acc-panel">
                <div className="acc-panel-header">
                  <h2>Paramètres du compte</h2>
                  <p className="acc-panel-sub">Gère tes informations personnelles et préférences.</p>
                </div>
                <form className="acc-settings-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="acc-field-group">
                    <label className="acc-label">Prénom et nom</label>
                    <input className="acc-input" type="text" defaultValue="Aïssatou K." />
                  </div>
                  <div className="acc-field-group">
                    <label className="acc-label">Adresse e-mail</label>
                    <input className="acc-input" type="email" defaultValue="aissatou@exemple.fr" />
                  </div>
                  <div className="acc-field-group">
                    <label className="acc-label">Type de peau (depuis le diagnostic)</label>
                    <input className="acc-input" type="text" defaultValue="Peau mixte" readOnly />
                  </div>
                  <div className="acc-field-group">
                    <label className="acc-label">Nouveau mot de passe</label>
                    <input className="acc-input" type="password" placeholder="••••••••" />
                  </div>
                  <div className="acc-field-group">
                    <label className="acc-label">Confirmation du mot de passe</label>
                    <input className="acc-input" type="password" placeholder="••••••••" />
                  </div>
                  <div className="acc-settings-footer">
                    <button type="submit" className="btn btn-primary">
                      <User size={15} />
                      Enregistrer les modifications
                    </button>
                    <button type="button" className="acc-danger-btn">
                      Supprimer mon compte
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
