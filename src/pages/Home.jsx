// src/pages/Home.jsx
// Page d'accueil premium mobile-first — refonte complète.
// Sections : Hero · Trust · Catégories · Diagnostic · Vidéo · Produits · Témoignages

import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Pause,
  Play,
  Quote,
  ScanFace,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { products } from "../data/products.js";

/* ── Témoignages ── */
const REVIEWS = [
  {
    name: "Nadia B.",
    location: "Paris",
    skin: "Peau mixte",
    rating: 5,
    text: "Le sérum Éclat Ébène a transformé ma peau en 3 semaines. J'avais l'habitude de maquiller mon teint terne — maintenant je sors sans fond de teint.",
    photo: "https://images.pexels.com/photos/9516034/pexels-photo-9516034.jpeg?auto=compress&cs=tinysrgb&w=80",
  },
  {
    name: "Fatou D.",
    location: "Lyon",
    skin: "Peau grasse",
    rating: 5,
    text: "Enfin un gel matifiant qui ne dessèche pas ma peau. J'en avais essayé des dizaines. Le Sébum Control est le seul qui gère vraiment la brillance sans effet carton.",
    photo: "https://images.pexels.com/photos/33170458/pexels-photo-33170458.jpeg?auto=compress&cs=tinysrgb&w=80",
  },
  {
    name: "Amara S.",
    location: "Bordeaux",
    skin: "Peau sensible",
    rating: 5,
    text: "Le diagnostic m'a orientée vers la Crème Sensitive Melanin. Mes rougeurs ont diminué en quelques jours. Je recommande Ebenora à toutes mes amies.",
    photo: "https://images.pexels.com/photos/18920899/pexels-photo-18920899.jpeg?auto=compress&cs=tinysrgb&w=80",
  },
  {
    name: "Kemi O.",
    location: "Marseille",
    skin: "Peau déshydratée",
    rating: 5,
    text: "Un site pensé pour nous, c'est rare. Les routines sont hyper précises et les produits correspondent vraiment aux besoins des peaux mélaninées.",
    photo: "https://images.pexels.com/photos/9862639/pexels-photo-9862639.jpeg?auto=compress&cs=tinysrgb&w=80",
  },
];

/* ── Confiance ── */
const TRUST = [
  { icon: ShieldCheck, title: "Formulé pour nous", text: "Chaque soin est conçu pour les spécificités des peaux noires, brunes et ébènes." },
  { icon: Droplets,   title: "Actifs ciblés",    text: "Niacinamide, céramides, acide hyaluronique — des ingrédients qui répondent aux vrais besoins." },
  { icon: Star,       title: "4,8 / 5 en moyenne", text: "Plus de 770 avis clients vérifiés sur l'ensemble des produits Ebenora." },
];

/* ── Catégories ── */
const CATEGORIES = [
  { title: "Acné & marques",    sub: "01", text: "Apaiser, unifier et accompagner les marques post-acné.", path: "/routines/acne-imperfections", img: "/images/categories/product-category-acne-marques.png" },
  { title: "Sébum & brillance", sub: "02", text: "Matifier sans décaper les peaux mixtes à grasses.",       path: "/routines/peau-grasse",         img: "/images/categories/product-category-sebum-brillance-v2.png" },
  { title: "Corps & glow",      sub: "03", text: "Nourrir, illuminer et sublimer la peau du corps.",         path: "/boutique",                     img: "/images/categories/product-category-corps-glow.png" },
];

/* ── Composant étoiles ── */
function Stars({ n }) {
  return (
    <div className="home-stars" aria-label={`${n} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill={i < n ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </div>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const [added, setAdded]         = useState({});
  const [reviewIdx, setReviewIdx] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  function toggleVideo() {
    if (!videoRef.current) return;
    if (videoPlaying) {
      videoRef.current.pause();
      setVideoPlaying(false);
    } else {
      videoRef.current.play();
      setVideoPlaying(true);
    }
  }

  // 3 produits vedettes depuis les données
  const featured = products.filter((p) => p.isFeatured).concat(products.filter((p) => !p.isFeatured)).slice(0, 3);
  const [main, ...side] = featured;

  function handleAdd(product) {
    addToCart(product);
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [product.id]: false })), 1800);
  }

  const prevReview = () => setReviewIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const nextReview = () => setReviewIdx((i) => (i + 1) % REVIEWS.length);

  return (
    <>
      {/* =========================================================
          1. HERO
      ========================================================= */}
      <section className="home-hero section-pad">
        <div className="home-hero-content">
          <div className="hero-pill">
            <Sparkles size={15} />
            <span>Beauté mélaninée premium</span>
          </div>

          <p className="eyebrow">Ebenora Beauty</p>
          <h1>L'éclat des peaux ébènes, révélé.</h1>
          <p className="hero-text">
            Des soins pensés pour les femmes noires, brunes et ébènes — avec des routines
            adaptées à chaque carnation, chaque besoin, chaque journée.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/boutique">
              <ShoppingBag size={17} />
              Découvrir la boutique
            </Link>
            <Link className="btn btn-secondary" to="/diagnostic">
              <ScanFace size={17} />
              Faire mon diagnostic
            </Link>
          </div>

          <div className="home-hero-proof">
            <span><strong>40+</strong> nuances étudiées</span>
            <span><strong>8</strong> routines ciblées</span>
            <span><strong>1 min</strong> diagnostic</span>
          </div>
        </div>

        <div className="home-hero-showcase">
          <picture className="home-hero-picture">
            <source srcSet="/images/home/hero-home-ebenora.png" media="(min-width: 900px)" />
            <img
              src="/images/home/hero-home-mobile.png"
              alt="Femme noire à la peau lumineuse — Ebenora Beauty"
              loading="eager"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </picture>

          {/* Fallback visuel si pas d'image */}
          <div className="home-hero-fallback" aria-hidden="true">
            <div className="home-hero-blob" />
          </div>

          <div className="floating-review">
            <Star size={14} fill="currentColor" />
            <span>Glow visible, routine simple</span>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. CONFIANCE
      ========================================================= */}
      <section className="home-trust section-pad">
        {TRUST.map(({ icon: Icon, title, text }) => (
          <article className="trust-item" key={title}>
            <Icon size={22} />
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>

      {/* =========================================================
          3. CATÉGORIES
      ========================================================= */}
      <section className="home-categories section-pad-sm">
        <div className="home-cat-header">
          <p className="eyebrow">Boutique</p>
          <h2>Choisis selon ton besoin.</h2>
          <Link className="btn btn-ghost home-cat-cta" to="/boutique">
            Toute la boutique <ArrowRight size={15} />
          </Link>
        </div>

        <div className="home-cat-row">
          {[
            { title: "Soins visage",      path: "/boutique",                     img: "/images/categories/product-category-soins-visage.png",           tag: "Essentiel" },
            { title: "Acné & marques",    path: "/routines/acne-imperfections",   img: "/images/categories/product-category-acne-marques.png",            tag: "Ciblé" },
            { title: "Sébum & brillance", path: "/routines/peau-grasse",          img: "/images/categories/product-category-sebum-brillance-v2.png",      tag: "Matifiant" },
            { title: "Corps & glow",      path: "/boutique",                     img: "/images/categories/product-category-corps-glow.png",              tag: "Lumineux" },
          ].map(({ title, path, img, tag }) => (
            <Link className="home-cat-card" to={path} key={title}>
              <img src={img} alt={title} loading="lazy" />
              <div className="home-cat-card-info">
                <span className="home-cat-tag">{tag}</span>
                <strong>{title}</strong>
                <ArrowRight size={14} className="home-cat-arrow" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================
          4. DIAGNOSTIC
      ========================================================= */}
      <section className="home-diagnostic section-pad">
        <div className="diagnostic-panel diagnostic-panel-premium">
          <div className="diagnostic-content">
            <div className="diagnostic-kicker">
              <ScanFace size={17} />
              <span>Diagnostic peau personnalisé</span>
            </div>
            <p className="eyebrow">Diagnostic peau</p>
            <h2>Comprends ta peau avant d'acheter.</h2>
            <p>
              En quelques réponses, Ebenora identifie ton type de peau, tes priorités
              et les soins les plus cohérents pour ta routine.
            </p>

            <div className="diagnostic-list diagnostic-list-premium">
              <span><CheckCircle2 size={16} /> Type de peau : grasse, mixte, sèche ou déshydratée</span>
              <span><CheckCircle2 size={16} /> Besoin prioritaire : acné, taches, brillance ou sensibilité</span>
              <span><CheckCircle2 size={16} /> Routine recommandée selon ton objectif</span>
            </div>

            <div className="diagnostic-actions">
              <Link className="btn btn-primary" to="/diagnostic">
                Commencer le diagnostic <ArrowRight size={17} />
              </Link>
              <span className="diagnostic-time">≈ 1 minute</span>
            </div>
          </div>

          <div className="diagnostic-steps">
            {[
              { n: "01", title: "Observe",  text: "Décris ta peau, ton confort et tes signes visibles." },
              { n: "02", title: "Analyse",  text: "Le parcours classe les besoins sans te noyer dans les choix." },
              { n: "03", title: "Routine",  text: "Tu obtiens une sélection claire de gestes et de soins." },
            ].map(({ n, title, text }) => (
              <article key={n}>
                <span>{n}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>

          <div className="diagnostic-visual-wrap">
            <div className="diagnostic-image-card">
              <img
                src="/images/home/diagnostic-app-preview.png"
                alt="Aperçu du diagnostic Ebenora"
                loading="lazy"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="diagnostic-img-fallback" aria-hidden="true" />
            </div>
            <div className="diagnostic-result-badge">
              <Sparkles size={15} />
              <span>Routine adaptée à ton profil</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. VIDÉO DÉMO
      ========================================================= */}
      <section className="home-video section-pad">
        <div className="home-video-inner">
          <div className="home-video-text">
            <p className="eyebrow">Ebenora en action</p>
            <h2>Découvre la routine en 60 secondes.</h2>
            <p>
              Comment on passe d'une peau terne à un éclat naturel — les gestes, les textures
              et les résultats expliqués simplement.
            </p>
            <Link className="btn btn-secondary" to="/boutique">
              Voir les produits <ArrowRight size={16} />
            </Link>
          </div>

          <div className="home-video-wrap">
            <video
              ref={videoRef}
              className="home-video-player"
              src="/images/demo/demo.mp4"
              loop
              playsInline
              muted
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              onEnded={() => setVideoPlaying(false)}
            />
            <button
              type="button"
              className={`home-video-btn${videoPlaying ? " playing" : ""}`}
              onClick={toggleVideo}
              aria-label={videoPlaying ? "Mettre en pause" : "Lancer la vidéo"}
            >
              {videoPlaying ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
            </button>
            <div className="home-video-badge">
              <Sparkles size={14} />
              <span>Résultats visibles en 3 semaines</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. PRODUITS VEDETTES
      ========================================================= */}
      <section className="home-products section-pad-sm">
        <div className="home-cat-header">
          <p className="eyebrow">Sélection premium</p>
          <h2>Les essentiels Ebenora.</h2>
          <Link className="btn btn-ghost home-cat-cta" to="/boutique">
            Voir toute la boutique <ArrowRight size={15} />
          </Link>
        </div>

        <div className="home-prod-row">
          {featured.map((p) => (
            <article key={p.id} className="home-prod-card" style={{ "--pd-accent": p.accent }}>
              <Link to={`/produit/${p.slug}`} className="home-prod-img-wrap">
                {p.badge && <span className="home-prod-badge">{p.badge}</span>}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => { e.target.style.opacity = "0"; }}
                />
              </Link>
              <div className="home-prod-body">
                <small className="home-prod-concern">{p.concern}</small>
                <Link to={`/produit/${p.slug}`} className="home-prod-name">{p.name}</Link>
                <div className="home-prod-rating">
                  <Stars n={Math.round(p.rating)} />
                  <span>{p.rating} ({p.reviewCount})</span>
                </div>
                <div className="home-prod-footer">
                  <strong>{p.price.toFixed(2)} €</strong>
                  <button
                    type="button"
                    className={`home-prod-add${added[p.id] ? " added" : ""}`}
                    onClick={() => handleAdd(p)}
                  >
                    {added[p.id] ? <><CheckCircle2 size={14} /> Ajouté</> : <><ShoppingBag size={14} /> Ajouter</>}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================
          6. TÉMOIGNAGES
      ========================================================= */}
      <section className="home-reviews section-pad">
        <div className="home-reviews-inner">
          <div className="home-reviews-head">
            <p className="eyebrow">Avis clients</p>
            <h2>Ce qu'elles en pensent.</h2>
            <p>Plus de 770 avis vérifiés — des vraies femmes, des vraies peaux mélaninées.</p>
          </div>

          {/* Slider desktop : 2 avis visibles */}
          <div className="home-reviews-grid">
            {REVIEWS.map((r, i) => (
              <article className="home-review-card" key={i}>
                <Quote size={18} className="home-review-quote" />
                <Stars n={r.rating} />
                <p className="home-review-text">"{r.text}"</p>
                <div className="home-review-author">
                  <img
                    src={r.photo}
                    alt={r.name}
                    className="home-review-avatar"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div>
                    <strong>{r.name}</strong>
                    <span>{r.location} · {r.skin}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Slider mobile : 1 avis + navigation */}
          <div className="home-reviews-mobile">
            <article className="home-review-card">
              <Quote size={18} className="home-review-quote" />
              <Stars n={REVIEWS[reviewIdx].rating} />
              <p className="home-review-text">"{REVIEWS[reviewIdx].text}"</p>
              <div className="home-review-author">
                <img
                  src={REVIEWS[reviewIdx].photo}
                  alt={REVIEWS[reviewIdx].name}
                  className="home-review-avatar"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div>
                  <strong>{REVIEWS[reviewIdx].name}</strong>
                  <span>{REVIEWS[reviewIdx].location} · {REVIEWS[reviewIdx].skin}</span>
                </div>
              </div>
            </article>

            <div className="home-reviews-nav">
              <button type="button" onClick={prevReview} aria-label="Avis précédent">
                <ChevronLeft size={18} />
              </button>
              <div className="home-reviews-dots">
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`home-dot${i === reviewIdx ? " active" : ""}`}
                    onClick={() => setReviewIdx(i)}
                    aria-label={`Avis ${i + 1}`}
                  />
                ))}
              </div>
              <button type="button" onClick={nextReview} aria-label="Avis suivant">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. CTA FINAL
      ========================================================= */}
      <section className="home-final-cta section-pad">
        <div className="home-final-cta-inner">
          <div className="home-final-photos">
            {[9516034, 33170458, 21967036].map((id) => (
              <div className="home-final-photo" key={id}>
                <img
                  src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=200`}
                  alt="Femme noire à la peau lumineuse"
                  loading="lazy"
                  onError={(e) => { e.target.parentElement.style.background = "var(--color-surface)"; e.target.style.display = "none"; }}
                />
              </div>
            ))}
          </div>

          <div className="home-final-text">
            <p className="eyebrow">Prête à commencer ?</p>
            <h2>Ta peau mérite des soins qui lui ressemblent.</h2>
            <p>Explore la boutique ou fais ton diagnostic peau — en moins d'une minute.</p>
          </div>

          <div className="home-final-actions">
            <Link className="btn btn-primary" to="/boutique">
              <ShoppingBag size={17} />
              Voir la boutique
            </Link>
            <Link className="btn btn-secondary" to="/diagnostic">
              <ScanFace size={17} />
              Faire mon diagnostic
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
