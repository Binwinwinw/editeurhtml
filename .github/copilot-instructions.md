# Copilot Instructions for Éditeur HTML Temps Réel

## Vue d'ensemble
Ce projet est un éditeur web en temps réel pour HTML, CSS et JavaScript, avec prévisualisation instantanée et export des fichiers. L'architecture est simple : tout le code JS est centralisé dans `main.js`, l'interface dans `index.html`, et le style dans `styles.css`.

## Structure et composants clés
- `index.html` : structure de l'interface, barre d'outils, modals, volets éditeurs, iframe d'aperçu.
- `main.js` : toute la logique (CodeMirror, gestion des onglets, notifications, export ZIP, collage multi-langage, accessibilité, sécurité, etc.).
- `styles.css` : thèmes, variables CSS, responsive, accessibilité.

## Conventions et patterns spécifiques
- **Édition multi-langage** : chaque volet (HTML, CSS, JS) est un éditeur CodeMirror distinct. Le collage multi-langage répartit automatiquement le code dans les bons éditeurs.
- **Export ZIP** : le bouton "Enregistrer le projet" génère un ZIP contenant `index.html`, `styles.css`, `main.js` via JSZip (chargé dynamiquement).
- **Notifications** : feedback utilisateur via la fonction `notify()`.
- **Aperçu sécurisé** : l'iframe utilise `sandbox` pour isoler le rendu.
- **Accessibilité** : navigation clavier, focus, contrastes, modals accessibles.
- **Effacement** : boutons pour effacer le code d'un volet ou de tous les volets.

## Workflows développeur
- **Développement** : modifier directement les fichiers, puis ouvrir `index.html` dans le navigateur. Utiliser Live Server pour le hot reload si besoin.
- **Debug** : tout le JS est dans `main.js`, les erreurs apparaissent dans la console du navigateur.
- **Test** : vérifier la prévisualisation et l'export ZIP dans le navigateur.

## Points d'intégration et dépendances
- **CodeMirror** : chargé via CDN dans `index.html`.
- **JSZip** : chargé dynamiquement lors de l'export ZIP.
- **Aucune compilation ou build** : projet 100% client-side, pas de dépendances Node ou package.json.

## Exemples de patterns
- Pour ajouter une fonctionnalité, modifiez ou étendez `setupButtons()` dans `main.js`.
- Pour changer le style, utilisez les variables CSS dans `styles.css`.
- Pour intégrer une nouvelle dépendance JS, chargez-la via CDN dans `index.html` ou dynamiquement dans `main.js`.

## Fichiers de référence
- [index.html](../../index.html)
- [main.js](../../main.js)
- [styles.css](../../styles.css)

---

Pour toute modification, gardez la logique centralisée dans `main.js` et respectez la séparation interface/style/fonctionnel. Pour des conventions ou workflows non documentés, consultez le README ou le code source.
