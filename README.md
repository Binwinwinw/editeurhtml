# Éditeur HTML Temps Réel

## Présentation

Un éditeur web moderne permettant d’écrire, prévisualiser et sauvegarder du code HTML, CSS et JavaScript en temps réel. Interface responsive, accessible, rapide et optimisée pour tous les usages.

## Installation

- Déposez le dossier `editeurhtml` sur votre serveur ou dans votre environnement local.
- Ouvrez `index.html` dans votre navigateur.
- (Optionnel) Utilisez Live Server pour le développement.

## Fonctionnalités principales

- **Édition multi-langage** (HTML, CSS, JS) avec CodeMirror
- **Détection intelligente** lors du collage : sépare automatiquement HTML, CSS, JS (ignore les `<script src=...>`)
- **Prévisualisation instantanée** dans une iframe sécurisée
- **Thème sombre/clair**
- **Notifications et feedback visuel** (succès, erreur, actions)
- **Barre d’outils fixe** toujours accessible
- **Effacement individuel ou global** des éditeurs
- **Sauvegarde locale** des fichiers (HTML, CSS, JS)
- **Accessibilité renforcée** (navigation clavier, focus, contrastes)
- **Scroll indépendant** : l’aperçu reste visible même avec beaucoup de code

## Sécurité

- L’aperçu est isolé dans une iframe avec sandbox (`allow-scripts allow-same-origin`)
- Les balises `<script src=...>` sont ignorées lors de la détection JS
- Les scripts inline sont extraits uniquement si présents
- Attention : ne pas exposer l’éditeur à des utilisateurs non fiables sans filtrage supplémentaire

## Optimisation & Structure

- **Tout le JS est unifié dans `main.js`** (plus de modules séparés)
- **CSS factorisé et performant**
- **Variables CSS** pour le thème et la personnalisation
- **Code commenté et repéré pour faciliter la maintenance**

## Conseils d’utilisation

- Utilisez la barre d’outils pour changer de thème, copier/coller, effacer ou sauvegarder
- Le collage multi-langage répartit automatiquement le code dans les bons éditeurs
- La barre d’outils et les notifications restent toujours visibles
- Le scroll ne masque jamais la prévisualisation

## À venir / Suggestions

- Micro-interactions UX avancées
- Optimisations CSS supplémentaires
- Export ZIP de tous les fichiers
- Suggestions bienvenues !

## Auteur

WinBuilder – 2025
