# Éditeur HTML Temps Réel

## Présentation
Un éditeur web moderne permettant d’écrire, prévisualiser et sauvegarder du code HTML, CSS et JavaScript en temps réel. Interface responsive, accessible et optimisée pour tous les usages.

## Installation
- Déposez le dossier `editeurhtml` sur votre serveur ou dans votre environnement local.
- Ouvrez `index.html` dans votre navigateur.
- (Optionnel) Utilisez Live Server (port 5502) pour le développement.

## Fonctionnalités
- Édition multi-langage (HTML, CSS, JS) avec CodeMirror
- Prévisualisation instantanée dans une iframe sécurisée
- Thème sombre/clair
- Notifications et feedback visuel
- Sélection de texte partout
- Sauvegarde locale des fichiers
- Accessibilité renforcée (navigation clavier, contrastes, focus visible)

## Sécurité
- L’aperçu est isolé dans une iframe avec sandbox (`allow-scripts allow-same-origin`)
- Les balises `<script src=...>` sont ignorées lors de la détection JS
- Attention : ne pas exposer l’éditeur à des utilisateurs non fiables sans filtrage supplémentaire

## Optimisation
- CSS factorisé et performant
- JS modulaire recommandé si le projet grandit

## À venir
- Modularisation JS
- Optimisations CSS avancées
- Documentation technique

## Auteur
WinBuilder – 2025
