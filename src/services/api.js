// src/services/api.js
// Client HTTP centralisé — toutes les requêtes vers le backend passent par ici.

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  try { return JSON.parse(localStorage.getItem("ebenora_token") || "null"); }
  catch { return null; }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || `Erreur ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register:       (body) => request("/auth/register", { method: "POST",   body: JSON.stringify(body) }),
  login:          (body) => request("/auth/login",    { method: "POST",   body: JSON.stringify(body) }),
  me:             ()     => request("/auth/me"),
  update:         (body) => request("/auth/me",       { method: "PATCH",  body: JSON.stringify(body) }),
  // Adresses
  getAddresses:   ()     => request("/auth/addresses"),
  addAddress:     (body) => request("/auth/addresses",       { method: "POST",   body: JSON.stringify(body) }),
  updateAddress:  (id, body) => request(`/auth/addresses/${id}`, { method: "PATCH",  body: JSON.stringify(body) }),
  deleteAddress:  (id)   => request(`/auth/addresses/${id}`, { method: "DELETE" }),
};

// ── Produits ──────────────────────────────────────────────────────────────────
export const productsAPI = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? "?" + qs : ""}`);
  },
  get:    (slug) => request(`/products/${slug}`),
};

// ── Commandes ─────────────────────────────────────────────────────────────────
export const ordersAPI = {
  create: (body)  => request("/orders",    { method: "POST", body: JSON.stringify(body) }),
  mine:   ()      => request("/orders/my"),
  get:    (id)    => request(`/orders/${id}`),
};

// ── Paiement ──────────────────────────────────────────────────────────────────
export const paymentAPI = {
  stripeCreateIntent: (body)  => request("/payment/stripe/create-intent", { method: "POST", body: JSON.stringify(body) }),
  paypalCreateOrder:  (body)  => request("/payment/paypal/create-order",  { method: "POST", body: JSON.stringify(body) }),
  paypalCapture:      (body)  => request("/payment/paypal/capture",       { method: "POST", body: JSON.stringify(body) }),
};
