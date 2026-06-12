// src/context/AuthContext.jsx
// Auth connectée au backend — JWT persisté en localStorage.

import React, { createContext, useContext, useState } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ebenora_user") || "null"); }
    catch { return null; }
  });

  // Appelle POST /api/auth/register
  async function register({ name, email, password }) {
    const { token, user: u } = await authAPI.register({ name, email, password });
    localStorage.setItem("ebenora_token", JSON.stringify(token));
    localStorage.setItem("ebenora_user",  JSON.stringify(u));
    setUser(u);
  }

  // Appelle POST /api/auth/login
  async function loginWithAPI({ email, password }) {
    const { token, user: u } = await authAPI.login({ email, password });
    localStorage.setItem("ebenora_token", JSON.stringify(token));
    localStorage.setItem("ebenora_user",  JSON.stringify(u));
    setUser(u);
  }

  // Fallback mock (utilisé si VITE_API_URL n'est pas défini)
  function loginMock({ name, email }) {
    const u = { name, email };
    localStorage.setItem("ebenora_user", JSON.stringify(u));
    setUser(u);
  }

  function logout() {
    localStorage.removeItem("ebenora_token");
    localStorage.removeItem("ebenora_user");
    setUser(null);
  }

  // login expose les deux stratégies — le composant choisit
  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login: loginMock,       // utilisé par la page Login actuelle (mock)
      loginWithAPI,           // utilisé quand le backend est prêt
      register,               // utilisé quand le backend est prêt
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
