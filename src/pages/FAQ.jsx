// src/pages/FAQ.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Mail, ScanFace } from "lucide-react";

const FAQS = [
  {
    cat: "Produits",
    items: [
      { q: "Les produits conviennent-ils aux peaux sensibles ?", a: "Oui. Toutes nos formules sont testées pour les peaux sensibles mélaninées. La Crème Sensitive Melanin est spécifiquement conçue pour les peaux réactives. En cas de doute, teste sur une petite zone pendant 48h avant d'utiliser sur tout le visage." },
      { q: "Est-ce que vos produits conviennent aux hommes aussi ?", a: "Absolument. Les problématiques de peau — sébum, acné, déshydratation — ne sont pas genrées. Nos soins s'adaptent à tous les profils, y compris les hommes aux peaux mélaninées." },
      { q: "Vos formules sont-elles vegan et cruelty-free ?", a: "Tous nos produits sont non testés sur les animaux. La majorité de nos formules sont vegan — vérifiez la fiche produit pour les détails spécifiques à chaque soin." },
      { q: "Peut-on utiliser plusieurs produits ensemble ?", a: "Oui, nos produits sont conçus pour fonctionner en synergie. Le diagnostic te guide sur les associations recommandées selon ton type de peau et tes besoins." },
    ],
  },
  {
    cat: "Diagnostic & Routines",
    items: [
      { q: "Le diagnostic est-il vraiment personnalisé ?", a: "Le diagnostic analyse ton type de peau, ta carnation, tes problématiques principales et tes priorités beauté. Il te renvoie vers la routine et les produits les plus adaptés à ton profil mélaninée." },
      { q: "Combien de temps dure le diagnostic ?", a: "Environ 1 minute. 4 questions ciblées, pas de formulaire interminable. Tu obtiens ton résultat immédiatement avec ta routine complète." },
      { q: "Est-ce que je peux refaire le diagnostic si ma peau change ?", a: "Oui, et on te le recommande. La peau évolue avec les saisons, le stress, l'alimentation. Refaire le diagnostic tous les 3-6 mois permet d'ajuster ta routine." },
    ],
  },
  {
    cat: "Commandes & Livraison",
    items: [
      { q: "Quels sont les délais de livraison ?", a: "Livraison standard en 3-5 jours ouvrés. La livraison est offerte à partir de 50 € d'achat. Pour les commandes inférieures, les frais de port sont de 4,90 €." },
      { q: "Puis-je retourner un produit ?", a: "Oui, tu as 30 jours pour retourner tout produit non ouvert dans son emballage d'origine. Le remboursement est effectué sous 5-7 jours ouvrés après réception du retour." },
      { q: "Comment utiliser un code promo ?", a: "Saisis ton code dans le champ \"Code promo\" dans le récapitulatif du panier, puis clique sur Appliquer. Codes actuels : EBENORA10 (−10 %) et BIENVENUE (−15 %)." },
    ],
  },
  {
    cat: "Compte & Données",
    items: [
      { q: "Mes données personnelles sont-elles protégées ?", a: "Oui. Conformément au RGPD, tes données ne sont jamais vendues à des tiers. Tu peux demander leur suppression à tout moment via la page Contact." },
      { q: "Comment modifier mon adresse de livraison ?", a: "Connecte-toi à ton compte client, accède à Paramètres et modifie l'adresse souhaitée. Si ta commande est déjà expédiée, contacte-nous rapidement via le formulaire de contact." },
    ],
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " is-open" : ""}`}>
      <button type="button" className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <ChevronDown size={18} className="faq-chevron" />
      </button>
      {open && <div className="faq-answer"><p>{a}</p></div>}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="faq-page">
      <section className="faq-hero section-pad">
        <div className="faq-hero-inner">
          <p className="eyebrow">Aide & FAQ</p>
          <h1>Questions fréquentes.</h1>
          <p>Tout ce que tu dois savoir sur les produits, les routines, les commandes et le diagnostic.</p>
        </div>
      </section>

      <section className="faq-body section-pad">
        <div className="faq-layout">
          <div className="faq-cols">
            {FAQS.map((cat) => (
              <div className="faq-cat" key={cat.cat}>
                <h2 className="faq-cat-title">{cat.cat}</h2>
                <div className="faq-items">
                  {cat.items.map((item) => (
                    <FaqItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="faq-aside">
            <div className="faq-aside-card">
              <Mail size={22} />
              <h3>Tu n'as pas trouvé ta réponse ?</h3>
              <p>Notre équipe répond sous 24h ouvrées.</p>
              <Link className="btn btn-primary" to="/contact">Nous contacter <ArrowRight size={15} /></Link>
            </div>
            <div className="faq-aside-card faq-aside-diag">
              <ScanFace size={22} />
              <h3>Trouve ta routine en 1 min</h3>
              <p>Le diagnostic identifie ton profil et te recommande les soins adaptés.</p>
              <Link className="btn btn-secondary" to="/diagnostic">Faire le diagnostic <ArrowRight size={15} /></Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
