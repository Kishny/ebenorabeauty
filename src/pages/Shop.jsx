// src/pages/Shop.jsx
// Page boutique premium — hero, filtres, spotlight, grille, vidéos, avis, trust bar.

import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, ChevronLeft, ChevronRight,
  Play, RotateCcw, ScanFace, ShoppingBag, Star,
  Truck, Leaf, RefreshCw, ShieldCheck,
} from "lucide-react";
import { products } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";

// ─── Données statiques ────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Tous", slug: null },
  { label: "Soins visage", slug: "soins-visage" },
  { label: "Protection solaire", slug: "protection-solaire" },
  { label: "Corps", slug: "corps" },
  { label: "Maquillage", slug: "maquillage" },
  { label: "Cheveux", slug: "cheveux" },
  { label: "Compléments", slug: "complements" },
  { label: "Acné & imperfections", slug: "acne-imperfections" },
  { label: "Pilosité", slug: "pilosite" },
];

const SORT_OPTIONS = [
  { label: "Populaires", value: "popular" },
  { label: "Prix croissant", value: "price-asc" },
  { label: "Prix décroissant", value: "price-desc" },
  { label: "Mieux notés", value: "rating" },
];

const REVIEWS = [
  {
    name: "Amara D.",
    skin: "Peau grasse et acnéique",
    text: "Le Gel Matifiant a changé ma routine. Plus de brillance à 14h, et mes pores sont moins visibles. Je recommande à toutes les peaux mélaninées.",
    rating: 5,
    product: "Gel Matifiant Sébum Control",
    avatar: "/images/models/model-dark-skin-closeup.png",
  },
  {
    name: "Inès K.",
    skin: "Peau sèche et terne",
    text: "Le Sérum Éclat Ébène est incroyable. Ma peau est lumineuse sans être grasse, et ma carnation a vraiment gagné en éclat en 3 semaines.",
    rating: 5,
    product: "Sérum Éclat Ébène",
    avatar: "/images/home/hero-home-mobile.png",
  },
  {
    name: "Fatou M.",
    skin: "Peau sensible et réactive",
    text: "Enfin une crème qui ne me donne pas de rougeurs ! La Sensitive Melanin est douce, apaisante, et sent très bon. Ma peau adore.",
    rating: 5,
    product: "Crème Sensitive Melanin",
    avatar: "/images/home/hero-home-ebenora.png",
  },
];

const VIDEOS = [
  {
    title: "Application du Sérum Éclat Ébène",
    subtitle: "Technique de massage 60 secondes",
    duration: "1 min",
    thumb: "/images/products/serum-eclat-ebene-card.png",
    // → remplace par une URL YouTube : "https://www.youtube.com/embed/XXXX"
    // → ou un fichier local : "/videos/serum-demo.mp4"
    url: null,
  },
  {
    title: "Routine complète peau grasse",
    subtitle: "Matin en 4 étapes avec le Gel Matifiant",
    duration: "2 min",
    thumb: "/images/products/gel-matifiant-sebum-control-card.png",
    url: null,
  },
  {
    title: "Glow Corps — Huile Nude Glow",
    subtitle: "Application et résultat sur peau ébène",
    duration: "1 min 30",
    thumb: "/images/categories/product-category-corps-glow.png",
    url: null,
  },
];

// ─── Sous-composants ──────────────────────────────────────────────────────────

function StarRow({ rating, count }) {
  return (
    <div className="shop-star-row">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={13}
          className={n <= Math.round(rating) ? "star-filled" : "star-empty"}
        />
      ))}
      <span className="shop-review-count">({count})</span>
    </div>
  );
}

function ProductShopCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e) {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const hasImage = product.image && !product.image.includes("-card.png")
    ? true
    : !!product.image;

  return (
    <article className="shop-product-card" style={{ "--accent": product.accent }}>
      {/* Image / visuel */}
      <Link to={`/produit/${product.slug}`} className="shop-card-media" tabIndex={-1}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
        ) : null}
        {/* Fallback bottle CSS si pas d'image */}
        <div
          className="shop-card-bottle-fallback"
          style={{ display: product.image ? "none" : "flex" }}
          aria-hidden="true"
        >
          <div className="bottle" />
        </div>

        {product.badge && (
          <span className="shop-card-badge">{product.badge}</span>
        )}

        <div className="shop-card-hover-overlay">
          <span>Voir le produit</span>
          <ArrowRight size={15} />
        </div>
      </Link>

      {/* Infos */}
      <div className="shop-card-body">
        <p className="shop-card-category">{product.category}</p>
        <Link to={`/produit/${product.slug}`} className="shop-card-name">
          <h3>{product.name}</h3>
        </Link>
        <p className="shop-card-desc">{product.description}</p>

        <StarRow rating={product.rating} count={product.reviewCount} />

        <div className="shop-card-bottom">
          <strong className="shop-card-price">{product.price.toFixed(2)} €</strong>
          <button
            type="button"
            className={`shop-card-add ${added ? "is-added" : ""}`}
            onClick={handleAdd}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            {added
              ? <><CheckCircle2 size={16} /> Ajouté</>
              : <><ShoppingBag size={16} /> Ajouter</>
            }
          </button>
        </div>
      </div>
    </article>
  );
}

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);

  if (playing && video.url) {
    const isYoutube = video.url.includes("youtube") || video.url.includes("youtu.be");
    return (
      <div className="shop-video-card shop-video-card--playing">
        {isYoutube ? (
          <iframe
            src={video.url + "?autoplay=1"}
            allow="autoplay; fullscreen"
            allowFullScreen
            title={video.title}
            className="shop-video-iframe"
          />
        ) : (
          <video src={video.url} autoPlay controls className="shop-video-player" />
        )}
      </div>
    );
  }

  return (
    <div className="shop-video-card">
      <div className="shop-video-thumb">
        {video.thumb && (
          <img src={video.thumb} alt={video.title} loading="lazy" />
        )}
        <div className="shop-video-scrim" />
        <button
          type="button"
          className="shop-video-play"
          onClick={() => video.url ? setPlaying(true) : null}
          aria-label={`Lire : ${video.title}`}
          style={{ cursor: video.url ? "pointer" : "default" }}
        >
          <Play size={22} fill="currentColor" />
        </button>
        <span className="shop-video-duration">{video.duration}</span>
        {!video.url && (
          <span className="shop-video-coming">Bientôt disponible</span>
        )}
      </div>
      <div className="shop-video-meta">
        <h3>{video.title}</h3>
        <p>{video.subtitle}</p>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

const PER_PAGE_OPTIONS = [6, 10, 20];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortBy, setSortBy] = useState("popular");
  const [perPage, setPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [reviewIdx, setReviewIdx] = useState(0);
  const gridRef = useRef(null);

  // Filtrage
  let filtered = activeCategory
    ? products.filter((p) => p.categorySlug === activeCategory)
    : [...products];

  // Tri
  if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
  else filtered.sort((a, b) => b.reviewCount - a.reviewCount);

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function goToPage(n) {
    setPage(n);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleCategoryChange(slug) {
    setActiveCategory(slug);
    setPage(1);
  }

  function handlePerPageChange(n) {
    setPerPage(n);
    setPage(1);
  }

  const featured = products.find((p) => p.isFeatured);
  const { addToCart } = useCart();
  const [featuredAdded, setFeaturedAdded] = useState(false);

  function handleFeaturedAdd() {
    if (!featured) return;
    addToCart(featured);
    setFeaturedAdded(true);
    setTimeout(() => setFeaturedAdded(false), 2000);
  }

  return (
    <div className="shop-page">

      {/* ══════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════ */}
      <section className="shop-hero section-pad">
        <div className="shop-hero-inner">
          <div className="shop-hero-content">
            <div className="shop-hero-kicker">
              <span className="shop-hero-dot" />
              <span>Nouvelle collection</span>
            </div>
            <h1>
              La beauté mélaninée,<br />
              <em>sans compromis.</em>
            </h1>
            <p>
              Chaque soin Ebenora est pensé pour les carnations noires, brunes et ébènes —
              leurs besoins réels, leurs problématiques spécifiques, leur éclat naturel.
            </p>
            <div className="shop-hero-actions">
              <a className="btn btn-primary" href="#produits">
                <ShoppingBag size={18} />
                Explorer la boutique
              </a>
              <Link className="btn btn-ghost" to="/diagnostic">
                <ScanFace size={18} />
                Trouver mon soin
              </Link>
            </div>
            <div className="shop-hero-stats">
              <div><strong>6</strong><span>soins exclusifs</span></div>
              <div className="shop-stat-sep" />
              <div><strong>4.7★</strong><span>note moyenne</span></div>
              <div className="shop-stat-sep" />
              <div><strong>700+</strong><span>avis vérifiés</span></div>
            </div>
          </div>

          <div className="shop-hero-visual">
            <div className="shop-hero-img-wrap">
              <img
                src="/images/app/product-grid-packshot.png"
                alt="Gamme de soins Ebenora Beauty"
                className="shop-hero-img"
                onError={(e) => { e.target.src = "/images/home/hero-product.png"; }}
              />
            </div>
            {/* Floating cards */}
            <div className="shop-float shop-float--tl">
              <Star size={14} fill="currentColor" />
              <span>4.8 · 214 avis</span>
            </div>
            <div className="shop-float shop-float--br">
              <CheckCircle2 size={14} />
              <span>Livraison offerte dès 50 €</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. TRUST BAR
      ══════════════════════════════════════════════════ */}
      <div className="shop-trust-bar">
        {[
          { icon: Truck,       text: "Livraison offerte dès 50 €" },
          { icon: RefreshCw,   text: "Retours gratuits 30 jours" },
          { icon: Leaf,        text: "Formules sans perturbateurs" },
          { icon: ShieldCheck, text: "Paiement 100 % sécurisé" },
        ].map(({ icon: Icon, text }) => (
          <div className="shop-trust-item" key={text}>
            <Icon size={18} />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          3. SPOTLIGHT BESTSELLER
      ══════════════════════════════════════════════════ */}
      {featured && (
        <section className="shop-spotlight section-pad">
          <div className="shop-spotlight-inner" style={{ "--accent": featured.accent }}>
            <div className="shop-spotlight-media">
              <img
                src={featured.image}
                alt={featured.name}
                onError={(e) => { e.target.style.opacity = "0"; }}
              />
              <div className="shop-spotlight-bottle-bg">
                <div className="bottle" aria-hidden="true" />
              </div>
              <span className="shop-spotlight-badge">
                <Star size={13} fill="currentColor" /> {featured.badge}
              </span>
            </div>

            <div className="shop-spotlight-content">
              <div className="shop-spotlight-kicker">
                <span>Produit phare</span>
              </div>
              <h2>{featured.name}</h2>
              <p className="shop-spotlight-concern">{featured.concern}</p>
              <p>{featured.description}</p>

              <StarRow rating={featured.rating} count={featured.reviewCount} />

              <div className="shop-spotlight-skin-types">
                {featured.skinTypes.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <div className="shop-spotlight-bottom">
                <div className="shop-spotlight-price">
                  <strong>{featured.price.toFixed(2)} €</strong>
                  <span>TTC · Livraison offerte</span>
                </div>
                <div className="shop-spotlight-actions">
                  <button
                    type="button"
                    className={`btn btn-primary ${featuredAdded ? "is-added" : ""}`}
                    onClick={handleFeaturedAdd}
                  >
                    {featuredAdded
                      ? <><CheckCircle2 size={18} /> Ajouté au panier</>
                      : <><ShoppingBag size={18} /> Ajouter au panier</>
                    }
                  </button>
                  <Link className="btn btn-secondary" to={`/produit/${featured.slug}`}>
                    Voir le détail
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          4. FILTRES + GRILLE PRODUITS
      ══════════════════════════════════════════════════ */}
      <section className="section-pad shop-catalog" id="produits" ref={gridRef}>
        {/* En-tête catalogue */}
        <div className="shop-catalog-head">
          <div>
            <p className="eyebrow">Boutique</p>
            <h2>Tous les soins.</h2>
          </div>
          <div className="shop-catalog-controls">
            <select
              className="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Trier les produits"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtres catégories */}
        <div className="shop-filters" role="group" aria-label="Filtrer par catégorie">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug ?? "all"}
              type="button"
              className={`shop-filter-pill ${activeCategory === cat.slug ? "is-active" : ""}`}
              onClick={() => handleCategoryChange(cat.slug)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Barre résultats + sélecteur par page */}
        <div className="shop-result-bar">
          <p className="shop-result-count">
            {filtered.length} produit{filtered.length > 1 ? "s" : ""}
            {activeCategory ? ` · ${CATEGORIES.find(c => c.slug === activeCategory)?.label}` : ""}
          </p>
          <div className="shop-per-page">
            <span>Afficher :</span>
            {PER_PAGE_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                className={`shop-per-page-btn${perPage === n ? " is-active" : ""}`}
                onClick={() => handlePerPageChange(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Grille */}
        {paginated.length > 0 ? (
          <div className="shop-products-grid">
            {paginated.map((product) => (
              <ProductShopCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="shop-empty">
            <RotateCcw size={32} />
            <p>Aucun produit dans cette catégorie pour l'instant.</p>
            <button type="button" className="btn btn-secondary" onClick={() => handleCategoryChange(null)}>
              Voir tous les produits
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="shop-pagination" aria-label="Pagination">
            <button
              type="button"
              className="shop-page-btn shop-page-prev"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              aria-label="Page précédente"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="shop-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                // Affiche toujours : 1, dernière, page courante ±1
                const show = n === 1 || n === totalPages || Math.abs(n - page) <= 1;
                const showEllipsisBefore = n === page - 2 && page > 3;
                const showEllipsisAfter  = n === page + 2 && page < totalPages - 2;
                if (!show && !showEllipsisBefore && !showEllipsisAfter) return null;
                if (showEllipsisBefore || showEllipsisAfter) {
                  return <span key={`ellipsis-${n}`} className="shop-page-ellipsis">…</span>;
                }
                return (
                  <button
                    key={n}
                    type="button"
                    className={`shop-page-btn${page === n ? " is-current" : ""}`}
                    onClick={() => goToPage(n)}
                    aria-label={`Page ${n}`}
                    aria-current={page === n ? "page" : undefined}
                  >
                    {n}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="shop-page-btn shop-page-next"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              aria-label="Page suivante"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </section>

      {/* ══════════════════════════════════════════════════
          5. SECTION VIDÉOS DÉMO
      ══════════════════════════════════════════════════ */}
      <section className="shop-videos-section section-pad">
        <div className="shop-videos-head">
          <div>
            <p className="eyebrow">En pratique</p>
            <h2>Vois les soins en action.</h2>
            <p>
              Techniques d'application, résultats sur carnations foncées, routines
              complètes — tout ce qu'il faut pour utiliser chaque soin correctement.
            </p>
          </div>
          <Link className="btn btn-secondary" to="/routines">
            Voir les routines
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="shop-videos-grid">
          {VIDEOS.map((v) => (
            <VideoCard key={v.title} video={v} />
          ))}
        </div>

        <p className="shop-videos-note">
          → Pour ajouter tes vraies vidéos, renseigne le champ <code>videoUrl</code> dans
          &nbsp;<code>src/data/products.js</code> avec une URL YouTube embed ou un fichier MP4 local.
        </p>
      </section>

      {/* ══════════════════════════════════════════════════
          6. AVIS CLIENTS
      ══════════════════════════════════════════════════ */}
      <section className="shop-reviews-section section-pad">
        <div className="shop-reviews-head">
          <div>
            <p className="eyebrow">Témoignages</p>
            <h2>Ce qu'elles en disent.</h2>
          </div>
          <div className="shop-reviews-score">
            <strong>4.7</strong>
            <div>
              <StarRow rating={4.7} count={700} />
              <span>Note globale · 700+ avis vérifiés</span>
            </div>
          </div>
        </div>

        <div className="shop-reviews-slider">
          {REVIEWS.map((r, i) => (
            <article
              key={r.name}
              className={`shop-review-card ${i === reviewIdx ? "is-active" : ""}`}
              aria-hidden={i !== reviewIdx}
            >
              <div className="shop-review-top">
                <div className="shop-review-avatar">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.skin}</span>
                </div>
                <StarRow rating={r.rating} count={null} />
              </div>
              <blockquote>"{r.text}"</blockquote>
              <p className="shop-review-product">
                <CheckCircle2 size={13} /> Achat vérifié · {r.product}
              </p>
            </article>
          ))}
        </div>

        {/* Dots navigation */}
        <div className="shop-reviews-nav">
          <button
            type="button"
            className="shop-reviews-arrow"
            onClick={() => setReviewIdx((reviewIdx - 1 + REVIEWS.length) % REVIEWS.length)}
            aria-label="Avis précédent"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="shop-reviews-dots">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`shop-dot ${i === reviewIdx ? "is-active" : ""}`}
                onClick={() => setReviewIdx(i)}
                aria-label={`Avis ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="shop-reviews-arrow"
            onClick={() => setReviewIdx((reviewIdx + 1) % REVIEWS.length)}
            aria-label="Avis suivant"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. BANDEAU DIAGNOSTIC
      ══════════════════════════════════════════════════ */}
      <section className="shop-diag-banner section-pad">
        <div className="shop-diag-inner">
          <div className="shop-diag-icon">
            <ScanFace size={28} />
          </div>
          <div>
            <h2>Tu ne sais pas quel soin choisir ?</h2>
            <p>Le diagnostic Ebenora identifie ton type de peau et te recommande les produits les plus adaptés en 4 questions.</p>
          </div>
          <Link className="btn btn-primary" to="/diagnostic">
            Faire mon diagnostic
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
