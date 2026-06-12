// src/components/ProductCard.jsx
// Carte produit réutilisable dans la boutique et sur la home.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e) {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="product-card">
      <div className="product-art" style={{ "--accent": product.accent }}>
        <span>{product.category}</span>
        <div className="bottle" aria-hidden="true" />
      </div>

      <div className="product-info">
        <small>{product.concern}</small>
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-bottom">
          <strong>{product.price.toFixed(2)} €</strong>

          <div className="product-card-actions">
            <button
              type="button"
              className="btn-add-cart"
              onClick={handleAdd}
              aria-label={`Ajouter ${product.name} au panier`}
            >
              {added ? <CheckCircle2 size={16} /> : <ShoppingBag size={16} />}
              {added ? "Ajouté" : "Ajouter"}
            </button>

            <Link to={`/produit/${product.slug}`} aria-label={`Voir ${product.name}`}>
              Voir
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
