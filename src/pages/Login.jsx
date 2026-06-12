// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { authAPI } from "../services/api.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/compte";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = "L'adresse email est requise.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Adresse email invalide.";
    if (!form.password) e.password = "Le mot de passe est requis.";
    else if (form.password.length < 6) e.password = "Minimum 6 caractères.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError("");
    try {
      const { token, user } = await authAPI.login({ email: form.email, password: form.password });
      localStorage.setItem("ebenora_token", JSON.stringify(token));
      login({ name: user.name, email: user.email });
      navigate(redirect);
    } catch (err) {
      setApiError(err.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    if (apiError) setApiError("");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-logo">
            <img src="/logo-transparent.png" alt="Ebenora" onError={(e) => { e.target.style.display="none"; }} />
          </div>
          <h1>Ravie de te revoir.</h1>
          <p>Connecte-toi pour finaliser ta commande et accéder à ton espace beauté.</p>
        </div>

        {redirect === "/commander" && (
          <div className="auth-redirect-notice">
            <Sparkles size={14} />
            <span>Connecte-toi pour passer ta commande</span>
          </div>
        )}

        {apiError && (
          <div className="auth-api-error">
            {apiError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label">Adresse email</label>
            <input
              className={`auth-input${errors.email ? " is-error" : ""}`}
              type="email" name="email" placeholder="ton@email.fr"
              value={form.email} onChange={handleChange} autoComplete="email"
            />
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label">Mot de passe</label>
              <button type="button" className="auth-forgot">Mot de passe oublié ?</button>
            </div>
            <div className="auth-input-wrap">
              <input
                className={`auth-input${errors.password ? " is-error" : ""}`}
                type={showPwd ? "text" : "password"} name="password"
                placeholder="••••••••" value={form.password} onChange={handleChange} autoComplete="current-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPwd(!showPwd)} aria-label="Afficher le mot de passe">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          <button type="submit" className={`btn btn-primary auth-submit${loading ? " is-loading" : ""}`} disabled={loading}>
            {loading ? "Connexion…" : <><LogIn size={16} /> Se connecter</>}
          </button>
        </form>

        <div className="auth-divider"><span>ou</span></div>

        <p className="auth-switch">
          Pas encore de compte ?{" "}
          <Link to={`/inscription${redirect !== "/compte" ? `?redirect=${redirect}` : ""}`}>
            Créer un compte <ArrowRight size={13} />
          </Link>
        </p>
      </div>
    </div>
  );
}
