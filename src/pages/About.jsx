// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Heart, Leaf, ScanFace, ShieldCheck, Sparkles } from "lucide-react";

const VALUES = [
  { icon: Heart,      title: "Inclusion radicale",  text: "Chaque soin est conçu en pensant d'abord aux femmes noires, brunes et ébènes — pas en adaptation après-coup." },
  { icon: Leaf,       title: "Formules clean",       text: "Pas de parabènes, pas de silicones occlusifs, pas d'ingrédients qui grissent ou ternissent les carnations foncées." },
  { icon: ShieldCheck,title: "Transparence totale",  text: "On t'explique pourquoi chaque ingrédient est là, ce qu'il fait sur les peaux mélaninées, et ce qu'il ne fait pas." },
  { icon: Award,      title: "Expertise mélaninée",  text: "Les formules intègrent les spécificités des peaux foncées : hyperpigmentation, sensibilité au sébum, réactivité aux actifs agressifs." },
];

const STATS = [
  { value: "40+",  label: "Carnations étudiées" },
  { value: "26",   label: "Produits formulés" },
  { value: "700+", label: "Avis vérifiés" },
  { value: "4,8★", label: "Note moyenne" },
];

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero section-pad">
        <div className="about-hero-inner">
          <div className="about-hero-content">
            <p className="eyebrow">À propos d'Ebenora</p>
            <h1>Une marque construite autour des peaux mélaninées.</h1>
            <p className="about-hero-text">Ebenora est née d'un constat simple : les femmes noires, brunes et ébènes manquent de soins pensés réellement pour elles. Pas des reformulations, pas des teintes "inclusives" ajoutées en bout de gamme. De vraies formules, pour de vraies peaux.</p>
            <div className="about-hero-actions">
              <Link className="btn btn-primary" to="/boutique">Découvrir les soins <ArrowRight size={17} /></Link>
              <Link className="btn btn-secondary" to="/diagnostic"><ScanFace size={16} /> Faire mon diagnostic</Link>
            </div>
          </div>
          <div className="about-hero-visual">
            <img src="/images/routine/pexels-oluwatimilehin-falusi-2157505077-34819899.jpg" alt="Deux femmes noires à la peau lumineuse" className="about-hero-img" onError={(e) => { e.target.style.display="none"; }} />
          </div>
        </div>
      </section>

      <div className="about-stats-bar">
        {STATS.map(({ value, label }) => (
          <div className="about-stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className="about-mission section-pad">
        <div className="about-mission-inner">
          <div className="about-mission-text">
            <p className="eyebrow">Notre mission</p>
            <h2>Remettre les peaux foncées au centre.</h2>
            <p>La cosmétique mainstream a longtemps ignoré les besoins spécifiques des peaux mélaninées. L'hyperpigmentation post-inflammatoire, les taches laissées par l'acné, la réactivité au sébum — autant de problématiques traitées comme des cas particuliers.</p>
            <p>Chez Ebenora, c'est le point de départ. Chaque produit naît d'une question : est-ce que ça fonctionne sur les peaux noires ? Est-ce que ça respecte la mélanine ? Est-ce que ça sublimera une carnation ébène ?</p>
          </div>
          <div className="about-mission-img">
            <img src="/images/routine/pexels-kingbiggie-11535807.jpg" alt="Femmes noires ébènes" onError={(e) => { e.target.style.display="none"; }} />
          </div>
        </div>
      </section>

      <section className="about-values section-pad">
        <div className="about-values-inner">
          <div className="about-values-head">
            <p className="eyebrow">Ce en quoi on croit</p>
            <h2>Nos valeurs.</h2>
          </div>
          <div className="about-values-grid">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div className="about-value-card" key={title}>
                <div className="about-value-icon"><Icon size={20} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta section-pad">
        <div className="about-cta-inner">
          <Sparkles size={28} />
          <h2>Prête à prendre soin de ta peau ?</h2>
          <p>Commence par le diagnostic — 1 minute pour identifier ton profil et ta routine idéale.</p>
          <div className="about-cta-actions">
            <Link className="btn btn-primary" to="/diagnostic"><ScanFace size={17} /> Faire mon diagnostic</Link>
            <Link className="btn btn-secondary" to="/boutique">Voir la boutique <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
