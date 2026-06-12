// src/pages/Carnations.jsx
// Page carnations — palette, sous-tons, conseils produits, CTA diagnostic.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  Palette,
  ScanFace,
  Sparkles,
  Sun,
} from "lucide-react";

/* ── Données ── */
const tones = [
  {
    name: "Ébène profond",
    color: "#1F0E08",
    subTone: "Chaud / Rouge",
    concern: "Hyperpigmentation, taches post-acné, éclat",
    tip: "Privilégie les actifs anti-taches doux : niacinamide, acide kojique, vitamine C stabilisée.",
    textColor: "#FFF7F2",
    photo: "/images/carnations/ebene-profond.jpg",
  },
  {
    name: "Cacao intense",
    color: "#32170C",
    subTone: "Chaud / Doré",
    concern: "Déshydratation, brillance, texture",
    tip: "Mise sur des formules à l'huile de marula et à l'acide hyaluronique pour préserver le confort.",
    textColor: "#FFF7F2",
    photo: "/images/carnations/cacao-intense.jpg",
  },
  {
    name: "Acajou",
    color: "#5C2A18",
    subTone: "Neutre / Brun",
    concern: "Rougeurs localisées, sensibilité, zones sèches",
    tip: "Les céramides et le panthénol renforcent la barrière cutanée sans alourdir.",
    textColor: "#FFF7F2",
    photo: "/images/carnations/acajou.jpg",
  },
  {
    name: "Noisette foncée",
    color: "#7A4028",
    subTone: "Neutre / Olive",
    concern: "Pores dilatés, imperfections, teint irrégulier",
    tip: "L'acide salicylique à faible dose et le zinc PCA aident à réguler la production de sébum.",
    textColor: "#FFF7F2",
    photo: "/images/carnations/noisette.jpg",
  },
  {
    name: "Caramel brun",
    color: "#9A5A38",
    subTone: "Chaud / Ambre",
    concern: "Éclat, légèreté, hydratation",
    tip: "Les sérums à base d'aloe vera et d'extrait de centella apportent fraîcheur et éclat.",
    textColor: "#FFF7F2",
    // "Elegant portrait of a woman with natural afro hair, deep expression" (verified)
    photo: "https://images.pexels.com/photos/12293164/pexels-photo-12293164.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Doré chaud",
    color: "#B87444",
    subTone: "Chaud / Cuivré",
    concern: "Glow, nutrition, protection barrière",
    tip: "Les huiles sèches de type marula, jojoba et argan subliment la carnation sans graisser.",
    textColor: "#FFF7F2",
    // "Joyful portrait of a smiling black woman with radiant skin" (verified)
    photo: "https://images.pexels.com/photos/33170460/pexels-photo-33170460.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const subToneGuide = [
  {
    icon: "🔴",
    label: "Sous-ton chaud",
    description: "Teintes rouge, orange, doré. Le rouge ou l'or font ressortir ta peau. Les veines paraissent vertes.",
    avoid: "Formules au zinc seul (peut griser)",
    use: "Vitamine C, niacinamide, huiles dorées",
    accentColor: "#C9825D",
    // "Dramatic close-up portrait of a thoughtful black woman" (verified)
    photo: "https://images.pexels.com/photos/9516034/pexels-photo-9516034.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    icon: "🔵",
    label: "Sous-ton froid",
    description: "Teintes rose, rouge-bleuté, lilas. L'argent ressort plus que l'or. Les veines paraissent bleues.",
    avoid: "Actifs trop chauds qui peuvent jaunir",
    use: "Acide azélaïque, sérum acide hyaluronique",
    accentColor: "#7A2433",
    // "Nigerian woman, natural hairstyle, dark skin, Enugu" (verified)
    photo: "https://images.pexels.com/photos/37421442/pexels-photo-37421442.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    icon: "⚪",
    label: "Sous-ton neutre",
    description: "Mix des deux. Le blanc pur ou la crème te vont toutes les deux. Les veines paraissent bleu-vert.",
    avoid: "Surcharge en actifs potentiellement irritants",
    use: "Céramides, beurre de karité, panthénol",
    accentColor: "#8A4F31",
    // "Captivating close-up portrait of a young black woman with afro hair" (verified)
    photo: "https://images.pexels.com/photos/9862639/pexels-photo-9862639.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const ingredients = [
  {
    name: "Niacinamide",
    icon: "✦",
    desc: "Illumine, resserre les pores, atténue les taches. Idéal pour toutes les carnations mélaninées.",
    badge: "Universel",
  },
  {
    name: "Vitamine C stabilisée",
    icon: "✦",
    desc: "Antioxydant puissant. Choisir une formule à l'ascorbyl glucoside pour les peaux sensibles.",
    badge: "Éclat",
  },
  {
    name: "Acide hyaluronique",
    icon: "✦",
    desc: "Hydratation profonde sans effet gras. Compatible avec toutes les textures de peau.",
    badge: "Hydratation",
  },
  {
    name: "Beurre de karité",
    icon: "✦",
    desc: "Nourrit et protège la barrière. Plébiscité sur les peaux ébène et cacao pour son confort.",
    badge: "Nutrition",
  },
  {
    name: "Céramides",
    icon: "✦",
    desc: "Réparent la barrière cutanée. Essentiels pour les peaux sensibles ou déshydratées.",
    badge: "Protection",
  },
  {
    name: "Zinc PCA",
    icon: "✦",
    desc: "Régule le sébum sans dessécher. Parfait pour les peaux mixtes à grasses mélaninées.",
    badge: "Matité",
  },
];

/* ── Fallback onError ── */
function handleImgError(e, color) {
  e.target.style.display = "none";
  const fallback = e.target.nextSibling;
  if (fallback) {
    fallback.style.display = "flex";
    fallback.style.background = color || "#32170C";
  }
}

export default function Carnations() {
  const [activeIdx, setActiveIdx] = useState(null);
  const selected = activeIdx !== null ? tones[activeIdx] : null;

  return (
    <div className="carn-page">

      {/* ── Hero ── */}
      <section className="carn-hero section-pad">
        <div className="carn-hero-inner">
          <div className="carn-hero-content">
            <p className="eyebrow">Carnations &amp; nuances</p>
            <h1 className="carn-hero-title">
              Chaque teinte est<br />
              <em>une science à part entière.</em>
            </h1>
            <p className="carn-hero-sub">
              Les peaux mélaninées ne se résument pas à une seule couleur. Ebenora distingue
              les carnations, les sous-tons chauds, froids et neutres, pour des formules
              qui respectent vraiment ton teint.
            </p>
            <div className="carn-hero-actions">
              <Link className="btn btn-primary" to="/diagnostic">
                <ScanFace size={18} />
                Trouver ma routine
              </Link>
              <a className="btn btn-secondary" href="#palette">
                <Palette size={18} />
                Voir la palette
              </a>
            </div>
          </div>

          {/* Mosaïque photos */}
          <div className="carn-hero-mosaic" aria-hidden="true">
            {tones.slice(0, 4).map((t, i) => (
              <div key={t.name} className="carn-hero-mosaic-cell" style={{ "--delay": `${i * 0.1}s` }}>
                <img
                  src={t.photo}
                  alt={t.name}
                  onError={(e) => handleImgError(e, t.color)}
                />
                <div
                  className="carn-mosaic-fallback"
                  style={{ background: t.color, display: "none" }}
                />
                <div className="carn-mosaic-label" style={{ background: t.color }}>
                  {t.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Palette interactive ── */}
      <section className="carn-palette-section section-pad" id="palette">
        <div className="carn-palette-inner">
          <div className="carn-section-head">
            <Palette size={22} className="carn-icon" />
            <div>
              <p className="eyebrow">Palette</p>
              <h2>Les carnations Ebenora.</h2>
              <p>Clique sur une carnation pour découvrir ses spécificités et nos conseils formulaires.</p>
            </div>
          </div>

          <div className="carn-palette-grid">
            {tones.map((tone, i) => (
              <button
                key={tone.name}
                className={`carn-tone-card${activeIdx === i ? " is-active" : ""}`}
                style={{ "--tone-color": tone.color }}
                onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                aria-expanded={activeIdx === i}
              >
                {/* Photo miniature */}
                <div className="carn-tone-thumb" style={{ "--tone-color": tone.color }}>
                  <img
                    src={tone.photo}
                    alt={tone.name}
                    onError={(e) => handleImgError(e, tone.color)}
                  />
                  <div
                    className="carn-thumb-fallback"
                    style={{ background: tone.color, display: "none" }}
                  />
                </div>
                <div className="carn-tone-info">
                  <strong className="carn-tone-name">{tone.name}</strong>
                  <span className="carn-tone-subtone">{tone.subTone}</span>
                </div>
                <ArrowRight
                  size={16}
                  className={`carn-tone-arrow${activeIdx === i ? " rotated" : ""}`}
                />
              </button>
            ))}
          </div>

          {/* Panneau détail */}
          {selected && (
            <div
              className="carn-tone-detail"
              style={{ "--tone-color": selected.color }}
            >
              <div className="carn-tone-detail-photo">
                <img
                  src={selected.photo}
                  alt={selected.name}
                  onError={(e) => handleImgError(e, selected.color)}
                />
                <div
                  className="carn-detail-photo-fallback"
                  style={{ background: selected.color, display: "none" }}
                />
                <div className="carn-detail-photo-overlay">
                  <span style={{ color: selected.textColor }}>{selected.name}</span>
                </div>
              </div>
              <div className="carn-tone-detail-content">
                <p className="eyebrow">{selected.subTone}</p>
                <h3>{selected.name}</h3>
                <p className="carn-detail-concern">
                  <strong>Préoccupations courantes :</strong> {selected.concern}
                </p>
                <div className="carn-detail-tip">
                  <Sparkles size={16} />
                  <p>{selected.tip}</p>
                </div>
                <Link className="btn btn-primary" to="/diagnostic" style={{ marginTop: 8 }}>
                  Voir ma routine
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Guide sous-tons ── */}
      <section className="carn-subtone-section section-pad">
        <div className="carn-subtone-inner">
          <div className="carn-section-head">
            <Droplets size={22} className="carn-icon" />
            <div>
              <p className="eyebrow">Sous-tons</p>
              <h2>Comprendre ton sous-ton.</h2>
              <p>Le sous-ton guide le choix des textures, des actifs et de l'intensité des soins.</p>
            </div>
          </div>

          <div className="carn-subtone-grid">
            {subToneGuide.map((s) => (
              <div
                key={s.label}
                className="carn-subtone-card"
                style={{ "--st-accent": s.accentColor }}
              >
                {/* Photo sous-ton */}
                <div className="carn-subtone-photo">
                  <img
                    src={s.photo}
                    alt={s.label}
                    onError={(e) => handleImgError(e, s.accentColor)}
                  />
                  <div
                    className="carn-subtone-photo-fallback"
                    style={{ background: s.accentColor, display: "none" }}
                  />
                  <div className="carn-subtone-photo-badge">
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </div>
                </div>
                <div className="carn-subtone-body">
                  <p className="carn-subtone-desc">{s.description}</p>
                  <div className="carn-subtone-guide">
                    <div className="carn-stguide-item carn-stguide-use">
                      <CheckCircle2 size={14} />
                      <div>
                        <strong>Actifs recommandés</strong>
                        <span>{s.use}</span>
                      </div>
                    </div>
                    <div className="carn-stguide-item carn-stguide-avoid">
                      <span className="carn-avoid-icon">✕</span>
                      <div>
                        <strong>À surveiller</strong>
                        <span>{s.avoid}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ingrédients clés ── */}
      <section className="carn-ingredients-section section-pad">
        <div className="carn-ingredients-inner">
          <div className="carn-section-head">
            <Sun size={22} className="carn-icon" />
            <div>
              <p className="eyebrow">Formules</p>
              <h2>Les actifs qui respectent la mélanine.</h2>
              <p>Ces ingrédients ont été sélectionnés pour leur efficacité prouvée sur les peaux foncées sans effets indésirables.</p>
            </div>
          </div>

          <div className="carn-ingredients-grid">
            {ingredients.map((ing) => (
              <div key={ing.name} className="carn-ingredient-card">
                <div className="carn-ing-top">
                  <span className="carn-ing-badge">{ing.badge}</span>
                </div>
                <h3 className="carn-ing-name">{ing.name}</h3>
                <p className="carn-ing-desc">{ing.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Diagnostic ── */}
      <section className="carn-cta-section section-pad">
        <div className="carn-cta-inner">
          <div className="carn-cta-icon">
            <ScanFace size={28} />
          </div>
          <div>
            <p className="eyebrow">Diagnostic personnalisé</p>
            <h2>Tu ne sais pas encore quel profil est le tien ?</h2>
            <p>Notre diagnostic analyse ta carnation, ton sous-ton et tes préoccupations pour te recommander la routine idéale.</p>
          </div>
          <div className="carn-cta-actions">
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
      </section>

    </div>
  );
}
