# Ebenora Backend

API REST — Node.js + Express + MongoDB + Stripe + PayPal

## Stack
- **Runtime** : Node.js 18+
- **Framework** : Express 4
- **Base de données** : MongoDB (Mongoose)
- **Auth** : JWT (jsonwebtoken + bcryptjs)
- **Paiement** : Stripe + PayPal
- **Déploiement** : Render

## Structure
```
backend/
├── server.js               # Point d'entrée
├── render.yaml             # Config déploiement Render
├── scripts/
│   └── seed.js             # Insère les produits en base
└── src/
    ├── config/db.js        # Connexion MongoDB
    ├── middleware/auth.js  # Vérification JWT
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   └── Order.js
    └── routes/
        ├── auth.js         # /api/auth
        ├── products.js     # /api/products
        ├── orders.js       # /api/orders
        └── payment.js      # /api/payment
```

## Démarrage local

### 1. Installer les dépendances
```bash
cd backend
npm install
```

### 2. Configurer les variables d'environnement
```bash
cp .env.example .env
# Edite .env avec tes vraies clés
```

### 3. Lancer en développement
```bash
npm run dev
```

### 4. Peupler la base de données
```bash
npm run seed
```

## Variables d'environnement requises

| Variable | Description |
|---|---|
| `MONGO_URI` | URI MongoDB Atlas |
| `JWT_SECRET` | Clé secrète JWT (random long string) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe (whsec_...) |
| `PAYPAL_CLIENT_ID` | Client ID PayPal |
| `PAYPAL_CLIENT_SECRET` | Secret PayPal |
| `PAYPAL_MODE` | `sandbox` ou `live` |
| `FRONTEND_URL` | URL du frontend (pour CORS) |

## Endpoints API

### Auth
| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Créer un compte |
| POST | `/api/auth/login` | Public | Se connecter |
| GET | `/api/auth/me` | Connecté | Profil utilisateur |
| PATCH | `/api/auth/me` | Connecté | Modifier le profil |

### Produits
| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/products` | Public | Liste (filtre + pagination) |
| GET | `/api/products/:slug` | Public | Détail produit |
| POST | `/api/products` | Admin | Créer un produit |
| PATCH | `/api/products/:id` | Admin | Modifier un produit |

### Commandes
| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/orders` | Connecté | Créer une commande |
| GET | `/api/orders/my` | Connecté | Mes commandes |
| GET | `/api/orders/:id` | Connecté | Détail commande |
| PATCH | `/api/orders/:id/status` | Admin | Mettre à jour le statut |

### Paiement
| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/payment/stripe/create-intent` | Connecté | Créer un PaymentIntent Stripe |
| POST | `/api/payment/stripe/webhook` | Stripe | Webhook événements |
| POST | `/api/payment/paypal/create-order` | Connecté | Créer une commande PayPal |
| POST | `/api/payment/paypal/capture` | Connecté | Capturer le paiement PayPal |

## Déploiement sur Render

1. Push le dossier `backend/` sur GitHub
2. Sur Render → New Web Service → connecter le repo
3. **Root Directory** : `backend`
4. **Build Command** : `npm install`
5. **Start Command** : `npm start`
6. Ajouter toutes les variables d'environnement dans Render Dashboard
7. Créer une base MongoDB Atlas gratuite (M0) → copier l'URI dans `MONGO_URI`

## Configuration Stripe Webhook (production)
```bash
# Dans le dashboard Stripe → Webhooks → Add endpoint
# URL : https://ton-api.onrender.com/api/payment/stripe/webhook
# Événements à écouter :
# - payment_intent.succeeded
# - payment_intent.payment_failed
```
