// src/main.jsx
// Point d'entrée principal de l'application React.
// On configure ici React Router pour gérer toutes les pages du site.

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Style global mobile-first.
import "./styles.css";

// Layout global.
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";

// Pages principales.
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Diagnostic from "./pages/Diagnostic.jsx";
import Routines from "./pages/Routines.jsx";
import RoutineDetail from "./pages/RoutineDetail.jsx";
import Carnations from "./pages/Carnations.jsx";
import SkinGuide from "./pages/SkinGuide.jsx";
import AppMobile from "./pages/AppMobile.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Cart from "./pages/Cart.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import FAQ from "./pages/FAQ.jsx";
import Legal from "./pages/Legal.jsx";
import NotFound from "./pages/NotFound.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";

// Composant qui contient toute la structure du site.
function App() {
  return (
    <AuthProvider>
    <CartProvider>
    <BrowserRouter>
      {/* Header visible sur toutes les pages. */}
      <Header />

      {/* Contenu principal du site. */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/boutique" element={<Shop />} />
          <Route path="/produit/:slug" element={<ProductDetail />} />

          <Route path="/diagnostic" element={<Diagnostic />} />

          <Route path="/routines" element={<Routines />} />
          <Route path="/routines/:slug" element={<RoutineDetail />} />

          <Route path="/carnations" element={<Carnations />} />
          <Route path="/guide-peau" element={<SkinGuide />} />
          <Route path="/app-mobile" element={<AppMobile />} />

          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/panier" element={<Cart />} />
          <Route path="/compte" element={<Account />} />

          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/commander" element={<Checkout />} />
          <Route path="/commande/:id" element={<OrderDetail />} />

          <Route path="/faq" element={<FAQ />} />
          <Route path="/mentions-legales" element={<Legal />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer visible sur toutes les pages. */}
      <Footer />

      {/* Bouton global pour remonter en haut de page.
          Il apparaît après scroll et fonctionne sur toutes les pages. */}
      <ScrollToTopButton />
    </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
