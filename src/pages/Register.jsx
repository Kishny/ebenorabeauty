// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Sparkles, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { authAPI } from "../services/api.js";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/compte";

  const [form, setForm] = useState({ name: "", email: "", password: "", skinType: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Le prénom est requis.";
    if (!form.email.trim()) e.email = "L'adresse email est requise.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Adresse email invalide.";
    if (!form.password) e.password = "Le mot de passe est requis.";
    else if (form.password.length < 8) e.password = "Minimum 8 caractères.";
    return e;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    if (apiError) setApiError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError("");
    try {
      const { token, user } = await authAPI.register({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
        skinType: form.skinType || null,
      });
      localStorage.setItem("ebenora_token", JSON.stringify(token));
      login({ name: user.name, email: user.email, skinType: user.skinType });
      navigate(redirect);
    } catch (err) {
      setApiError(err.message || "Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-logo">
            <img src="/logo-transparent.png" alt="Ebenora" onError={(e) => { e.target.style.display="none"; }} />
          </div>
          <h1>Crée ton profil beauté.</h1>
          <p>Ton compte te permet de passer commande et de sauvegarder routines, diagnostics et favoris.</p>
        </div>

        {redirect === "/commander" && (
          <div className="auth-redirect-notice">
            <Sparkles size={14} />
            <span>Crée ton compte pour finaliser ta commande</span>
          </div>
        )}

        {apiError && (
          <div className="auth-api-error">{apiError}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label">Prénom</label>
            <input className={`auth-input${errors.name ? " is-error" : ""}`}
              type="text" name="name" placeholder="Ton prénom"
              value={form.name} onChange={handleChange} autoComplete="given-name" />
            {errors.name && <p className="auth-error">{errors.name}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Adresse email</label>
            <input className={`auth-input${errors.email ? " is-error" : ""}`}
              type="email" name="email" placeholder="ton@email.fr"
              value={form.email} onChange={handleChange} autoComplete="email" />
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Mot de passe</label>
            <div className="auth-input-wrap">
              <input className={`auth-input${errors.password ? " is-error" : ""}`}
                type={showPwd ? "text" : "password"} name="password"
                placeholder="8 caractères minimum" value={form.password} onChange={handleChange} autoComplete="new-password" />
              <button type="button" className="auth-eye" onClick={() => setShowPwd(!showPwd)} aria-label="Afficher">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Mon type de peau <span className="auth-optional">(optionnel)</span></label>
            <select className="auth-input" name="skinType" value={form.skinType} onChange={handleChange}>
              <option value="">Je ne sais pas encore…</option>
              <option value="Peau grasse">Peau grasse — brillance & sébum</option>
              <option value="Peau mixte">Peau mixte — zone T grasse</option>
              <option value="Peau sèche">Peau sèche — tiraillements</option>
              <option value="Peau déshydratée">Peau déshydratée — manque d'eau</option>
              <option value="Peau sensible">Peau sensible — rougeurs</option>
              <option value="Acné & imperfections">Acné & imperfections</option>
              <option value="Pilosité faciale">Pilosité faciale</option>
            </select>
            <p className="auth-field-hint">Tu peux aussi faire le diagnostic après l'inscription.</p>
          </div>

          <button type="submit" className={`btn btn-primary auth-submit${loading ? " is-loading" : ""}`} disabled={loading}>
            {loading ? "Création…" : <><UserPlus size={16} /> Créer mon compte</>}
          </button>
        </form>

        <div className="auth-divider"><span>ou</span></div>

        <p className="auth-switch">
          Déjà inscrite ?{" "}
          <Link to={`/connexion${redirect !== "/compte" ? `?redirect=${redirect}` : ""}`}>
            Se connecter <ArrowRight size={13} />
          </Link>
        </p>
      </div>
    </div>
  );
}
