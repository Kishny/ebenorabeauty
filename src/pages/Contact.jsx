// src/pages/Contact.jsx
import React, { useState } from "react";
import { CheckCircle2, Clock, Mail, MapPin, MessageSquare } from "lucide-react";

const INFOS = [
  { icon: Mail,          label: "Email",          value: "contact@ebenora.fr" },
  { icon: Clock,         label: "Réponse sous",   value: "24h ouvrées" },
  { icon: MessageSquare, label: "Réseaux",         value: "@ebenorabeauty" },
  { icon: MapPin,        label: "Basé à",          value: "France" },
];

const SUBJECTS = [
  "Question sur un produit",
  "Ma commande",
  "Retour / remboursement",
  "Le diagnostic",
  "Partenariat / presse",
  "Autre",
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Le prénom est requis.";
    if (!form.email.trim()) e.email = "L'adresse email est requise.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Adresse email invalide.";
    if (!form.subject) e.subject = "Choisis un sujet.";
    if (!form.message.trim()) e.message = "Le message est requis.";
    else if (form.message.trim().length < 10) e.message = "Message trop court (10 caractères min.).";
    return e;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="contact-success section-pad">
        <div className="contact-success-inner">
          <CheckCircle2 size={40} />
          <h2>Message envoyé !</h2>
          <p>Merci <strong>{form.name}</strong>. On te répond sous 24h ouvrées à l'adresse <strong>{form.email}</strong>.</p>
          <button type="button" className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ name:"", email:"", subject:"", message:"" }); }}>
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <section className="contact-hero section-pad">
        <p className="eyebrow">Contacte-nous</p>
        <h1>On est là pour toi.</h1>
        <p>Une question sur un produit, une commande ou une collaboration — écris-nous.</p>
      </section>

      <section className="contact-body section-pad">
        <div className="contact-layout">

          <aside className="contact-infos">
            {INFOS.map(({ icon: Icon, label, value }) => (
              <div className="contact-info-item" key={label}>
                <div className="contact-info-icon"><Icon size={18} /></div>
                <div>
                  <p className="contact-info-label">{label}</p>
                  <p className="contact-info-value">{value}</p>
                </div>
              </div>
            ))}
            <div className="contact-info-note">
              <p>Pour les questions urgentes concernant une commande, indique ton numéro de commande dans le message.</p>
            </div>
          </aside>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form-row">
              <div className="contact-field">
                <label className="contact-label">Prénom *</label>
                <input className={`contact-input${errors.name ? " is-error" : ""}`} type="text" name="name" placeholder="Ton prénom" value={form.name} onChange={handleChange} />
                {errors.name && <p className="contact-error">{errors.name}</p>}
              </div>
              <div className="contact-field">
                <label className="contact-label">Email *</label>
                <input className={`contact-input${errors.email ? " is-error" : ""}`} type="email" name="email" placeholder="ton@email.fr" value={form.email} onChange={handleChange} />
                {errors.email && <p className="contact-error">{errors.email}</p>}
              </div>
            </div>

            <div className="contact-field">
              <label className="contact-label">Sujet *</label>
              <select className={`contact-input${errors.subject ? " is-error" : ""}`} name="subject" value={form.subject} onChange={handleChange}>
                <option value="">Choisir un sujet…</option>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.subject && <p className="contact-error">{errors.subject}</p>}
            </div>

            <div className="contact-field">
              <label className="contact-label">Message *</label>
              <textarea className={`contact-input contact-textarea${errors.message ? " is-error" : ""}`} name="message" placeholder="Décris ta question ou ta demande…" rows={5} value={form.message} onChange={handleChange} />
              {errors.message && <p className="contact-error">{errors.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary contact-submit">
              Envoyer le message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
