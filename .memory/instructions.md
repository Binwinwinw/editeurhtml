# Instructions

How Copilot should behave in this project.

## 2026-07-21 — Init dépôt editeurhtml

- Contexte: initialisation mémoire pour l’éditeur HTML temps réel.
- Règle: ne garder dans `.agents/` que ce qui sert editeurhtml. Tout le reste (MCS, quiz, SQL, admin, etc.) est hors dépôt.
- Impact: `.memory/`, `.agents/`, patchs futurs.

## Règles de travail

- Diff minimal. Pas de refactor opportuniste.
- Répondre en français.
- Lire `.memory/security.md` avant tout changement de code.
- Point d’entrée: `index.php` (routeur). Pages: `landingpage.php`, `editeur.php`.
- JS unifié dans `main.js`. Styles dans `styles.css`.
- Ne jamais committer `.env`, `.env.*`, secrets, ni dumps.
- Commit seulement si l’utilisateur le demande.
