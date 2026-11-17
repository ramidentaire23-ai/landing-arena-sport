# ARENA SPORT DZ — Landing Page E-commerce Haute Conversion (COD Algérie)

Landing page e-commerce ultra-performante et optimisée pour la conversion (CRO), spécialement conçue pour la marque **ARENA SPORT** (lunettes de sport protectrices à verres interchangeables et adaptables à la vue).

Cette landing page reproduit fidèlement la structure, les badges, les boutons, le design system et l'ergonomie de la boutique de référence tout en intégrant un **sélecteur de variantes interactif (Noir/Rouge vs Transparent)** avec permutation instantanée de la galerie photo.

---

## 🚀 Fonctionnalités & Points Forts CRO

1. **Fidélité au Design de Référence** :
   - Bandeau d'annonce supérieur noir avec puce verte pulsante (*Stock Limité : Livraison Offerte dès 6 000 DA*).
   - En-tête épuré avec logo officiel **ARENA SPORT DZ** et baseline *SPORTS & PERFORMANCE*.
   - Galerie photos avec badges flottants : `EN STOCK • -31% SOLDE` et compteur dynamique `01 / 02`.
   - Ligne de réassurance rapide : `En stock - Expédition rapide sous 24h` 📦.
   - Carte de commande blanche aux coins arrondis avec badge noir `Paiement à la livraison • الدفع عند الاستلام`.
   - Bouton de commande principal au pouce : `اضغط هنا لتأكيد الطلب الآن 🔒`.
   - Badge de réassurance verte : `🛡️ ضمان الدفع عند الاستلام بعد معاينة وفحص طردك`.
   - Barre fixe basse (Sticky CTA) sur mobile avec total en direct et bouton `COMMANDER MAINTENANT`.

2. **Sélecteur de Variantes Dynamique (Exclusivité demandée)** :
   - Deux modèles intégrés :
     - **أسود / أحمر (Noir & Rouge Sport)** : Photos haute définition avec branches et sangle élastique.
     - **شفاف رياضي (Transparent Cristal)** : Photos haute définition sous plusieurs angles.
   - Lors du clic sur une variante :
     - La galerie photo change instantanément avec transition douce.
     - Le compteur de photos se réinitialise.
     - Le récapitulatif de prix affiche le modèle sélectionné.
     - Les données envoyées lors de la commande intègrent automatiquement la variante choisie.

3. **Logique Métier COD Algérie (58 Wilayas & Communes)** :
   - Base de données complète des 58 Wilayas d'Algérie avec leurs communes principales.
   - Calcul en direct des frais de livraison selon le mode choisi :
     - **المكتب (Stop Desk)** : 480 DA (ex: Alger) avec note explicative sur les centres de retrait.
     - **المنزل (Domicile)** : 650 DA (ex: Alger) avec champ d'adresse détaillée dynamique.
   - Livraison offerte automatique dès 6 000 DA d'achat.
   - Validation stricte des numéros de téléphone mobiles algériens (10 chiffres commençant par 05, 06 ou 07).

4. **Section Spécifications & Arguments Produits** :
   - Système 2-en-1 convertible (Sangle élastique réglable + branches interchangeables).
   - Compatibilité totale avec le montage de verres optiques correcteurs chez l'opticien.
   - Protection intérieure en silicone antichoc pour le nez et les tempes.
   - Système d'aération antibuée (Anti-fog vents).
   - FAQ en accordéon placée stratégiquement après le formulaire de commande.

5. **Page de Remerciement & Suivi Dédupliqué (`merci.html`)** :
   - Numéro de commande unique généré (`ARENA-XXXXX`).
   - Récapitulatif complet de la commande.
   - Bouton de confirmation immédiate WhatsApp pré-rempli pour le client.
   - Événement `Purchase` Meta Pixel déclenché une seule fois avec token unique et déduplication `eventID`.

---

## 📁 Structure des Fichiers

```text
arena sport landing page/
├── index.html                  # Landing page principale (RTL Arabe & FR)
├── merci.html                  # Page de confirmation de commande
├── .env.example                # Exemple de configuration des clés API et Pixel
├── README.md                   # Ce guide de déploiement et d'utilisation
└── assets/
    ├── css/
    │   └── style.css           # Feuille de style complète et responsive
    ├── js/
    │   ├── app.js              # Moteur interactif (variantes, calculs, formulaire)
    │   └── wilayas.js          # Données des 58 wilayas, tarifs et communes
    └── images/
        ├── logo-arena-sport.jpg# Logo officiel ARENA SPORT DZ
        ├── black-red-1.jpg     # Photo 1 modèle Noir/Rouge (détaché)
        ├── black-red-2.jpg     # Photo 2 modèle Noir/Rouge (face/profil)
        ├── transparent-1.jpg   # Photo 1 modèle Transparent (face 3/4)
        ├── transparent-2.jpg   # Photo 2 modèle Transparent (arrière/branches)
        └── reference-landing.jpg # Capture originale de référence
```

---

## ⚙️ Personnalisation & Configuration

### 1. Modifier le Prix ou les Frais de Livraison
Dans le fichier `assets/js/app.js` :
```javascript
const PRODUCT_CONFIG = {
  name: "نظارات رياضية واقية ARENA SPORT (نظام 2 في 1)",
  unitPrice: 2900, // Modifier le prix unitaire en DA
  freeShippingThreshold: 6000, // Seuil pour la livraison offerte
  ...
};
```

### 2. Configurer votre Numéro WhatsApp
Dans le fichier `merci.html` (ligne ~200) :
```javascript
const phoneStore = "213550000000"; // Remplacez par votre numéro international sans '+'
```

### 3. Configurer votre Meta Pixel ID
Dans `index.html` (ligne ~28) et `merci.html` :
```javascript
const META_PIXEL_ID = 'VOTRE_PIXEL_ID_ICI';
```

---

## 🌐 Déploiement

Cette landing page est 100% statique et ultra-rapide (zéro dépendance lourde). Vous pouvez l'héberger directement sur :
- **Netlify** / **Vercel** / **Cloudflare Pages** : glisser-déposer le dossier pour une mise en ligne instantanée avec certificat SSL gratuit.
- **Serveur cPanel / Apache / Nginx** : téléversez l'ensemble des fichiers dans le répertoire `public_html`.
- **Plateforme `/here-now`** : publiable en une commande via le skill Antigravity dédié.
