// src/pages/Routines.jsx
// Page liste des routines — cartes visuelles avec image, tags et aperçu.

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ScanFace } from "lucide-react";
import { routinesData } from "../data/routinesData.js";

const routinesList = Object.values(routinesData);

export default function Routines() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="routines-hero section-pad">
        <div className="routines-hero-content">
          <p className="eyebrow">Routines</p>
          <h1>Chaque peau a besoin<br />d'une stratégie claire.</h1>
          <p className="routines-hero-text">
            Découvre des routines adaptées aux peaux grasses, mixtes, sèches, sensibles,
            déshydratées ou sujettes aux imperfections — pensées pour les carnations mélaninées.
          </p>
          <Link className="btn btn-secondary" to="/diagnostic">
            <ScanFace size={18} />
            Faire mon diagnostic peau
          </Link>
        </div>
      </section>

      {/* ── Grille des routines ── */}
      <section className="section-pad routines-grid-section">
        <div className="routines-cards-grid">
          {routinesList.map((routine) => (
            <Link
              key={routine.slug}
              className="routine-visual-card"
              to={`/routines/${routine.slug}`}
              aria-label={`Voir la ${routine.title}`}
              style={{ "--routine-accent": routine.accent }}
            >
              {/* Image */}
              <div className="routine-card-media">
                <img
                  src={routine.image}
                  alt={routine.imageAlt}
                  loading="lazy"
                  onError={(e) => {
                    if (e.target.src !== window.location.origin + routine.imageFallback) {
                      e.target.src = routine.imageFallback;
                    }
                  }}
                />
                <div className="routine-card-overlay" />
              </div>

              {/* Contenu */}
              <div className="routine-card-body">
                {/* Tags */}
                <div className="routine-card-tags">
                  {routine.tags.map((tag) => (
                    <span key={tag} className="routine-card-tag">{tag}</span>
                  ))}
                </div>

                <div className="routine-card-text">
                  <h2>{routine.title}</h2>
                  <p>{routine.tagline}</p>
                </div>

                <span className="routine-card-cta">
                  Voir la routine
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA diagnostic ── */}
      <section className="routines-cta-section section-pad">
        <div className="routines-cta-inner">
          <div>
            <p className="eyebrow">Tu hésites ?</p>
            <h2>Laisse le diagnostic choisir pour toi.</h2>
            <p>4 questions pour identifier ton profil peau et recevoir la routine la plus adaptée.</p>
          </div>
          <Link className="btn btn-primary" to="/diagnostic">
            <ScanFace size={18} />
            Commencer le diagnostic
          </Link>
        </div>
      </section>
    </>
  );
}
