// src/pages/NotFound.jsx
// Page 404 — affichée pour toute URL inconnue.

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section-pad not-found">
      <p className="eyebrow">Erreur 404</p>
      <h1>Cette page n'existe pas.</h1>
      <p>L'adresse que tu cherches est introuvable ou a peut-être changé.</p>

      <div className="hero-actions">
        <Link className="btn btn-primary" to="/">
          Retour à l'accueil
          <ArrowRight size={18} />
        </Link>
        <Link className="btn btn-secondary" to="/boutique">
          Voir la boutique
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
