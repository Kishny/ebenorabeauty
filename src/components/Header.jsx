// src/components/Header.jsx
// Header mobile-first avec menu burger.
// Le menu desktop apparaît uniquement sur les grands écrans.

import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { count } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Liens principaux du site.
  const navLinks = [
    { label: "Boutique", path: "/boutique" },
    { label: "Diagnostic", path: "/diagnostic" },
    { label: "Routines", path: "/routines" },
    { label: "Carnations", path: "/carnations" },
    { label: "Guide peau", path: "/guide-peau" },
  ];

  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="Retour à l'accueil">
        <img
          src="/logo-transparent.png"
          alt="Ebenora Beauty"
          className="brand-logo"
        />
      </Link>

      <nav className="desktop-nav" aria-label="Navigation principale">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="icon-button cart-icon-button" to="/panier" aria-label={`Panier (${count} article${count !== 1 ? "s" : ""})`}>
          <ShoppingBag size={19} />
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>

        {isLoggedIn ? (
          <div className="header-user">
            <Link className="header-user-name" to="/compte" aria-label="Mon compte">
              <UserRound size={17} />
              <span>{user.name}</span>
            </Link>
            <button type="button" className="icon-button header-logout" onClick={handleLogout} aria-label="Déconnexion">
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <Link className="icon-button" to="/connexion" aria-label="Connexion">
            <UserRound size={19} />
          </Link>
        )}

        <button
          className="menu-button"
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      {isOpen && (
        <nav className="mobile-drawer" aria-label="Navigation mobile">
          <button
            className="drawer-close"
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setIsOpen(false)}
          >
            <X size={22} />
          </button>

          <div className="mobile-drawer-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive ? "mobile-nav-link active" : "mobile-nav-link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <Link
            className="drawer-cta"
            to="/diagnostic"
            onClick={() => setIsOpen(false)}
          >
            Faire mon diagnostic
          </Link>
        </nav>
      )}
    </header>
  );
}
