# Decisions

Architectural commitments made in this project.

## 2026-07-21 — Architecture applicative

- Contexte: init dépôt après passage HTML → PHP.
- Décision: `index.php` routeur whitelist (`landing`, `editeur`). Plus d’`index.html`.
- Décision: logique client dans un seul `main.js` (CodeMirror, aperçu iframe, export).
- Décision: headers de sécurité côté PHP + `.htaccess` (CSP, X-Frame-Options, nosniff).
- Impact: `index.php`, `editeur.php`, `landingpage.php`, `.htaccess`, `main.js`.

## 2026-07-21 — Correctifs Bugbot éditeur

- Contexte: revue Bugbot (export ZIP, preview, collage, fallback).
- Décision: `index.html` ZIP généré via `buildExportIndexHtml` (link `styles.css` + `script.js`).
- Décision: preview extrait le body si document HTML complet ; JS user dans un `<script>` dédié avec offset de lignes.
- Décision: bouton Coller partage `tryDistributePastedDocument` avec le collage clavier.
- Impact: `main.js`.
- Validation: 2026-07-22 — export ZIP et fonctionnement global OK en prod (retour utilisateur).

## 2026-07-21 — Gouvernance agents

- Contexte: dossier `.agents/` et `.memory/` ajoutés.
- Décision: continuité inter-session via `.memory/` (skill memory-session).
- Décision: purge stricte `.agents/skills` — uniquement mémoire, frontend/a11y, gitnexus + chaîne d’agents.
- Décision: `.htaccessprod` pour Hostinger (activation manuelle par renommage).
- Décision: HSTS activé dans `.htaccessprod` (HTTPS Hostinger validé).
- Impact: `.memory/`, `.agents/`, `.htaccessprod`.
