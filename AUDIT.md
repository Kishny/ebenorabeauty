# Audit technique & produit — Ebenora Beauty
> Analyse complète du dépôt · Juin 2026

---

## Vue d'ensemble

**Stack :** React 19 · React Router 7 · Vite · Framer Motion · Lucide React · CSS custom (2 600 lignes)  
**Statut :** Prototype fonctionnel, front-end uniquement. Aucun backend, aucun état global, aucune vraie logique métier.

---

## 1. Ce qui fonctionne bien

- **Design system cohérent.** La palette (`#601521`, `#FFF7F2`, `#F0BA87`), les tokens CSS, les rayons et les ombres sont bien définis et utilisés de manière uniforme. Le look premium est réel.
- **Architecture de routes claire.** `main.jsx` est lisible, toutes les routes sont centralisées, les slugs sont bien pensés (`/produit/:slug`, `/routines/:slug`).
- **Mobile-first assumé.** Le CSS utilise des breakpoints cohérents, les images utilisent `<picture>` avec sources multiples, les layouts sont en `grid` avec `gap`.
- **Accessibilité de base.** `aria-label` sur le header/panier/menu, `type="button"` explicite partout (sauf les formulaires), `alt` renseigné sur les images.
- **Composant `ProductCard` réutilisable.** Utilisé proprement dans `Shop.jsx`.
- **`ScrollToTopButton`** bien implémenté avec nettoyage d'event listener.
- **`index.html`** : `lang="fr"`, `meta description`, `theme-color`, `viewport` — les bases SEO sont là.

---

## 2. Problèmes critiques (bloquants pour un lancement)

### 2.1 Pas de panier fonctionnel
`Cart.jsx` est vide — juste un `PageHero` avec un commentaire TODO. Les boutons "Ajouter au panier" dans `Home.jsx` et `ProductDetail.jsx` ont un `type="button"` mais **aucun handler `onClick`**. Aucun `Context`, aucun `useState` global. Le panier n'existe pas.

**Impact :** Aucune vente possible.

**Solution minimale :** Créer un `CartContext` avec `addToCart`, `removeFromCart`, `items`. Connecter les boutons. Afficher le contenu dans `Cart.jsx`.

---

### 2.2 Formulaires non fonctionnels
`Login.jsx`, `Register.jsx` et `Contact.jsx` ont des `<form>` avec un bouton `type="button"` qui ne fait rien. Aucun `onSubmit`, aucune validation, aucun état local.

**Impact :** Connexion/inscription/contact impossibles.

**Solution minimale :** `useState` pour chaque champ + `onSubmit` sur le `<form>` (passer le bouton à `type="submit"`) + validation basique.

---

### 2.3 Diagnostic trop sommaire
Seulement 3 questions, et le résultat affiché est littéralement la concaténation des réponses avec un texte générique hardcodé. Il n'y a aucune logique de recommandation.

**Impact :** C'est présenté comme la fonctionnalité centrale du site — si elle déçoit, tout le positionnement tombe.

**Solution :** Ajouter une table de correspondance `réponses → routine recommandée` et linker vers `/routines/:slug`. Les données `routines` existent déjà dans `products.js`.

---

### 2.4 Pas de route 404
Si l'utilisatrice entre une URL inconnue (ex: `/toto`), React Router n'affiche rien — pas de message, pas de redirection.

**Solution :** Ajouter `<Route path="*" element={<NotFound />} />` dans `main.jsx`.

---

### 2.5 `dist/` committé sans `.gitignore`
Le dossier `dist/` (build de production) est présent dans le dépôt et il n'y a **pas de `.gitignore`**. Cela alourdit le repo, crée des conflits et est une mauvaise pratique.

**Solution :** Créer un `.gitignore` avec au minimum : `node_modules/`, `dist/`, `.DS_Store`.

---

## 3. Problèmes importants (à corriger avant tout lancement)

### 3.1 Framer Motion installé mais jamais utilisé
`framer-motion` est dans les dépendances (version `^12.40.0`) mais **aucun import** dans tout le code source. C'est ~40 Ko de JS ajouté au bundle inutilement.

**Solution :** Soit l'utiliser pour les animations de page / transitions de carte, soit le retirer de `package.json`.

---

### 3.2 TypeScript déclaré, projet en JSX pur
`typescript` est dans les `dependencies` (pas même en `devDependencies`). Aucun fichier `.ts` ou `.tsx` n'existe, pas de `tsconfig.json`, pas de vérification de types. C'est du poids inutile.

**Solution :** Soit migrer vers TypeScript proprement (recommandé), soit supprimer la dépendance.

---

### 3.3 Dépendances de dev dans `dependencies`
`@vitejs/plugin-react`, `typescript` et `vite` sont dans `dependencies` au lieu de `devDependencies`. Ils ne doivent pas être embarqués dans un bundle de production.

---

### 3.4 Pas de `vite.config.js`
Il n'y a aucun fichier de config Vite. Le projet tourne avec les defaults, ce qui empêche tout paramétrage : alias de chemin (`@/components/...`), chunking du bundle, variables d'environnement, etc.

---

### 3.5 Images produits absentes dans `ProductCard` et `ProductDetail`
`ProductCard.jsx` utilise un `<div className="bottle" />` stylistique comme visuel produit, et non une vraie image. `ProductDetail.jsx` fait pareil. Les vraies images produits existent dans `/public/images/products/` mais **ne sont pas utilisées dans ces composants**.

À l'inverse, `Home.jsx` hardcode les chemins d'images directement dans le JSX, **dupliquant des données déjà présentes dans `products.js`**.

**Solution :** Ajouter un champ `image` dans le data model de chaque produit dans `products.js`, et utiliser `product.image` dans `ProductCard` et `ProductDetail`.

---

### 3.6 Moitié des pages sont des stubs vides
Ces pages contiennent uniquement un `<PageHero>` ou une `<PageHero>` + un bloc générique :

| Page | Contenu réel |
|------|-------------|
| `About.jsx` | Zéro — juste un PageHero |
| `Legal.jsx` | Zéro — juste un PageHero |
| `Account.jsx` | Zéro — juste un PageHero |
| `SkinGuide.jsx` | Un cloud de mots-clés |
| `AppMobile.jsx` | 4 icônes avec textes |
| `RoutineDetail.jsx` | "Matin / Soir" avec des phrases génériques identiques pour toutes les routines |
| `FAQ.jsx` | 2 questions hardcodées |

---

### 3.7 Aucune gestion du `<title>` par page
Toutes les pages affichent le même titre dans l'onglet : "Ebenora Beauty — Beauty made for melanin". Mauvais pour le SEO et l'UX.

**Solution :** Utiliser `document.title` dans un `useEffect` par page, ou mieux, une lib légère comme `react-helmet-async`.

---

### 3.8 Font-weight non standard
Le CSS utilise `font-weight: 850`, `900`, `950`. Inter ne supporte que jusqu'à `900`. Ces valeurs sont silencieusement ignorées ou arrondies selon le navigateur.

---

### 3.9 Menu mobile sans trap focus ni touche Échap
Quand le menu mobile est ouvert, il est possible de tabber en dehors. La touche Échap ne ferme pas le menu. Impacte l'accessibilité clavier.

---

## 4. Dette technique (à planifier)

### 4.1 `styles.css` monolithique de 2 600 lignes
Un seul fichier CSS pour tout le site. Difficile à maintenir, pas de colocation avec les composants, beaucoup de classes mortes probables (ex: `.image-category-card`, `.image-category-grid` qui semblent abandonnées).

**Recommandation :** Migrer vers CSS Modules ou Tailwind CSS (cohérent avec la stack Vite/React).

---

### 4.2 Données produits / routines mal organisées
Les `routines` sont exportées depuis `products.js`. Ce fichier gère deux entités distinctes. Les données produits manquent de champs (`image`, `ingredients`, `stock`, `badges`).

**Recommandation :** Séparer en `src/data/products.js` et `src/data/routines.js`. Ajouter les champs manquants pour ne pas devoir les hardcoder dans les pages.

---

### 4.3 Pas d'Error Boundary
Si un composant throw une erreur JS, l'application entière plante avec un écran blanc. Aucun fallback.

**Solution :** Un `ErrorBoundary` en wrapping de `<Routes>` dans `main.jsx`.

---

### 4.4 Pas de lazy loading des routes
Toutes les pages sont importées et bundlées ensemble dans `main.jsx`. Pour 18 routes, c'est acceptable maintenant, mais ça ne passera pas à l'échelle.

**Solution :** `React.lazy` + `Suspense` pour les pages non critiques.

---

### 4.5 Images non optimisées
Les images sont des PNG livrées en taille originale. Pas de format WebP, pas de `srcset` pour les densités d'écran, pas de `width`/`height` explicites (risque de layout shift).

---

### 4.6 `theme-color` incorrect
`index.html` déclare `<meta name="theme-color" content="#0A0A0A">` (noir) alors que la couleur primaire de la marque est `#601521` (bordeaux). Incohérence visuelle sur mobile.

---

## 5. Résumé des priorités

| Priorité | Action |
|----------|--------|
| 🔴 P0 | Implémenter le panier (CartContext + UI) |
| 🔴 P0 | Rendre les formulaires fonctionnels (validation + soumission) |
| 🔴 P0 | Ajouter une route 404 |
| 🔴 P0 | Créer un `.gitignore` et retirer `dist/` du repo |
| 🟠 P1 | Améliorer la logique du diagnostic (recommandations réelles) |
| 🟠 P1 | Ajouter `image` dans le data model produit, supprimer les hardcodes |
| 🟠 P1 | Retirer Framer Motion ou l'utiliser, retirer TypeScript ou migrer |
| 🟠 P1 | Corriger les `devDependencies` dans `package.json` |
| 🟠 P1 | Créer `vite.config.js` |
| 🟡 P2 | Gérer le `<title>` par page |
| 🟡 P2 | Étoffer les pages stubs (About, Legal, Account, FAQ, RoutineDetail) |
| 🟡 P2 | Corriger `theme-color` dans `index.html` |
| 🟡 P2 | Corriger les font-weight > 900 |
| 🟡 P2 | Ajouter trap focus + Échap sur le menu mobile |
| 🟢 P3 | Découper `styles.css` en modules |
| 🟢 P3 | Lazy loading des routes |
| 🟢 P3 | Optimisation images (WebP, srcset, width/height) |
| 🟢 P3 | Error Boundary global |
| 🟢 P3 | Séparer `products.js` et `routines.js` |

---

*Audit généré le 2 juin 2026.*
