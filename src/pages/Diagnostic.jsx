// src/pages/Diagnostic.jsx
// Diagnostic peau avec recommandation de routine et produits adaptés.
// Logique : système de score — chaque réponse incrémente un compteur par profil.
// Le profil avec le score le plus élevé remporte la recommandation.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Droplets,
  FlaskConical, Moon, RotateCcw, ShoppingBag, Sparkles, Sun,
} from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import { useCart } from "../context/CartContext.jsx";
import { products } from "../data/products.js";
import { routinesData } from "../data/routinesData.js";

/* ── Carte produit avec vraie image pour les résultats ── */
function ResultProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  function handleAdd(e) {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="result-product-card" style={{ "--rp-accent": product.accent }}>
      <a href={`/produit/${product.slug}`} className="result-product-media">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
        ) : null}
        <div className="result-product-fallback" style={{ display: product.image ? "none" : "flex" }}>
          <div className="bottle" aria-hidden="true" />
        </div>
        {product.badge && <span className="result-product-badge">{product.badge}</span>}
      </a>
      <div className="result-product-body">
        <p className="result-product-category">{product.category}</p>
        <a href={`/produit/${product.slug}`} className="result-product-name">{product.name}</a>
        <p className="result-product-desc">{product.description}</p>
        <div className="result-product-bottom">
          <strong>{product.price.toFixed(2)} €</strong>
          <button type="button" className={`result-product-add${added ? " is-added" : ""}`} onClick={handleAdd}>
            {added ? <><CheckCircle2 size={14} /> Ajouté</> : <><ShoppingBag size={14} /> Ajouter</>}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Questions ──────────────────────────────────────────────────────────────

// Images par step.
// → Place tes photos dans public/images/diagnostic/ pour les remplacer.
// Les chemins ci-dessous sont des placeholders avec les images existantes.
const stepImages = [
  {
    src: "/images/step/step1.jpg",
    fallback: "/images/step/step2.jpg",
    alt: "Femme noire tenant un sérum — étape 1 du diagnostic",
  },
  {
    src: "/images/step/step2.jpg",
    fallback: "/images/step/step1.jpg",
    alt: "Femme noire appliquant une crème — étape 2 du diagnostic",
  },
  {
    src: "/images/step/step3.jpg",
    fallback: "/images/step/step4.jpg",
    alt: "Femme noire choisissant son soin — étape 3 du diagnostic",
  },
  {
    src: "/images/step/step4.jpg",
    fallback: "/images/step/step3.jpg",
    alt: "Femme noire ébène — résultat du diagnostic",
  },
];

const questions = [
  {
    id: "skin_type",
    title: "Comment se comporte ta peau en cours de journée ?",
    options: [
      { label: "Elle brille, surtout sur le front et le nez", scores: { grasse: 3, mixte: 1 } },
      { label: "Elle brille sur la zone T mais est normale ailleurs", scores: { mixte: 3, grasse: 1 } },
      { label: "Elle tire, elle est inconfortable", scores: { seche: 3, deshydratee: 1 } },
      { label: "Elle tire mais n'est pas sèche au toucher", scores: { deshydratee: 3, seche: 1 } },
      { label: "Elle réagit vite aux nouveaux produits", scores: { sensible: 3 } },
    ],
  },
  {
    id: "concern",
    title: "Quelle est ta problématique principale ?",
    options: [
      { label: "Boutons, points noirs et imperfections", scores: { acne: 3, grasse: 1 } },
      { label: "Brillance et pores visibles", scores: { grasse: 3, mixte: 2 } },
      { label: "Taches, cicatrices post-acné et teint inégal", scores: { acne: 2, sensible: 1 } },
      { label: "Sécheresse, tiraillements et inconfort", scores: { seche: 3, deshydratee: 2 } },
      { label: "Rougeurs, irritations et réactivité", scores: { sensible: 3 } },
      { label: "Poils incarnés et pilosité faciale", scores: { pilosite: 3 } },
    ],
  },
  {
    id: "feeling",
    title: "Qu'est-ce que tu ressens souvent après avoir appliqué un soin ?",
    options: [
      { label: "Lourd, gras — je préfère les textures très légères", scores: { grasse: 2, mixte: 1 } },
      { label: "Ni trop gras ni trop léger — j'aime l'équilibre", scores: { mixte: 2, deshydratee: 1 } },
      { label: "Insuffisant — ma peau réclame encore de la nutrition", scores: { seche: 3 } },
      { label: "Ça picote ou ça rougit parfois", scores: { sensible: 3 } },
      { label: "Bien — tant que ça traite sans agresser", scores: { acne: 2, pilosite: 1 } },
    ],
  },
  {
    id: "goal",
    title: "Quel est ton objectif beauté principal ?",
    options: [
      { label: "Matifier et réduire les imperfections", scores: { grasse: 2, acne: 2 } },
      { label: "Illuminer et obtenir un glow naturel", scores: { deshydratee: 2, seche: 1 } },
      { label: "Apaiser et réduire les réactions", scores: { sensible: 3 } },
      { label: "Nourrir et restaurer le confort", scores: { seche: 3, deshydratee: 1 } },
      { label: "Unifier le teint et effacer les marques", scores: { acne: 3 } },
      { label: "Prévenir les poils incarnés et adoucir la peau", scores: { pilosite: 3 } },
    ],
  },
];

// ─── Mapping profil → routine ────────────────────────────────────────────────

const profileToRoutine = {
  grasse:      { slug: "peau-grasse",            label: "Peau grasse" },
  mixte:       { slug: "peau-mixte",             label: "Peau mixte" },
  seche:       { slug: "peau-seche",             label: "Peau sèche" },
  deshydratee: { slug: "peau-deshydratee",       label: "Peau déshydratée" },
  sensible:    { slug: "sensibilite",            label: "Peau sensible" },
  acne:        { slug: "acne-imperfections",     label: "Acné & imperfections" },
  pilosite:    { slug: "pilosite-faciale",       label: "Pilosité faciale" },
};

// ─── Mapping profil → produits recommandés ───────────────────────────────────

const profileToProducts = {
  grasse:      ["gel-matifiant-sebum-control"],
  mixte:       ["gel-matifiant-sebum-control", "serum-eclat-ebene"],
  seche:       ["creme-apaisante-sensitive-melanin", "huile-corps-nude-glow"],
  deshydratee: ["serum-eclat-ebene", "creme-apaisante-sensitive-melanin"],
  sensible:    ["creme-apaisante-sensitive-melanin"],
  acne:        ["routine-anti-imperfections", "gel-matifiant-sebum-control"],
  pilosite:    ["soin-pilosite-douceur-visage"],
};

// ─── Données enrichies par profil ────────────────────────────────────────────

const profileData = {
  grasse: {
    label:   "Peau grasse",
    message: "Ta peau produit beaucoup de sébum — l'objectif est de réguler sans décaper et d'éviter les produits trop occlusifs.",
    accent:  "#601521",
    tags:    ["Brillance", "Pores visibles", "Excès de sébum"],
    matin: [
      "Nettoyant gel doux pour éliminer l'excès de sébum de la nuit",
      "Tonique équilibrant sans alcool pour resserrer les pores",
      "Soin hydratant léger, texture gel ou fluide",
      "Protection solaire non comédogène SPF 30+",
    ],
    soir: [
      "Double nettoyage : huile légère puis gel moussant",
      "Sérum matifiant à la niacinamide pour réguler la brillance",
      "Crème de nuit légère, non occlusives",
    ],
    ingredients: ["Niacinamide", "Acide salicylique", "Zinc", "Aloe vera"],
  },
  mixte: {
    label:   "Peau mixte",
    message: "Ta zone T est plus active que le reste du visage. Une routine qui équilibre sans assécher les joues est la clé.",
    accent:  "#7A2433",
    tags:    ["Zone T brillante", "Joues normales", "Pores visibles"],
    matin: [
      "Nettoyant doux adapté aux peaux mixtes",
      "Hydratant léger appliqué en évitant la zone T",
      "Gel matifiant ciblé sur le front, nez et menton",
      "SPF léger texture fluide",
    ],
    soir: [
      "Nettoyant équilibrant pour éliminer impuretés et maquillage",
      "Sérum régulateur sur la zone T uniquement",
      "Crème légère sur les joues pour nourrir sans surcharger",
    ],
    ingredients: ["Niacinamide", "Acide hyaluronique", "Extrait de thé vert", "Zinc PCA"],
  },
  seche: {
    label:   "Peau sèche",
    message: "Ta barrière cutanée a besoin de soutien. Hydratation, nutrition et protection sont les maîtres mots.",
    accent:  "#C9825D",
    tags:    ["Tiraillements", "Inconfort", "Peau terne"],
    matin: [
      "Nettoyant crémeux doux sans sulfates",
      "Sérum à l'acide hyaluronique sur peau humide",
      "Crème riche pour sceller l'hydratation",
      "SPF teinté nourrissant",
    ],
    soir: [
      "Nettoyant huileux ou en baume pour ne pas décaper",
      "Sérum réparateur à la céramide ou au squalane",
      "Crème de nuit nourrissante en couche généreuse",
      "Huile sèche en occlusif si besoin",
    ],
    ingredients: ["Céramides", "Squalane", "Acide hyaluronique", "Beurre de karité"],
  },
  deshydratee: {
    label:   "Peau déshydratée",
    message: "Ta peau manque d'eau, pas de lipides. Des actifs humectants comme l'acide hyaluronique sont tes meilleurs alliés.",
    accent:  "#F0BA87",
    tags:    ["Manque d'eau", "Teint terne", "Peau qui tire"],
    matin: [
      "Nettoyant très doux, moussant léger",
      "Brume hydratante ou eau thermale",
      "Sérum à l'acide hyaluronique appliqué sur peau humide",
      "Crème légère pour sceller + SPF",
    ],
    soir: [
      "Démaquillage doux à l'eau micellaire ou huile légère",
      "Masque hydratant 2x/semaine",
      "Sérum humectant en couche généreuse",
      "Crème de nuit hydratante",
    ],
    ingredients: ["Acide hyaluronique", "Glycérine", "Panthénol", "Aloé vera"],
  },
  sensible: {
    label:   "Peau sensible",
    message: "Ta peau réagit vite — formules douces, peu d'ingrédients actifs et introduction progressive sont essentiels.",
    accent:  "#D96B8A",
    tags:    ["Réactivité", "Rougeurs", "Inconfort"],
    matin: [
      "Nettoyant ultra-doux sans parfum ni colorant",
      "Sérum apaisant à la centella asiatica",
      "Crème barrière légère et hypoallergénique",
      "SPF minéral à l'oxyde de zinc",
    ],
    soir: [
      "Nettoyant crémeux doux, rinçage à l'eau tiède",
      "Quelques gouttes d'huile de rose musquée ou de jojoba",
      "Crème apaisante en couche fine",
    ],
    ingredients: ["Centella asiatica", "Bisabolol", "Avoine colloïdale", "Panthénol"],
  },
  acne: {
    label:   "Acné & imperfections",
    message: "Les imperfections et les marques post-acné demandent une approche douce et ciblée, pas agressive.",
    accent:  "#601521",
    tags:    ["Boutons", "Marques post-acné", "Pores bouchés"],
    matin: [
      "Nettoyant gel à l'acide salicylique (2x/semaine max.)",
      "Tonique doux sans alcool",
      "Hydratant léger non comédogène",
      "SPF non comédogène obligatoire pour éviter l'hyperpigmentation",
    ],
    soir: [
      "Nettoyant doux pour éliminer maquillage et impuretés",
      "Traitement ciblé : rétinol faible dosage ou AHA/BHA",
      "Crème hydratante légère pour compenser l'effet desséchant des actifs",
    ],
    ingredients: ["Acide salicylique", "Niacinamide", "Rétinol", "Acide azélaïque"],
  },
  pilosite: {
    label:   "Pilosité faciale",
    message: "Les poils incarnés et l'irritation liée à la pilosité faciale nécessitent des soins spécifiques et apaisants.",
    accent:  "#3f0e18",
    tags:    ["Poils incarnés", "Irritations", "Marques"],
    matin: [
      "Nettoyant doux pour préparer la peau",
      "Exfoliant chimique léger AHA/BHA (2x/semaine)",
      "Sérum apaisant anti-inflammation",
      "Crème légère + SPF pour protéger les zones irritées",
    ],
    soir: [
      "Nettoyant doux pour éliminer les impuretés",
      "Sérum ciblé poils incarnés à l'acide glycolique",
      "Crème apaisante ou gel aloe vera sur les zones réactives",
    ],
    ingredients: ["Acide glycolique", "Acide salicylique", "Centella asiatica", "Huile d'arbre à thé"],
  },
};

// ─── Logique de score ─────────────────────────────────────────────────────────

function computeResult(answers) {
  const scores = {
    grasse: 0, mixte: 0, seche: 0, deshydratee: 0,
    sensible: 0, acne: 0, pilosite: 0,
  };

  answers.forEach(({ option }) => {
    Object.entries(option.scores).forEach(([profile, points]) => {
      scores[profile] = (scores[profile] || 0) + points;
    });
  });

  const topProfile = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return topProfile;
}

// ─── Composant ────────────────────────────────────────────────────────────────

export default function Diagnostic() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  function handleAnswer(option) {
    const nextAnswers = [...answers, { questionId: current.id, option }];
    setAnswers(nextAnswers);

    if (step + 1 >= questions.length) {
      setResult(computeResult(nextAnswers));
    } else {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0) {
      setAnswers(answers.slice(0, -1));
      setStep(step - 1);
    }
  }

  function handleReset() {
    setStep(0);
    setAnswers([]);
    setResult(null);
  }

  // ── Résultat ────────────────────────────────────────────────────────────────

  if (result) {
    const routineInfo = profileToRoutine[result];
    const data = profileData[result];
    const routineDetail = routinesData[routineInfo.slug];
    const slugs = routineDetail?.produitsSlugs || profileToProducts[result] || [];
    const recommendedProducts = slugs
      .map((slug) => products.find((p) => p.slug === slug))
      .filter(Boolean);

    return (
      <div className="result-page">

        {/* ── Hero résultat ── */}
        <section className="result-hero section-pad" style={{ "--profile-accent": data.accent }}>
          <div className="result-hero-inner">
            <div className="result-hero-content">
              <div className="result-kicker">
                <Sparkles size={15} />
                <span>Diagnostic terminé</span>
              </div>

              <h1>
                Ton profil :<br />
                <span className="result-profile-name">{data.label}</span>
              </h1>

              <p className="result-hero-text">{data.message}</p>

              <div className="result-tags">
                {data.tags.map((tag) => (
                  <span key={tag} className="result-tag">{tag}</span>
                ))}
              </div>

              <div className="result-hero-actions">
                <Link className="btn btn-primary" to={`/routines/${routineInfo.slug}`}>
                  Voir la routine complète
                  <ArrowRight size={18} />
                </Link>
                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                  <RotateCcw size={16} />
                  Refaire
                </button>
              </div>
            </div>

            <div className="result-hero-visual">
              <img
                src="/images/home/hero-home-ebenora.png"
                alt="Femme noire à la peau lumineuse"
                className="result-hero-img"
              />
              <div className="result-hero-badge">
                <CheckCircle2 size={18} />
                <span>Profil identifié</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Routine matin / soir ── */}
        <section className="section-pad result-routine-section">
          <div className="result-section-head">
            <p className="eyebrow">Ta routine</p>
            <h2>Les gestes essentiels.</h2>
            <p>Une routine courte, dans le bon ordre, pour des résultats visibles sans agresser ta peau.</p>
          </div>

          <div className="result-routine-grid">
            {/* Matin */}
            <div className="result-routine-col">
              <div className="result-routine-col-header">
                <Sun size={20} />
                <h3>Matin</h3>
              </div>
              <ol className="result-routine-steps">
                {data.matin.map((step, i) => (
                  <li key={i} className="result-routine-step">
                    <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Soir */}
            <div className="result-routine-col">
              <div className="result-routine-col-header">
                <Moon size={20} />
                <h3>Soir</h3>
              </div>
              <ol className="result-routine-steps">
                {data.soir.map((step, i) => (
                  <li key={i} className="result-routine-step">
                    <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── Ingrédients clés ── */}
        <section className="result-ingredients-section section-pad">
          <div className="result-ingredients-inner">
            <div className="result-ingredients-head">
              <FlaskConical size={22} />
              <div>
                <p className="eyebrow">Formules</p>
                <h2>Les actifs à chercher.</h2>
                <p>Ces ingrédients sont particulièrement adaptés à ton profil. Retrouve-les sur les étiquettes de tes soins.</p>
              </div>
            </div>
            <div className="result-ingredients-grid">
              {data.ingredients.map((ing, i) => (
                <div key={ing} className="result-ingredient-card">
                  <span className="ingredient-num">{String(i + 1).padStart(2, "0")}</span>
                  <strong>{ing}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Produits recommandés ── */}
        {recommendedProducts.length > 0 && (
          <section className="section-pad result-products-section">
            <div className="result-section-head">
              <p className="eyebrow">Sélection pour toi</p>
              <h2>Les produits recommandés.</h2>
              <p>Choisis spécifiquement d'après ton profil {data.label.toLowerCase()}.</p>
            </div>
            <div className="result-products-grid">
              {recommendedProducts.map((product) => (
                <ResultProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="result-products-footer">
              <Link className="btn btn-secondary" to="/boutique">
                <ShoppingBag size={17} />
                Voir toute la boutique
              </Link>
            </div>
          </section>
        )}

        {/* ── Footer résultat ── */}
        <section className="result-footer-cta section-pad">
          <div className="result-footer-inner">
            <Droplets size={28} />
            <h2>Prête à commencer ta routine ?</h2>
            <p>Retrouve tous les détails, les gestes pas à pas et les conseils avancés sur la page dédiée.</p>
            <div className="result-footer-actions">
              <Link className="btn btn-primary" to={`/routines/${routineInfo.slug}`}>
                Voir la routine {data.label}
                <ArrowRight size={18} />
              </Link>
              <button type="button" className="btn btn-ghost" onClick={handleReset}>
                <RotateCcw size={16} />
                Refaire le diagnostic
              </button>
            </div>
          </div>
        </section>

      </div>
    );
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────────

  const img = stepImages[step];

  return (
    <>
      <PageHero
        eyebrow="Diagnostic peau"
        title="Trouve ta routine sans te perdre."
        text="4 questions pour identifier ton type de peau et te proposer les soins les plus cohérents."
      />

      <section className="section-pad">
        <div className="quiz-layout">
          {/* Photo du step courant */}
          <div className="quiz-visual">
            <img
              key={step}
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="quiz-model-img"
              onError={(e) => {
                // Fallback si le fichier n'existe pas encore.
                if (e.target.src !== window.location.origin + img.fallback) {
                  e.target.src = img.fallback;
                }
              }}
            />
            <div className="quiz-step-badge">
              <span>{step + 1}</span>
              <span>/ {questions.length}</span>
            </div>
          </div>

          {/* Quiz */}
          <div className="quiz-card">
            <div className="quiz-meta">
              <span className="quiz-step">Question {step + 1} / {questions.length}</span>
              <div className="progress">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>

            <h2>{current.title}</h2>

            <div className="option-grid">
              {current.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className="option-btn"
                  onClick={() => handleAnswer(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button type="button" className="quiz-back" onClick={handleBack}>
                <ArrowLeft size={16} />
                Question précédente
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
