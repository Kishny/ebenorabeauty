// src/components/PageHero.jsx
// Petit hero réutilisable pour les pages internes.

import React from "react";

export default function PageHero({ eyebrow, title, text }) {
  return (
    <section className="page-hero section-pad">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}