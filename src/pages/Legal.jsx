// src/pages/Legal.jsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const SECTIONS = [
  {
    title: "Éditeur du site",
    content: `Le site ebenora.fr est édité par Ebenora Beauty, marque enregistrée en France.
Email : contact@ebenora.fr

Le directeur de la publication est le représentant légal d'Ebenora Beauty.`,
  },
  {
    title: "Hébergement",
    content: `Le site est hébergé par un prestataire d'hébergement professionnel établi en Europe, conforme aux réglementations RGPD.`,
  },
  {
    title: "Propriété intellectuelle",
    content: `L'ensemble des contenus présents sur le site ebenora.fr (textes, images, vidéos, logos, icônes, données) sont la propriété exclusive d'Ebenora Beauty et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.

Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle, du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite sans l'autorisation expresse et préalable d'Ebenora Beauty.`,
  },
  {
    title: "Données personnelles & RGPD",
    content: `Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.

Les données collectées (nom, email, adresse) sont utilisées exclusivement pour le traitement de vos commandes et l'envoi de communications liées à votre compte. Elles ne sont jamais vendues à des tiers.

Pour exercer vos droits ou pour toute question : contact@ebenora.fr`,
  },
  {
    title: "Cookies",
    content: `Le site utilise des cookies techniques nécessaires à son bon fonctionnement (session, panier). Aucun cookie publicitaire ou de traçage tiers n'est utilisé sans votre consentement explicite.

Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités du site.`,
  },
  {
    title: "Conditions générales de vente",
    content: `Les présentes CGV s'appliquent à toutes les commandes passées sur ebenora.fr.

Prix : Tous les prix sont indiqués en euros TTC. Ebenora Beauty se réserve le droit de modifier ses prix à tout moment, les produits étant facturés au tarif en vigueur lors de la validation de la commande.

Livraison : La livraison est effectuée à l'adresse indiquée lors de la commande. Les délais standard sont de 3 à 5 jours ouvrés.

Retours : Vous disposez de 30 jours à compter de la réception pour retourner tout produit non ouvert dans son emballage d'origine.

Garantie légale : Conformément aux articles L.217-4 et suivants du Code de la consommation, Ebenora Beauty est tenu aux garanties légales de conformité et des vices cachés.`,
  },
  {
    title: "Responsabilité",
    content: `Ebenora Beauty s'efforce d'assurer l'exactitude des informations diffusées sur le site. Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le site.

Les conseils beauté et routines présentés sur le site sont donnés à titre informatif et ne remplacent pas l'avis d'un dermatologue. En cas de réaction cutanée, cessez l'utilisation du produit et consultez un médecin.`,
  },
];

function Section({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`legal-section${open ? " is-open" : ""}`}>
      <button type="button" className="legal-section-btn" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <ChevronDown size={18} className="legal-chevron" />
      </button>
      {open && (
        <div className="legal-section-body">
          {content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Legal() {
  return (
    <div className="legal-page">
      <section className="legal-hero section-pad">
        <p className="eyebrow">Informations légales</p>
        <h1>Mentions légales & CGV.</h1>
        <p className="legal-hero-date">Dernière mise à jour : juin 2026</p>
      </section>

      <section className="legal-body section-pad">
        <div className="legal-inner">
          <p className="legal-intro">
            Ces mentions légales régissent l'utilisation du site ebenora.fr et l'achat de produits Ebenora Beauty.
            En naviguant sur ce site, vous acceptez les présentes conditions.
          </p>
          <div className="legal-sections">
            {SECTIONS.map((s) => (
              <Section key={s.title} title={s.title} content={s.content} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
