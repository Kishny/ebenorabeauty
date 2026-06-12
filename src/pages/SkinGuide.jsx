// src/pages/SkinGuide.jsx
// Guide éducatif premium — problématiques spécifiques aux peaux mélaninées.
// Photos vérifiées Pexels : série @akoonie + @oyeshothis (African Beauty / Melanin).

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  ScanFace,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

/* ── Photos toutes vérifiées Pexels — femmes noires ── */
const P = (id, w = 700) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const concerns = [
  {
    slug: "hyperpigmentation",
    label: "Hyperpigmentation & taches",
    icon: "🌑",
    accent: "#601521",
    photo: P("33170458"),        // "African Beauty, Melanin, Glowing Skin" ✓
    intro: "Les peaux mélaninées produisent plus de mélanine en réponse aux agressions (acné, frottements, soleil). Résultat : des taches sombres persistantes, souvent plus visibles que la cause initiale.",
    pourquoi: "La mélanine est une protection naturelle, mais elle peut réagir de façon excessive lors d'inflammations, créant une hyperpigmentation post-inflammatoire (HPI) difficile à atténuer sans les bons actifs.",
    actifs: ["Niacinamide 5–10 %", "Vitamine C stabilisée", "Acide kojique", "Acide azélaïque", "Alpha-arbutine"],
    eviter: ["Hydroquinone sans suivi médical", "Exfoliants mécaniques abrasifs", "Exposition solaire sans SPF"],
    conseil: "Le SPF est ton meilleur allié anti-taches — sans protection solaire, aucun actif éclaircissant ne peut vraiment agir.",
  },
  {
    slug: "acne",
    label: "Acné & imperfections",
    icon: "⚡",
    accent: "#7A2433",
    photo: P("9516034"),         // "Dramatic close-up portrait of a thoughtful black woman" ✓
    intro: "L'acné sur peau noire laisse des marques sombres (HPI) bien plus visibles que sur les peaux claires. Traiter l'acné, c'est aussi prévenir ces séquelles qui peuvent durer des mois.",
    pourquoi: "Les imperfections déclenchent une réponse inflammatoire qui stimule les mélanocytes. Plus l'inflammation est intense ou longue, plus la tache post-acné sera profonde et persistante.",
    actifs: ["Acide salicylique 1–2 %", "Niacinamide", "Acide azélaïque", "Rétinol faible dosage", "Zinc PCA"],
    eviter: ["Peroxyde de benzoyle fort (peut assécher excessivement)", "Alcool dénaturé", "Grattage des boutons"],
    conseil: "Traite l'inflammation en priorité — un bouton non touché laisse moins de traces qu'un bouton éclaté.",
  },
  {
    slug: "sebum",
    label: "Excès de sébum & brillance",
    icon: "💧",
    accent: "#601521",
    photo: P("21967036"),        // "Close-up portrait of a black woman in a casual sweater" ✓
    intro: "Les peaux grasses ou mixtes mélaninées sont souvent sur-nettoyées, ce qui aggrave la production de sébum. La brillance n'est pas un manque de propreté, c'est un déséquilibre à corriger.",
    pourquoi: "Le sébum est essentiel — il protège et nourrit. L'enjeu est de le réguler sans le supprimer. Décaper la peau déclenche une sur-compensation : elle produit encore plus de sébum pour se défendre.",
    actifs: ["Zinc PCA", "Niacinamide 10 %", "Acide salicylique", "Argile kaolin (masque 1×/sem.)", "Extrait de thé vert"],
    eviter: ["Nettoyants moussants agressifs SLS/SLES", "Alcool dénaturé", "Crèmes occlusives lourdes"],
    conseil: "Même peau grasse = hydratation obligatoire. Une peau déshydratée surproduit du sébum pour compenser.",
  },
  {
    slug: "secheresse",
    label: "Peau sèche & inconfort",
    icon: "🌿",
    accent: "#C9825D",
    photo: P("9516038"),         // "Captivating close-up of a woman's serene face, eyes downcast" ✓
    intro: "La peau noire tend à paraître plus sèche et terne que les peaux claires car la desquamation y est plus visible. Ce n'est pas qu'une question d'hydratation — c'est aussi une question de film lipidique.",
    pourquoi: "Les peaux ébène et cacao ont une barrière cutanée qui se régénère moins vite que les peaux claires. Le karité et les huiles végétales riches en acides gras essentiels sont ici incontournables.",
    actifs: ["Céramides", "Beurre de karité", "Squalane", "Acide hyaluronique", "Glycérine"],
    eviter: ["Alcool dénaturé", "Parfums synthétiques forts", "Eau chaude (douche ou nettoyage)"],
    conseil: "Applique ton hydratant sur peau encore légèrement humide — l'eau résiduelle est captée et reste dans la peau.",
  },
  {
    slug: "deshydratation",
    label: "Déshydratation",
    icon: "💦",
    accent: "#4B6FA5",
    photo: P("9516040"),         // "A detailed close-up portrait capturing the serene expression of a woman" ✓
    intro: "La déshydratation est un état, pas un type de peau — une peau grasse peut être déshydratée. Les signaux : teint terne, pores qui semblent s'agrandir, petites ridules superficielles.",
    pourquoi: "L'eau s'évapore de la surface cutanée (TEWL). Si la barrière est fragilisée, le taux d'évaporation augmente et la peau manque d'eau même si elle semble produire du sébum.",
    actifs: ["Acide hyaluronique (multi-poids)", "Glycérine", "Panthénol (B5)", "Bêta-glucane", "Aloe vera"],
    eviter: ["AHA/BHA sans hydratant en couche suivante", "Nettoyants moussants fréquents", "Climatisation prolongée sans soin"],
    conseil: "Superpose : humectant (HA) → hydratant → occlusif léger. Chaque couche verrouille la précédente.",
  },
  {
    slug: "sensibilite",
    label: "Peau sensible & réactive",
    icon: "🌸",
    accent: "#D96B8A",
    photo: P("9516043"),         // "Intimate close-up of a beautiful woman's face with expressive eyes" ✓
    intro: "Les peaux mélaninées sensibles réagissent aux parfums, aux conservateurs et aux changements de température. Les rougeurs sont moins visibles mais les picotements, brûlures et désconforts sont bien réels.",
    pourquoi: "La barrière cutanée perturbée laisse passer les irritants. Moins de couches de produits, formulations minimalistes et introduction progressive sont les clés.",
    actifs: ["Centella asiatica", "Bisabolol", "Avoine colloïdale", "Panthénol", "Céramides NP/AP/EOP"],
    eviter: ["Parfums synthétiques", "Alcool éthylique", "Huiles essentielles pures sur peau nue", "Acides forts non tamponnés"],
    conseil: "Règle du patch test : toujours tester un nouveau produit 48h sur la face interne du poignet avant d'appliquer sur le visage.",
  },
  {
    slug: "pilosite",
    label: "Poils incarnés & pilosité",
    icon: "✂️",
    accent: "#3f0e18",
    photo: P("37421442"),        // "Nigerian woman, natural hairstyle, dark skin, profile" ✓
    intro: "Les poils incarnés (pseudofolliculitis) touchent davantage les peaux noires en raison de la structure naturellement bouclée du cheveu — il repousse en spirale et peut facilement rentrer dans la peau.",
    pourquoi: "Le rasage, l'épilation à la cire ou le laser créent des micro-inflammations qui, sur peau mélaninée, laissent des taches sombres persistantes. La prévention vaut mieux que le traitement.",
    actifs: ["Acide glycolique 5–10 %", "Acide salicylique", "Centella asiatica", "Niacinamide", "Huile d'arbre à thé"],
    eviter: ["Rasage à sec", "Épilation répétée sans soin apaisant", "Grattage des zones touchées"],
    conseil: "L'exfoliation chimique 2–3 fois par semaine libère les poils piégés avant qu'ils s'incarnent. Commence avant l'épilation, pas après.",
  },
];

const avoidIngredients = [
  { name: "Alcool dénaturé (SD Alcohol)", raison: "Décape la barrière, favorise la déshydratation et les irritations." },
  { name: "Hydroquinone >2 %", raison: "Peut provoquer l'ochronose (taches bleues-noires) sur peaux foncées si utilisée sans suivi." },
  { name: "Parfums synthétiques", raison: "1ère cause d'allergie de contact sur peau sensible. Cherche 'fragrance-free'." },
  { name: "SLS / SLES", raison: "Tensioactifs trop agressifs qui détruisent le film hydrolipidique." },
  { name: "Huiles minérales lourdes", raison: "Peuvent occlure les pores et aggraver l'acné sur peau grasse." },
  { name: "Acides >10 % sans tampon", raison: "À pH trop bas, brûlures et HPI possibles sur peaux mélaninées." },
];

export default function SkinGuide() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="sg-page">

      {/* ── Hero ── */}
      <section className="sg-hero section-pad">
        <div className="sg-hero-inner">
          <div className="sg-hero-content">
            <p className="eyebrow">Guide peau</p>
            <h1 className="sg-hero-title">
              Comprendre sa peau<br />
              <em>avant d'acheter.</em>
            </h1>
            <p className="sg-hero-sub">
              Les peaux mélaninées ont leurs propres règles. Ce guide t'apprend à lire
              les signaux de ta peau, choisir les bons actifs et éviter les erreurs
              qui aggravent les taches et la sensibilité.
            </p>
            <div className="sg-hero-stats">
              <div className="sg-stat">
                <strong>7</strong>
                <span>problématiques décryptées</span>
              </div>
              <div className="sg-stat">
                <strong>30+</strong>
                <span>actifs analysés</span>
              </div>
              <div className="sg-stat">
                <strong>100 %</strong>
                <span>dédié aux peaux noires</span>
              </div>
            </div>
            <div className="sg-hero-actions">
              <a className="btn btn-primary" href="#concerns">
                <BookOpen size={17} />
                Lire le guide
              </a>
              <Link className="btn btn-secondary" to="/diagnostic">
                <ScanFace size={17} />
                Faire mon diagnostic
              </Link>
            </div>
          </div>
          <div className="sg-hero-photo">
            <img
              src={P("33170460", 900)}
              alt="Femme noire à la peau lumineuse et saine"
              className="sg-hero-img"
              onError={(e) => { e.target.style.opacity = "0"; }}
            />
            <div className="sg-hero-photo-badge">
              <ShieldCheck size={15} />
              <span>Guide 100 % peaux mélaninées</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intro éducative ── */}
      <section className="sg-intro-section section-pad">
        <div className="sg-intro-inner">
          <div className="sg-intro-card">
            <AlertTriangle size={22} className="sg-intro-icon" />
            <div>
              <h2>Pourquoi les conseils génériques ne marchent pas sur peau noire ?</h2>
              <p>
                La majorité des études cliniques en dermatologie ont été menées sur des peaux claires.
                Résultat : les conseils standards ignorent les particularités de la mélanine élevée —
                réaction inflammatoire plus intense, HPI persistante, déshydratation visible différemment,
                réponse aux actifs parfois opposée.
              </p>
              <p>
                Ce guide est construit à partir de la réalité des peaux ébène, cacao, acajou et brunes.
                Pas de copier-coller de conseils destinés à d'autres carnations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fiches problématiques ── */}
      <section className="sg-concerns-section section-pad" id="concerns">
        <div className="sg-concerns-inner">
          <div className="sg-section-head">
            <p className="eyebrow">Problématiques</p>
            <h2>Les 7 sujets qui comptent pour ta peau.</h2>
            <p>Clique sur une problématique pour tout savoir — causes, actifs recommandés et erreurs à éviter.</p>
          </div>

          <div className="sg-concerns-grid">
            {concerns.map((c, i) => (
              <div
                key={c.slug}
                className={`sg-concern-card${openIdx === i ? " is-open" : ""}`}
                style={{ "--c-accent": c.accent }}
              >
                {/* Header cliquable */}
                <button
                  className="sg-concern-header"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                >
                  <div className="sg-concern-photo-wrap">
                    <img
                      src={c.photo}
                      alt={c.label}
                      className="sg-concern-photo"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="sg-concern-photo-fallback"
                      style={{ background: c.accent, display: "none" }}
                    >
                      <span>{c.icon}</span>
                    </div>
                  </div>
                  <div className="sg-concern-header-text">
                    <span className="sg-concern-icon">{c.icon}</span>
                    <h3>{c.label}</h3>
                    <p className="sg-concern-intro-preview">{c.intro.slice(0, 80)}…</p>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`sg-concern-chevron${openIdx === i ? " rotated" : ""}`}
                  />
                </button>

                {/* Contenu expandable */}
                {openIdx === i && (
                  <div className="sg-concern-body">
                    <div className="sg-concern-body-inner">
                      {/* Grande photo */}
                      <div className="sg-concern-body-photo">
                        <img
                          src={c.photo}
                          alt={c.label}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <div className="sg-concern-body-photo-label" style={{ background: c.accent }}>
                          {c.label}
                        </div>
                      </div>

                      {/* Texte */}
                      <div className="sg-concern-body-text">
                        <div className="sg-concern-section">
                          <p className="sg-concern-full-intro">{c.intro}</p>
                        </div>

                        <div className="sg-concern-section">
                          <h4>Comprendre le mécanisme</h4>
                          <p>{c.pourquoi}</p>
                        </div>

                        <div className="sg-concern-cols">
                          <div className="sg-concern-col sg-col-good">
                            <div className="sg-col-head">
                              <CheckCircle2 size={16} />
                              <strong>Actifs recommandés</strong>
                            </div>
                            <ul>
                              {c.actifs.map((a) => (
                                <li key={a}>{a}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="sg-concern-col sg-col-bad">
                            <div className="sg-col-head">
                              <XCircle size={16} />
                              <strong>À éviter</strong>
                            </div>
                            <ul>
                              {c.eviter.map((e) => (
                                <li key={e}>{e}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="sg-concern-tip">
                          <Sparkles size={15} />
                          <p><strong>Conseil Ebenora :</strong> {c.conseil}</p>
                        </div>

                        <Link
                          className="btn btn-primary sg-concern-cta"
                          to={`/routines/${c.slug === "sebum" ? "peau-grasse" : c.slug === "acne" ? "acne-imperfections" : c.slug === "secheresse" ? "peau-seche" : c.slug === "deshydratation" ? "peau-deshydratee" : c.slug === "sensibilite" ? "sensibilite" : c.slug === "pilosite" ? "pilosite-faciale" : "peau-grasse"}`}
                        >
                          Voir la routine associée
                          <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ingrédients à surveiller ── */}
      <section className="sg-avoid-section section-pad">
        <div className="sg-avoid-inner">
          <div className="sg-section-head">
            <FlaskConical size={22} className="sg-avoid-icon" />
            <div>
              <p className="eyebrow">Formules</p>
              <h2>Les ingrédients à surveiller sur peau mélaninée.</h2>
              <p>Ces actifs sont courants dans les soins grand public mais peuvent aggraver les problématiques spécifiques aux peaux noires.</p>
            </div>
          </div>

          <div className="sg-avoid-grid">
            {avoidIngredients.map((ing) => (
              <div key={ing.name} className="sg-avoid-card">
                <div className="sg-avoid-card-top">
                  <XCircle size={16} className="sg-avoid-x" />
                  <strong>{ing.name}</strong>
                </div>
                <p>{ing.raison}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Diagnostic ── */}
      <section className="sg-cta-section section-pad">
        <div className="sg-cta-inner">
          <div className="sg-cta-photos" aria-hidden="true">
            {["33170458", "9516039", "18920899"].map((id) => (
              <div key={id} className="sg-cta-photo-cell">
                <img
                  src={P(id, 400)}
                  alt=""
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            ))}
          </div>
          <div className="sg-cta-content">
            <p className="eyebrow">Et maintenant ?</p>
            <h2>Tu as lu le guide. Maintenant trouve ta routine.</h2>
            <p>Notre diagnostic analyse tes réponses et te recommande la routine exacte adaptée à ton profil de peau mélaninée.</p>
            <div className="sg-cta-actions">
              <Link className="btn btn-primary" to="/diagnostic">
                <ScanFace size={18} />
                Faire le diagnostic
              </Link>
              <Link className="btn btn-secondary" to="/boutique">
                <ArrowRight size={18} />
                Voir la boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
