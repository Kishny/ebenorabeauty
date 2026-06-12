// src/pages/ProductDetail.jsx
// Page détail produit — premium.

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { products } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";

/* ── Étoiles ── */
function StarRow({ rating }) {
  return (
    <span className="pd-stars" aria-label={`${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= Math.round(rating) ? "star-filled" : "star-empty"}
        />
      ))}
    </span>
  );
}

/* ── Données enrichies par produit ── */
const productExtras = {
  "serum-eclat-ebene": {
    images: [
      "/images/products/serum-eclat-ebene-card.png",
      "/images/products/serum-eclat-ebene.png",
      "/images/products/serum-eclat-ebene2.png",
    ],
    ingredients: ["Niacinamide", "Acide hyaluronique", "Vitamine C", "Beurre de karité", "Aloe vera"],
    usage: "Applique 2 à 3 gouttes sur le visage propre, matin et soir, avant la crème hydratante. Masser doucement en mouvements ascendants.",
    volume: "30 ml",
    reviews: [
      { name: "Amara T.", rating: 5, text: "Ma peau est vraiment plus lumineuse après 2 semaines. Texture légère, s'absorbe vite.", date: "Il y a 3 semaines" },
      { name: "Fatou D.", rating: 5, text: "Parfait pour ma peau déshydratée, pas d'effet grisâtre — enfin un sérum qui respecte mon teint !", date: "Il y a 1 mois" },
      { name: "Naomi K.", rating: 4, text: "Bonne texture, efficace. Je le recommande pour les peaux foncées sèches.", date: "Il y a 2 mois" },
    ],
  },
  "gel-matifiant-sebum-control": {
    images: [
      "/images/products/gel-matifiant-sebum-control-card.png",
      "/images/products/gel-matifiant.png",
    ],
    ingredients: ["Zinc PCA", "Niacinamide", "Acide salicylique", "Extrait de thé vert", "Glycérine"],
    usage: "Applique une noisette sur le visage propre, en insistant sur la zone T. Utiliser matin et/ou soir selon les besoins.",
    volume: "50 ml",
    reviews: [
      { name: "Chisom A.", rating: 5, text: "Mon teint est mat sans être asséché. Les pores sont moins visibles en 10 jours.", date: "Il y a 2 semaines" },
      { name: "Léa M.", rating: 4, text: "Efficace sur la brillance, je l'utilise juste le soir pour l'instant. Super résultat.", date: "Il y a 1 mois" },
      { name: "Djeneba S.", rating: 5, text: "Le seul gel matifiant qui n'a pas aggravé mes taches ! Formule douce et résultat visible.", date: "Il y a 6 semaines" },
    ],
  },
  "creme-apaisante-sensitive-melanin": {
    images: [
      "/images/products/creme-sensitive-melanin-card.png",
      "/images/products/creme-sensitive-melanin.png",
      "/images/products/creme-sensitive-melanin2.png",
    ],
    ingredients: ["Centella asiatica", "Bêta-glucane", "Panthénol", "Céramides", "Bisabolol"],
    usage: "Applique une noisette généreuse sur le visage propre, matin et soir. Peut être utilisée seule ou sur sérum.",
    volume: "40 ml",
    reviews: [
      { name: "Inès B.", rating: 5, text: "Fini les rougeurs après le démaquillage. Ma peau est apaisée en quelques jours.", date: "Il y a 1 semaine" },
      { name: "Aïcha O.", rating: 5, text: "Texture divine, enveloppante sans être lourde. Exactement ce qu'il me fallait.", date: "Il y a 3 semaines" },
      { name: "Sarah N.", rating: 4, text: "Très bonne crème, la barrière cutanée est clairement renforcée. Je recommande.", date: "Il y a 2 mois" },
    ],
  },
  "serum-pore-refine": {
    images: [
      "/images/products/serum-pore-refine.png",
      "/images/products/serum-pore-refine2.png",
    ],
    ingredients: ["Niacinamide 10 %", "Zinc PCA", "Acide salicylique BHA 0,5 %", "Extrait de thé vert"],
    usage: "Applique 3 à 4 gouttes sur peau propre, matin et soir, avant la crème. Éviter le contour des yeux.",
    volume: "30 ml",
    reviews: [
      { name: "Farida K.", rating: 5, text: "Mes pores sont beaucoup moins visibles au bout de 2 semaines. Top produit !", date: "Il y a 2 semaines" },
      { name: "Blessing O.", rating: 4, text: "Efficace sur le sébum, texture agréable, je recommande.", date: "Il y a 1 mois" },
    ],
  },
  "routine-anti-imperfections": {
    images: ["/images/products/duo-routine-anti-imperfections.png"],
    ingredients: ["Acide salicylique", "Niacinamide", "Zinc PCA", "Extrait de Centella", "Thé vert"],
    usage: "Gel nettoyant : matin et soir sur peau humide, rincer. Crème correctrice : après le nettoyage sur les zones à traiter.",
    volume: "150 ml + 50 ml",
    reviews: [
      { name: "Mariama T.", rating: 5, text: "Le duo fonctionne vraiment bien ensemble. Peau plus nette en 3 semaines.", date: "Il y a 3 semaines" },
      { name: "Koré N.", rating: 5, text: "Parfait pour les peaux sensibles acnéiques.", date: "Il y a 1 mois" },
    ],
  },
  "soin-pilosite-douceur-visage": {
    images: ["/images/products/exclisif-soin-douceur-pilosite.png"],
    ingredients: ["Actifs d'origine naturelle", "Acide glycolique", "Centella asiatica", "Aloe vera"],
    usage: "Applique sur les zones concernées après le nettoyage, matin et soir. Masser doucement jusqu'à absorption complète.",
    volume: "100 ml",
    reviews: [
      { name: "Astou D.", rating: 5, text: "Moins de poils incarnés et peau beaucoup plus douce !", date: "Il y a 2 semaines" },
      { name: "Nora F.", rating: 4, text: "Efficace et douce. Idéal après épilation.", date: "Il y a 1 mois" },
    ],
  },
};

const defaultExtra = {
  images: [],
  ingredients: ["Niacinamide", "Acide hyaluronique", "Beurre de karité", "Panthénol"],
  usage: "Applique sur peau propre selon les indications du soin. Pour un résultat optimal, respecter la régularité d'application.",
  volume: "50 ml",
  reviews: [
    { name: "Amara T.", rating: 5, text: "Produit de qualité, correspond exactement à ce dont j'avais besoin.", date: "Il y a 1 mois" },
    { name: "Sonia K.", rating: 4, text: "Très bonne formule, efficace et douce pour les peaux mélaninées.", date: "Il y a 6 semaines" },
  ],
};

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return (
      <section className="section-pad pd-not-found">
        <p className="eyebrow">Erreur</p>
        <h1>Produit introuvable.</h1>
        <Link className="btn btn-primary" to="/boutique">
          <ArrowLeft size={18} />
          Retour à la boutique
        </Link>
      </section>
    );
  }

  const extra = productExtras[slug] || defaultExtra;
  // Priorité : extra.images (données dures) > product.images (données produit) > fallback
  const images = extra.images?.length
    ? extra.images
    : product.images?.length
    ? product.images
    : [product.image, product.image, product.image];

  const related = products.filter((p) => p.slug !== slug).slice(0, 3);

  const reviews = extra.reviews || defaultExtra.reviews;
  const totalReviewPages = reviews.length;

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="pd-page" style={{ "--pd-accent": product.accent }}>

      {/* ── Breadcrumb ── */}
      <div className="pd-breadcrumb">
        <Link to="/boutique" className="pd-back">
          <ArrowLeft size={15} />
          Boutique
        </Link>
        <span className="pd-breadcrumb-sep">/</span>
        <span>{product.category}</span>
        <span className="pd-breadcrumb-sep">/</span>
        <span className="pd-breadcrumb-current">{product.name}</span>
      </div>

      {/* ── Hero produit ── */}
      <section className="pd-hero section-pad">
        <div className="pd-hero-inner">

          {/* Galerie */}
          <div className="pd-gallery">
            <div className="pd-gallery-main">
              {product.badge && (
                <span className="pd-gallery-badge">{product.badge}</span>
              )}
              <img
                src={images[activeImg]}
                alt={product.name}
                className="pd-gallery-img"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling && (e.target.nextSibling.style.display = "flex");
                }}
              />
              <div
                className="pd-gallery-fallback"
                style={{ display: "none", "--accent": product.accent }}
                aria-hidden="true"
              >
                <div className="bottle" />
              </div>
            </div>
            <div className="pd-gallery-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb${i === activeImg ? " is-active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Infos */}
          <div className="pd-info">
            <div className="pd-info-top">
              <p className="eyebrow">{product.category}</p>
              {product.badge && (
                <span className="pd-info-badge">{product.badge}</span>
              )}
            </div>

            <h1 className="pd-info-name">{product.name}</h1>

            <div className="pd-info-rating">
              <StarRow rating={product.rating} />
              <span className="pd-rating-value">{product.rating}</span>
              <span className="pd-rating-count">({product.reviewCount} avis)</span>
            </div>

            <p className="pd-info-desc">{product.description}</p>

            <div className="pd-skin-types">
              {product.skinTypes.map((type) => (
                <span key={type} className="pd-skin-pill">{type}</span>
              ))}
            </div>

            <div className="pd-info-meta">
              <span className="pd-meta-item">
                <strong>Contenance</strong>
                {extra.volume}
              </span>
              <span className="pd-meta-item">
                <strong>Problématique</strong>
                {product.concern}
              </span>
            </div>

            <div className="pd-purchase">
              <span className="pd-price">{(product.price * qty).toFixed(2)} €</span>
              {qty > 1 && (
                <span className="pd-price-unit">{product.price.toFixed(2)} € / unité</span>
              )}

              <div className="pd-qty-row">
                <div className="pd-qty">
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Diminuer"
                    disabled={qty <= 1}
                  >
                    <Minus size={15} />
                  </button>
                  <span className="pd-qty-val">{qty}</span>
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQty(Math.min(10, qty + 1))}
                    aria-label="Augmenter"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  className={`btn btn-primary pd-add-btn${added ? " is-added" : ""}`}
                  onClick={handleAdd}
                  type="button"
                >
                  {added ? <CheckCircle2 size={18} /> : <ShoppingBag size={18} />}
                  {added ? "Ajouté au panier !" : "Ajouter au panier"}
                </button>
              </div>

              <Link className="btn btn-secondary pd-diag-link" to="/diagnostic">
                <Sparkles size={16} />
                Vérifier ma compatibilité
              </Link>
            </div>

            <div className="pd-trust-strip">
              <span><Truck size={14} /> Livraison offerte dès 50 €</span>
              <span>✓ Formulé pour peaux mélaninées</span>
              <span>✓ Testé dermatologiquement</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mode d'emploi + ingrédients ── */}
      <section className="pd-details-section section-pad">
        <div className="pd-details-inner">

          <div className="pd-usage-block">
            <p className="eyebrow">Application</p>
            <h2>Comment l'utiliser.</h2>
            <p className="pd-usage-text">{extra.usage}</p>
          </div>

          <div className="pd-ingredients-block">
            <div className="pd-ingredients-head">
              <FlaskConical size={20} />
              <div>
                <p className="eyebrow">Formule</p>
                <h2>Les actifs clés.</h2>
              </div>
            </div>
            <div className="pd-ingredients-grid">
              {extra.ingredients.map((ing, i) => (
                <div key={ing} className="pd-ingredient-pill">
                  <span className="pd-ing-num">{String(i + 1).padStart(2, "0")}</span>
                  <strong>{ing}</strong>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Avis ── */}
      <section className="pd-reviews-section section-pad">
        <div className="pd-reviews-inner">
          <div className="pd-reviews-head">
            <div>
              <p className="eyebrow">Témoignages</p>
              <h2>Ce qu'elles en disent.</h2>
            </div>
            <div className="pd-reviews-summary">
              <span className="pd-reviews-avg">{product.rating}</span>
              <div>
                <StarRow rating={product.rating} />
                <span className="pd-reviews-total">{product.reviewCount} avis vérifiés</span>
              </div>
            </div>
          </div>

          <div className="pd-reviews-slider">
            <button
              className="pd-slider-btn"
              onClick={() => setReviewPage((reviewPage - 1 + totalReviewPages) % totalReviewPages)}
              aria-label="Précédent"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="pd-reviews-track">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className={`pd-review-card${i === reviewPage ? " is-active" : ""}`}
                >
                  <div className="pd-review-top">
                    <div className="pd-reviewer-avatar">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <strong className="pd-reviewer-name">{r.name}</strong>
                      <span className="pd-review-date">{r.date}</span>
                    </div>
                    <StarRow rating={r.rating} />
                  </div>
                  <p className="pd-review-text">"{r.text}"</p>
                </div>
              ))}
            </div>

            <button
              className="pd-slider-btn"
              onClick={() => setReviewPage((reviewPage + 1) % totalReviewPages)}
              aria-label="Suivant"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="pd-reviews-dots">
            {reviews.map((_, i) => (
              <button
                key={i}
                className={`pd-dot${i === reviewPage ? " is-active" : ""}`}
                onClick={() => setReviewPage(i)}
                aria-label={`Avis ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Produits similaires ── */}
      <section className="pd-related-section section-pad">
        <div className="pd-related-head">
          <p className="eyebrow">Explorer</p>
          <h2>Tu pourrais aussi aimer.</h2>
        </div>
        <div className="pd-related-grid">
          {related.map((p) => (
            <Link key={p.id} className="pd-related-card" to={`/produit/${p.slug}`}>
              <div
                className="pd-related-media"
                style={{ "--accent": p.accent }}
              >
                {p.badge && <span className="pd-related-badge">{p.badge}</span>}
                <img
                  src={p.image}
                  alt={p.name}
                  className="pd-related-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling && (e.target.nextSibling.style.display = "flex");
                  }}
                />
                <div className="pd-related-fallback" aria-hidden="true">
                  <div className="bottle" />
                </div>
              </div>
              <div className="pd-related-body">
                <p className="pd-related-category">{p.category}</p>
                <h3 className="pd-related-name">{p.name}</h3>
                <div className="pd-related-footer">
                  <StarRow rating={p.rating} />
                  <span className="pd-related-price">{p.price.toFixed(2)} €</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
