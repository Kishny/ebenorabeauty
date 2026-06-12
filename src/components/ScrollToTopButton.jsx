// src/components/ScrollToTopButton.jsx
// Bouton global pour remonter en haut de page.
// Il apparaît seulement quand l'utilisateur descend suffisamment dans la page.

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  // État qui indique si le bouton doit être visible ou non.
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Affiche le bouton après 500px de scroll.
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility);

    // Nettoyage de l'écouteur pour éviter les bugs mémoire.
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Fonction appelée au clic pour remonter en haut avec animation douce.
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      className={`scroll-top-button ${isVisible ? "is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Remonter en haut de la page"
      title="Remonter en haut"
    >
      <ArrowUp size={22} />
    </button>
  );
}