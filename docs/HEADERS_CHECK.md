# Vérification des Headers de Sécurité

## Objectif

Valider que tous les headers de sécurité sont présents et correctement configurés après les correctifs.

---

## Headers à vérifier

### 1. Content-Security-Policy (CSP)

**Attendu :**

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; ...
```

**Commande de test :**

```bash
curl -I https://votre-domaine/editeurhtml/ | grep -i "Content-Security-Policy"
```

**Vérification :** Doit retourner la ligne CSP complète.

---

### 2. X-Frame-Options

**Attendu :**

```
X-Frame-Options: DENY
```

**Commande de test :**

```bash
curl -I https://votre-domaine/editeurhtml/ | grep -i "X-Frame-Options"
```

**Résultat :** Doit afficher `DENY`.

---

### 3. X-Content-Type-Options

**Attendu :**

```
X-Content-Type-Options: nosniff
```

**Commande de test :**

```bash
curl -I https://votre-domaine/editeurhtml/ | grep -i "X-Content-Type-Options"
```

---

### 4. Referrer-Policy

**Attendu :**

```
Referrer-Policy: strict-origin-when-cross-origin
```

**Commande de test :**

```bash
curl -I https://votre-domaine/editeurhtml/ | grep -i "Referrer-Policy"
```

---

### 5. Permissions-Policy

**Attendu :**

```
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Commande de test :**

```bash
curl -I https://votre-domaine/editeurhtml/ | grep -i "Permissions-Policy"
```

---

## Script de vérification complet

**test-headers.sh :**

```bash
#!/bin/bash

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

DOMAIN="${1:-http://localhost:8001/editeurhtml}"
echo "Vérification des headers de sécurité pour : $DOMAIN"
echo "=================================================="

headers=$(curl -s -I "$DOMAIN")

check_header() {
  local header_name=$1
  local expected_value=$2

  if echo "$headers" | grep -qi "$header_name"; then
    actual=$(echo "$headers" | grep -i "$header_name" | cut -d: -f2- | xargs)
    if [[ -z "$expected_value" ]] || echo "$actual" | grep -qi "$expected_value"; then
      echo -e "${GREEN}✓${NC} $header_name: $actual"
    else
      echo -e "${YELLOW}⚠${NC} $header_name présent mais valeur inattendue: $actual"
    fi
  else
    echo -e "${RED}✗${NC} $header_name: MANQUANT"
  fi
}

check_header "Content-Security-Policy" "default-src"
check_header "X-Frame-Options" "DENY"
check_header "X-Content-Type-Options" "nosniff"
check_header "Referrer-Policy" "strict-origin"
check_header "Permissions-Policy" "camera"

echo ""
echo "Analyse complète des headers :"
echo "$headers"
```

**Utilisation :**

```bash
chmod +x test-headers.sh
./test-headers.sh http://votre-domaine/editeurhtml
```

---

## Outils graphiques

### 1. Security Headers (Web)

Visiter https://securityheaders.com et entrer votre domaine.

Exemple de résultat :

```
Content-Security-Policy      ✓
X-Frame-Options              ✓
X-Content-Type-Options       ✓
Referrer-Policy              ✓
```

### 2. OWASP ZAP (Desktop)

```bash
# Installation
brew install zaproxy  # macOS
sudo apt-get install zaproxy  # Linux

# Lancer ZAP
zaproxy

# Scanner → Actif → Sélectionner target → Run
```

### 3. Burp Community

- Télécharger depuis https://portswigger.net/burp/communitydownload
- Scanner actif sur la cible
- Onglet "Scanner" → "Issues"

---

## Checklist post-déploiement

Après chaque déploiement, exécuter :

```bash
# 1. Vérifier syntaxe PHP
php -l index.php

# 2. Vérifier les headers
curl -I https://votre-domaine/editeurhtml | head -20

# 3. Tester CSP compliance
curl -s https://votre-domaine/editeurhtml | grep -o 'src="https[^"]*"' | sort -u

# 4. Test de charge CDN (SRI)
curl -s -w "HTTP %{http_code}\n" https://cdn.jsdelivr.net/npm/codemirror@5.65.2/lib/codemirror.min.js > /dev/null

# 5. Vérifier l'absence d'erreurs de console
# → Ouvrir en navigateur et vérifier la console (F12)
```

---

## Rapports recommandés

| Outil                   | Fréquence            | Seuil d'alerte        |
| ----------------------- | -------------------- | --------------------- |
| **securityheaders.com** | Mensuel              | Score < A             |
| **OWASP ZAP**           | Avant chaque release | Aucune issue critique |
| **Mozilla Observatory** | Mensuel              | Score < 80/100        |

---

## Références

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [Security Headers ORG](https://securityheaders.com)
