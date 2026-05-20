# STACK HOUSE — Site web

Site fonctionnel issu de la maquette UX/UI **STACK HOUSE** (configurateur de burger,
diner US modernisé · Lyon 2026). HTML/CSS/JS vanilla, responsive, sans framework.

## Lancer

Depuis ce dossier :

```bash
python3 -m http.server 5173
# puis ouvre http://localhost:5173/
```

(N'importe quel serveur statique fait l'affaire — `npx serve`, Live Server, etc.)

## Structure

```
site/
├── index.html         · Landing immersive (hero + concept + 4 étapes + specials)
├── menu.html          · Carte complète (burgers, sides, drinks, desserts, sauces)
├── configurateur.html · Cœur du produit · construction du burger en 4 étapes
├── zone.html          · Vérification zone livraison (état OK + état hors zone)
├── panier.html        · Panier + cross-sell + résumé
├── checkout.html      · Identité + adresse + paiement (3 sections)
├── succes.html        · Confirmation commande + tracking
├── compte.html        · Profil + statut Stack Club + stacks sauvegardés
├── historique.html    · Commandes passées + re-commander
│
├── css/
│   ├── tokens.css     · Variables CSS (couleurs, type, radius, shadows)
│   ├── style.css      · Reset, atomes (button/chip/card/input), nav, footer, ProductCard
│   ├── landing.css    · Spécifique au hero / landing
│   └── pages.css      · Pages internes (cart, checkout, account, configurator, success…)
│
└── js/
    ├── nav.js         · Toggle nav mobile + badge panier depuis localStorage
    ├── reveal.js      · Reveal-on-scroll basique
    ├── configurator.js· État + preview live + ajout au panier (4 étapes)
    └── cart.js        · Injecte les items custom du configurateur dans le panier
```

## Design System

Tokens centralisés dans `css/tokens.css` :

| Token            | Valeur                              | Usage                          |
|------------------|-------------------------------------|--------------------------------|
| `--sh-cream`     | `#F4ECD8`                           | Fond principal (papier journal)|
| `--sh-ink`       | `#1A130E`                           | Texte, borders, surfaces dark  |
| `--sh-red`       | `#C8252B`                           | CTA primaires, accents         |
| `--sh-mustard`   | `#E8B547`                           | Highlights, badges             |
| `--sh-pickle`    | `#4F6B33`                           | Vert cornichon, veggie         |
| `--sh-neon-pink` | `#FF4F86`                           | Accents néon enseigne          |
| `--sh-font-display` | Alfa Slab One                    | Titres XL                      |
| `--sh-font-sub`     | Bungee                           | Sub / badges                   |
| `--sh-font-body`    | Space Grotesk                    | UI body                        |
| `--sh-font-mono`    | Space Mono                       | Prix, IDs, microcopy           |
| `--sh-shadow-hard`  | `4px 4px 0 0 var(--sh-ink)`      | Hard shadow signature          |

## Icônes & images

- Icônes via **Font Awesome 6.5** (CDN cloudflare).
- Images placeholder via **placehold.co** (à remplacer par les visuels définitifs).
- Pas d'asset binaire dans le repo.

## Responsive

- Desktop (1440) ≥ 1024px : layouts originaux respectés (split 1.2fr/1fr en hero,
  1fr/1.3fr en configurateur, 1.6fr/1fr en panier, etc.)
- Tablet 768→1024 : grilles 4 → 2 colonnes, paddings réduits.
- Mobile < 768 : nav repliée derrière toggle hamburger, grilles 1 colonne,
  configurateur empilé (preview au-dessus, sélection en-dessous).

## Flux utilisateur (UX)

`index → (zone livraison) → configurateur → panier → checkout → succès`

Persistance panier en `localStorage` : un burger configuré apparaît automatiquement
en haut du panier à l'arrivée sur `panier.html`.

## Limites connues / à compléter

- Données 100% statiques (pas de back-end).
- Pas de drag-and-drop des couches du burger (clic toggle + double-clic +2 seulement).
- Tracking commande sur la page succès = statique.
- Toutes les images sont des placeholders : à remplacer par des photos burger / map / icons définitifs.
