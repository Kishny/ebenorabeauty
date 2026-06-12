// src/pages/AppMobile.jsx
// Présentation de la future application mobile.

import React from "react";
import PageHero from "../components/PageHero.jsx";
import { Bell, Heart, ScanFace, ShoppingBag } from "lucide-react";

export default function AppMobile() {
  return (
    <>
      <PageHero
        eyebrow="Application mobile"
        title="Une expérience beauté mobile-first."
        text="Le site est pensé mobile-first dès maintenant, puis pourra évoluer en vraie application mobile avec suivi personnalisé."
      />

      <section className="section-pad">
        <div className="app-grid">
          <article>
            <ScanFace />
            <h3>Diagnostic intelligent</h3>
            <p>Suivi du type de peau, des besoins et des routines.</p>
          </article>

          <article>
            <Bell />
            <h3>Rappels routine</h3>
            <p>Notifications matin et soir selon tes habitudes.</p>
          </article>

          <article>
            <Heart />
            <h3>Favoris</h3>
            <p>Produits, routines et conseils sauvegardés.</p>
          </article>

          <article>
            <ShoppingBag />
            <h3>Achat rapide</h3>
            <p>Une boutique simple, fluide et pensée pour mobile.</p>
          </article>
        </div>
      </section>
    </>
  );
}