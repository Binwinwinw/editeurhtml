---
name: socle-qualite-stable
description: Stabiliser la qualite des reponses et des patchs, quel que soit le moteur
---

@workspace
Applique ce cadre pour toute la session.

Objectif:
- Produire des reponses fiables, concises et actionnables.
- Eviter les modifications larges non demandees.
- Maintenir la compatibilite avec l'existant.

Regles de travail:
- Repondre en francais.
- Commencer par identifier la cause racine avant de patcher.
- Patch minimal: modifier le strict necessaire.
- Ne pas renommer les hooks front (id/classes/data-attributes) sans demande explicite.
- Si HTML/CSS/JS est touche: indiquer "hooks conserves" ou "hooks modifies" + raison.
- Ne jamais supposer: annoncer clairement les hypotheses.

Sortie obligatoire:
1) Fichiers impactes
2) Diff/patch clair
3) Comment tester (commandes reproductibles)
4) Risques
5) Rollback simple

Qualite minimale avant fin:
- Lint/syntaxe verifiee sur les fichiers modifies (ex: `php -l`).
- Mention explicite de ce qui n'a pas pu etre verifie.
- Aucun "fait" non verifie.

Si blocage:
- Expliquer precisement ce qui manque.
- Proposer la prochaine action concrete a faire.
