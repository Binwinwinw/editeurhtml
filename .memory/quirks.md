# Quirks

Project-specific weirdness — the non-obvious stuff.

## 2026-07-21 — .htaccess local vs prod

- Contexte: règles Apache locales vs hébergement.
- Quirk: `.htaccess` local limite les `*.php` à `127.0.0.1` / `::1`. En prod, utiliser `.htaccessprod` (renommer en `.htaccess` sur Hostinger) : PHP public, dossiers `.agents`/`.memory`/`.gitnexus`/`docs`/`dev` bloqués.
- Impact: `.htaccess`, `.htaccessprod`, pages PHP.

## 2026-07-21 — SRI CodeMirror

- Contexte: popup « CodeMirror indisponible ».
- Quirk: des hashes `integrity` placeholder bloquaient le CDN. Hashes sha384 recalculés depuis jsDelivr (CodeMirror 5.65.2 + JSZip 3.10.1).
- Impact: `editeur.php`.

## 2026-07-21 — Aperçu sandbox

- Contexte: prévisualisation live.
- Quirk: iframe sandbox `allow-scripts allow-same-origin`. Utile pour l’aperçu, mais pas une isolation totale. Ne pas traiter le contenu utilisateur comme sûr.
- Impact: `main.js`, `editeur.php`.

## 2026-07-21 — README vs réalité

- Contexte: docs historiques.
- Quirk: le README parlait encore d’`index.html` alors que l’entrée est `index.php`. Corrigé à l’init.
- Impact: `README.md`.
