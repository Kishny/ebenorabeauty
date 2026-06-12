// src/pages/RoutineDetail.jsx
// Page détail d'une routine — hero, conseil, matin/soir, ingrédients, produits.

import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle2, FlaskConical,
  Lightbulb, Moon, ShoppingBag, Sun,
} from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";
import { routinesData } from "../data/routinesData.js";
import { products } from "../data/products.js";

export default function RoutineDetail() {
  const { slug } = useParams();
  const routine = routinesData[slug];

  if (!routine) {
    return (
      <section className="section-pad not-found">
        <p className="eyebrow">Erreur</p>
        <h1>Routine introuvable.</h1>
        <Link className="btn btn-primary" to="/routines">
          <ArrowLeft size={18} />
          Retour aux routines
        </Link>
      </section>
    );
  }

  const recommendedProducts = (routine.produitsSlugs || [])
    .map((s) => products.find((p) => p.slug === s))
    .filter(Boolean);

  return (
    <div className="routine-detail-page" style={{ "--routine-accent": routine.accent }}>

      {/* ── Hero ── */}
      <section className="routine-detail-hero section-pad">
        <div className="routine-detail-hero-inner">
          <div className="routine-detail-hero-content">
            <Link className="routine-back-link" to="/routines">
              <ArrowLeft size={16} />
              Toutes les routines
            </Link>

            <p className="eyebrow">Routine ciblée</p>
            <h1>{routine.title}</h1>
            <p className="routine-detail-tagline">{routine.tagline}</p>

            <div className="routine-detail-tags">
              {routine.tags.map((tag) => (
                <span key={tag} className="routine-detail-tag">{tag}</span>
              ))}
            </div>

            <div className="routine-detail-hero-actions">
              <a className="btn btn-primary" href="#routine-steps">
                Voir les étapes
                <ArrowRight size={18} />
              </a>
              <Link className="btn btn-secondary" to="/diagnostic">
                Refaire mon diagnostic
              </Link>
            </div>
          </div>

          <div className="routine-detail-hero-visual">
            <img
              src={routine.image}
              alt={routine.imageAlt}
              className="routine-detail-hero-img"
              onError={(e) => {
                if (e.target.src !== window.location.origin + routine.imageFallback) {
                  e.target.src = routine.imageFallback;
                }
              }}
            />
            <div className="routine-detail-hero-badge">
              <CheckCircle2 size={17} />
              <span>Routine adaptée à ton profil</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Conseil d'expert ── */}
      <section className="routine-conseil-section section-pad">
        <div className="routine-conseil-inner">
          <div className="routine-conseil-icon">
            <Lightbulb size={22} />
          </div>
          <div>
            <p className="eyebrow">Conseil Ebenora</p>
            <p className="routine-conseil-text">{routine.conseil}</p>
          </div>
        </div>
      </section>

      {/* ── Étapes matin / soir ── */}
      <section className="routine-steps-section section-pad" id="routine-steps">
        <div className="routine-steps-head">
          <p className="eyebrow">Les gestes</p>
          <h2>Ta routine quotidienne.</h2>
          <p>Applique ces étapes dans l'ordre pour maximiser l'efficacité de chaque soin.</p>
        </div>

        <div className="routine-steps-grid">
          {/* Matin */}
          <div className="routine-steps-col">
            <div className="routine-steps-col-header">
              <div className="routine-steps-col-icon">
                <Sun size={20} />
              </div>
              <div>
                <h3>Matin</h3>
                <span>Prépare et protège</span>
              </div>
            </div>

            <ol className="routine-steps-list">
              {routine.matin.map((step, i) => (
                <li key={i} className="routine-step-item">
                  <div className="routine-step-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="routine-step-content">
                    <p>{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Soir */}
          <div className="routine-steps-col">
            <div className="routine-steps-col-header">
              <div className="routine-steps-col-icon routine-steps-col-icon--soir">
                <Moon size={20} />
              </div>
              <div>
                <h3>Soir</h3>
                <span>Répare et régénère</span>
              </div>
            </div>

            <ol className="routine-steps-list">
              {routine.soir.map((step, i) => (
                <li key={i} className="routine-step-item">
                  <div className="routine-step-num routine-step-num--soir">{String(i + 1).padStart(2, "0")}</div>
                  <div className="routine-step-content">
                    <p>{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Ingrédients clés ── */}
      <section className="routine-ingredients-section section-pad">
        <div className="routine-ingredients-inner">
          <div className="routine-ingredients-head">
            <FlaskConical size={22} />
            <div>
              <p className="eyebrow">Formules</p>
              <h2>Les actifs à rechercher.</h2>
              <p>Ces ingrédients sont particulièrement adaptés à ton profil. Vérifie leur présence sur les étiquettes.</p>
            </div>
          </div>

          <div className="routine-ingredients-grid">
            {routine.ingredients.map((ing, i) => (
              <div key={ing} className="routine-ingredient-pill">
                <span className="ing-num">{String(i + 1).padStart(2, "0")}</span>
                <strong>{ing}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produits recommandés ── */}
      {recommendedProducts.length > 0 && (
        <section className="routine-products-section section-pad">
          <div className="routine-products-head">
            <p className="eyebrow">Sélection</p>
            <h2>Produits adaptés à cette routine.</h2>
            <p>Formulés spécifiquement pour accompagner les peaux mélaninées avec ce profil.</p>
          </div>

          <div className="products-grid">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="routine-products-footer">
            <Link className="btn btn-secondary" to="/boutique">
              <ShoppingBag size={17} />
              Voir toute la boutique
            </Link>
          </div>
        </section>
      )}

      {/* ── Navigation entre routines ── */}
      <section className="routine-nav-section section-pad">
        <div className="routine-nav-inner">
          <p className="eyebrow">Explorer</p>
          <h2>D'autres routines.</h2>
          <div className="routine-nav-links">
            {Object.values(routinesData)
              .filter((r) => r.slug !== slug)
              .slice(0, 3)
              .map((r) => (
                <Link
                  key={r.slug}
                  className="routine-nav-card"
                  to={`/routines/${r.slug}`}
                  style={{ "--routine-accent": r.accent }}
                >
                  <div className="routine-nav-card-img">
                    <img
                      src={r.image}
                      alt={r.imageAlt}
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src !== window.location.origin + r.imageFallback) {
                          e.target.src = r.imageFallback;
                        }
                      }}
                    />
                  </div>
                  <div className="routine-nav-card-body">
                    <h3>{r.title}</h3>
                    <span>
                      Voir <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
}
