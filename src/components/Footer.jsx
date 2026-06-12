// src/components/Footer.jsx
// Footer premium — logo, colonnes de liens, réseaux sociaux, trust bar, copyright.

import React from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Globe,
  Leaf,
  Mail,
  Play,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

const NAV_COLS = [
  {
    title: "Boutique",
    links: [
      { label: "Tous les soins",          to: "/boutique" },
      { label: "Soins visage",            to: "/boutique" },
      { label: "Corps & glow",            to: "/boutique" },
      { label: "Maquillage",              to: "/boutique" },
      { label: "Compléments",             to: "/boutique" },
    ],
  },
  {
    title: "Conseils",
    links: [
      { label: "Diagnostic peau",         to: "/diagnostic" },
      { label: "Routines",                to: "/routines" },
      { label: "Carnations & nuances",    to: "/carnations" },
      { label: "Guide peau",              to: "/guide-peau" },
    ],
  },
  {
    title: "Ebenora",
    links: [
      { label: "À propos",                to: "/a-propos" },
      { label: "Contact",                 to: "/contact" },
      { label: "FAQ",                     to: "/faq" },
      { label: "Mentions légales",        to: "/mentions-legales" },
    ],
  },
];

const TRUST = [
  { icon: Truck,      text: "Livraison offerte dès 50 €" },
  { icon: RefreshCw,  text: "Retours 30 jours" },
  { icon: Leaf,       text: "Formules clean" },
  { icon: ShieldCheck,text: "Paiement sécurisé" },
];

const SOCIALS = [
  {
    label: "Instagram",
    icon: Camera,
    href: "https://instagram.com",
  },
  {
    label: "YouTube",
    icon: Play,
    href: "https://youtube.com",
  },
  {
    label: "Site",
    icon: Globe,
    href: "/",
  },
  {
    label: "Email",
    icon: Mail,
    href: "mailto:contact@ebenora.fr",
  },
];

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── Trust bar ── */}
      <div className="footer-trust">
        {TRUST.map(({ icon: Icon, text }) => (
          <div className="footer-trust-item" key={text}>
            <Icon size={16} />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* ── Corps principal ── */}
      <div className="footer-body">

        {/* Colonne marque */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-logo-link" aria-label="Retour à l'accueil">
            <img
              src="/logo-transparent.png"
              alt="Ebenora Beauty"
              className="footer-logo"
            />
          </Link>

          <p className="footer-tagline">
            Des soins pensés pour les peaux noires, brunes et ébènes — leurs
            carnations, leurs besoins et leur éclat naturel.
          </p>

          {/* Réseaux sociaux */}
          <div className="footer-socials">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                className="footer-social-btn"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Colonnes de liens */}
        {NAV_COLS.map((col) => (
          <div className="footer-nav-col" key={col.title}>
            <h4 className="footer-col-title">{col.title}</h4>
            <ul className="footer-col-links">
              {col.links.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* ── Barre de bas ── */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © {new Date().getFullYear()} Ebenora Beauty. Tous droits réservés.
        </p>
        <div className="footer-bottom-links">
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>

    </footer>
  );
}
