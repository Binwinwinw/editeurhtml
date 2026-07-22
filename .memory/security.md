# Security

Rules that must NEVER be broken. Always read this file.

## 2026-07-21 — Garde-fous editeurhtml

- Contexte: init sécurité après audit Phase 1.
- Règle: ne jamais committer `.env`, clés, tokens, credentials.
- Règle: router uniquement via whitelist `landing` / `editeur` dans `index.php`.
- Règle: CSP unique définie dans `index.php` uniquement. Ne pas `set` ni `unset` CSP dans Apache — `Header always unset` peut supprimer la CSP PHP (CGI/FPM).
- Règle: CDN CodeMirror avec SRI (`integrity` + `crossorigin`) ; régénérer les hashes si version CDN change.
- Règle: aperçu utilisateur dans iframe sandbox ; ne pas élargir les permissions sans raison.
- Règle: ne pas exposer `.git`, `.env`, configs via le web (déjà bloqué dans `.htaccess`).
- Impact: `index.php`, `.htaccess`, `editeur.php`, CDN, docs sécurité.
