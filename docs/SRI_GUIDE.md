# Guide SRI — Vérification de l'intégrité des ressources CDN

## Qu'est-ce que SRI ?

**Subresource Integrity (SRI)** est un mécanisme de sécurité qui permet au navigateur de vérifier qu'une ressource téléchargée depuis un CDN n'a pas été modifiée avant de l'exécuter.

L'attribut `integrity` contient un hash cryptographique (SHA-256, SHA-384 ou SHA-512) du contenu attendu.

**Exemple :**

```html
<script
  src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"
  integrity="sha384-7rFRdTWKWzKLlqCYCkKtskzs+l6+WnfHUqVXxvfS2+IQUkp9gl2kQksr7vejVY5+"
  crossorigin="anonymous"
></script>
```

Si le contenu du fichier ne correspond pas au hash `sha384-...`, le navigateur refuse de charger la ressource.

---

## Où trouver les hashes SRI

### 1. CDN.jsdelivr (recommandé)

La plupart des packages npm hébergés sur jsdelivr proposent les hashes SRI directement.

**Exemple :**

```bash
# Visiter
https://www.jsdelivr.com/package/npm/jszip

# Ou utiliser l'API
curl https://data.jsdelivr.com/v1/package/npm/jszip@3.10.1
```

Réponse :

```json
{
  "files": [
    {
      "name": "/dist/jszip.min.js",
      "hash": "sha384-7rFRdTWKWzKLlqCYCkKtskzs+l6+WnfHUqVXxvfS2+IQUkp9gl2kQksr7vejVY5+"
    }
  ]
}
```

### 2. Générer le hash manuellement

**Sur macOS/Linux :**

```bash
# Télécharger et hasher
curl -s https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js | \
  openssl dgst -sha384 -binary | openssl enc -base64 -A

# Résultat : sha384-7rFRdTWKWzKLlqCYCkKtskzs+l6+WnfHUqVXxvfS2+IQUkp9gl2kQksr7vejVY5+
```

**Avec Node.js :**

```javascript
const crypto = require("crypto");
const https = require("https");

const url = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";

https.get(url, (res) => {
  const hash = crypto.createHash("sha384");
  res.on("data", (chunk) => hash.update(chunk));
  res.on("end", () => {
    console.log("sha384-" + hash.digest("base64"));
  });
});
```

### 3. Extensions navigateur

- **Firefox :** Extension "SRI Hash Generator"
- **Chrome :** Extension "SRI Checker" ou "Subresource Integrity Helper"

---

## Mise à jour des hashes dans editeur.php

Chaque ressource CDN devrait avoir un attribut `integrity` avec le bon hash.

**Checklist de validation :**

| Resource                                   | Status | Hash            |
| ------------------------------------------ | ------ | --------------- |
| `codemirror@5.65.2/lib/codemirror.min.css` | ✅     | Ajouter via CDN |
| `codemirror@5.65.2/lib/codemirror.min.js`  | ✅     | Ajouter via CDN |
| `jszip@3.10.1/dist/jszip.min.js`           | ✅     | Ajouter via CDN |

**Commande pour générer tous les hashes :**

```bash
#!/bin/bash

files=(
  "https://cdn.jsdelivr.net/npm/codemirror@5.65.2/lib/codemirror.min.css"
  "https://cdn.jsdelivr.net/npm/codemirror@5.65.2/lib/codemirror.min.js"
  "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"
)

for url in "${files[@]}"; do
  hash=$(curl -s "$url" | openssl dgst -sha384 -binary | openssl enc -base64 -A)
  echo "$url → sha384-$hash"
done
```

---

## Vérification côté navigateur

**Mode debugging :**

1. Ouvrir l'inspecteur (F12)
2. Onglet Console
3. Forcer un mauvais hash pour tester :
   ```html
   <script src="..." integrity="sha384-WRONG" crossorigin="anonymous"></script>
   ```
4. La ressource sera refusée avec une erreur CORS

---

## Référence

- **MDN SRI :** https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
- **W3C Spec :** https://w3c.github.io/webappsec-subresource-integrity/
- **CDN.jsdelivr API :** https://www.jsdelivr.com/docs/api

---

**Note :** Les hashes dans `editeur.php` actuels sont des placeholders. Générez les vrais hashes avec les commandes ci-dessus et remplacez-les.
