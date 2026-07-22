# Security

Rules that must NEVER be broken. Always read this file.

## 2026-07-21 — Garde-fous editeurhtml

- Contexte: init sécurité après audit Phase 1.
- Règle: ne jamais committer `.env`, clés, tokens, credentials.
- Règle: router uniquement via whitelist `landing` / `editeur` dans `index.php`. Accès direct à `editeur.php` / `landingpage.php` interdit (constante `EDITEURHTML_ROUTER` + redirect ; rewrite Apache en prod).
- Règle: CSP unique définie dans `index.php` uniquement. Ne pas `set` ni `unset` CSP dans Apache.
- Règle: CDN CodeMirror avec SRI (`integrity` + `crossorigin`) ; régénérer les hashes si version CDN change.
- Règle: aperçu utilisateur dans iframe sandbox ; ne pas élargir les permissions sans raison.
- Règle: ne pas exposer `.git`, `.env`, configs via le web (déjà bloqué dans `.htaccess`).
- Impact: `index.php`, `editeur.php`, `landingpage.php`, `.htaccess`, `.htaccessprod`, CDN, docs sécurité.
