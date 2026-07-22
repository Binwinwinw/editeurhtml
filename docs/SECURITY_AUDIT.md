# Audit de Sécurité — Éditeur HTML/CSS/JS Temps Réel

**Date :** 2026-06-09  
**Scope :** Prototype/démo → Production readiness  
**Verdict :** Fonctionnel avec durcissements requis avant exposition publique

---

## RÉSUMÉ EXÉCUTIF

L'application est architecturalement saine pour un prototype front-end. Les risques identifiés sont principalement des **durcissements de production** et non des **failles exploitables immédiatement**. Les trois priorités absolues avant mise en production sont :

1. **Content Security Policy (CSP)** — Deuxième ligne de défense contre XSS/injection
2. **Validation stricte du routeur** — Whitelist explicite du paramètre page
3. **En-têtes de sécurité standards** — X-Frame-Options, X-Content-Type-Options, etc.

---

## RISQUES PAR SÉVÉRITÉ

### 🔴 TRÈS PRIORITAIRE (À corriger avant prod)

#### 1. **Absence de Content Security Policy**

- **Composante :** `index.php`, `editeur.php`, `landingpage.php`
- **Détail :** Aucun header `Content-Security-Policy` sur les réponses HTTP
- **Impact :**
  - CodeMirror et JSZip chargés via CDN sans restriction
  - Script ou stylesheet compromis au niveau CDN s'exécuterait librement
  - XSS via injection de balise `<script>` dans le DOM du document principal
- **Correctif :** Ajouter en haut de `index.php` avant tout output
  ```php
  header("Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; frame-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self';");
  ```
- **Rationale :** OWASP classe CSP comme deuxième ligne de défense contre plusieurs classes d'injection. MDN confirme que même sans XSS évidents, une CSP forte limite drastiquement les dégâts en cas d'incident sur le CDN.

---

#### 2. **Validation du routeur insuffisamment explicite**

- **Fichier :** [index.php](index.php#L10-L17)
- **Code actuel :**

  ```php
  $page = $_GET['page'] ?? 'landing';

  $routes = [
      'landing' => __DIR__ . '/landingpage.php',
      'editeur' => __DIR__ . '/editeur.php',
  ];

  if (!array_key_exists($page, $routes)) {
      http_response_code(404);
      // ...
  }
  require $routes[$page];
  ```

- **Risque :** Bien que `array_key_exists()` agisse comme une whitelist statique, le pattern dépend implicitement d'une table figée. Une refactor accidentelle ou une injection de routes ailleurs pourraient contourner cette protection.
- **Niveau :** MOYEN À MAJEUR (pas une LFI exploitable tout de suite, mais fragile)
- **Correctif :** Validation explicite + rejet strict

  ```php
  <?php
  declare(strict_types=1);

  $allowed_pages = ['landing', 'editeur'];
  $page = $_GET['page'] ?? 'landing';

  if (!is_string($page) || !in_array($page, $allowed_pages, true)) {
      http_response_code(404);
      exit('404 — Page introuvable');
  }

  $routes = [
      'landing' => __DIR__ . '/landingpage.php',
      'editeur' => __DIR__ . '/editeur.php',
  ];

  require $routes[$page];
  ```

- **Bénéfice :** Type-checking + double validation, fait échouer plutôt que de deviner.

---

#### 3. **En-têtes de sécurité standards manquants**

- **Fichier :** [index.php](index.php) (avant toute sortie)
- **Manquant :**
  - `X-Frame-Options: DENY` — Empêche la page d'être iframeée ailleurs (clickjacking)
  - `X-Content-Type-Options: nosniff` — Force le navigateur à respecter le MIME-Type déclaré
  - `Referrer-Policy: strict-origin-when-cross-origin` — Limite les fuites d'URL dans Referer
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` — Désactive les API dangereuses
- **Correctif :** Ajouter après le header CSP
  ```php
  header('X-Frame-Options: DENY');
  header('X-Content-Type-Options: nosniff');
  header('Referrer-Policy: strict-origin-when-cross-origin');
  header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
  ```
- **Note :** `X-XSS-Protection` est obsolète (ignoré par navigateurs modernes si CSP est présente).

---

### 🟠 PRIORITAIRE (À corriger avant exposition publique)

#### 4. **Subresource Integrity (SRI) absent sur dépendances CDN**

- **Fichier :** [editeur.php](editeur.php#L12-L18), [editeur.php](editeur.php#L170-L180)
- **Détail :** CodeMirror, JSZip et autres assets chargés sans vérification d'intégrité
- **Exemple problématique :**
  ```html
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/lib/codemirror.min.js"></script>
  ```
- **Correctif :** Ajouter attributs `integrity` et `crossorigin`

  ```html
  <!-- CodeMirror core -->
  <script
    src="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/lib/codemirror.min.js"
    integrity="sha384-XXXXX..."
    crossorigin="anonymous"
  ></script>

  <!-- JSZip -->
  <script
    src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"
    integrity="sha384-XXXXX..."
    crossorigin="anonymous"
  ></script>
  ```

- **Génération des hashes :** Chaque CDN (jsdelivr, cdnjs, unpkg) propose un bouton "Copy Hash SRI" ou utiliser :
  ```bash
  curl -s https://cdn.jsdelivr.net/npm/codemirror@5.65.2/lib/codemirror.min.js | openssl dgst -sha384 -binary | openssl enc -base64 -A
  ```
- **Impact :** Supply-chain protection. Un CDN compromis ou un MITM ne peut plus injecter de code malveillant.

---

#### 5. **Persistance localStorage sans consentement explicite**

- **Fichier :** [main.js](main.js#L340-L360)
- **Détail :** Code HTML/CSS/JS utilisateur stocké en localStorage sans avertissement
- **Risque réel :** FAIBLE À MOYEN
  - Risque de **confidentialité locale** (quelqu'un d'autre accédant au navigateur peut voir le code)
  - Pas une faille d'exécution à elle seule (localStorage n'exécute rien)
- **Recommandation :** Pas de chiffrement requis (localStorage n'est pas un vault), mais **documenter la limite**
- **Correctif :** Ajouter note visible dans l'UI
  ```html
  <div class="security-notice">
    ⚠️ Votre code est sauvegardé localement dans localStorage. Ne contient pas
    de données sensibles/client.
    <a href="#settings-clear">Purger la sauvegarde</a>
  </div>
  ```
- **Option avancée :** Ajouter un bouton "Mode privé" qui désactive localStorage pour la session.

---

#### 6. **Modèle de données plan.html non documenté**

- **Fichier :** [plan.html](plan.html#L180)
- **Détail :** Appel fetch vers `plan-data.php` sans authentification visible
- **Risque :** Dépend de ce que retourne `plan-data.php`
- **Recommandation :**
  - Créer ou documenter `plan-data.php` avec validation d'accès (ex: token API, session)
  - Valider les données côté serveur avant envoi
  - Éviter d'exposer des données d'audit sensibles sans authentification

---

### 🟡 ENSUITE (Non-bloquant pour démo, à prévoir)

#### 7. **HTTPS non forcé**

- **Niveau :** MOYEN (recommandation standard)
- **Correctif :** Ajouter `.htaccess` ou middleware PHP
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  </IfModule>
  ```
- **Contexte :** Hostinger offre SSL gratuit ; l'appliquer protège les échanges.

---

#### 8. **Audit des dépendances (npm/composer)**

- **Niveau :** MOYEN
- **Commandes :**

  ```bash
  # Vérifier les vulnérabilités connues dans les dépendances JS
  npm audit --prod  # (si package.json existe)

  # Ou manuellement : vérifier les versions
  # - CodeMirror 5.65.2 — aucune vulnérabilité critique connue
  # - JSZip 3.10.1 — aucune vulnérabilité critique connue
  ```

---

#### 9. **Scan des fichiers sensibles**

- **Recommandation :** Vérifier `.gitignore` pour exclure :
  ```
  .env
  .env.local
  config/database.php
  *.sql
  *.log
  node_modules/
  build/
  dist/
  ```

---

## POINTS DE FORCE

| Aspect                  | Statut       | Détail                                             |
| ----------------------- | ------------ | -------------------------------------------------- |
| **iframe sandbox**      | ✅ Bon       | `sandbox="allow-scripts"` limite les capacités     |
| **Error handling**      | ✅ Bon       | postMessage capture les erreurs JS sans exposition |
| **Fallback CodeMirror** | ✅ Excellent | Dégradation gracieuse si CDN indisponible          |
| **Persistance locale**  | ✅ Bon       | localStorage avec clés ségrégées, safe get/set     |
| **Export ZIP**          | ✅ Bon       | JSZip validée, pas de path traversal visible       |
| **Validation entrées**  | ✅ Bon       | Peu d'entrées utilisateur sans validation          |

---

## PLAN D'ACTION

### Phase 1 — Production Hardening (1-2 jours)

**À faire en premier :**

1. ✅ Ajouter CSP header dans `index.php`
2. ✅ Revalider routeur avec `in_array()` strict
3. ✅ Ajouter en-têtes de sécurité standards (X-Frame-Options, etc.)

**Vérification :**

```bash
# Vérifier les headers avec curl
curl -I https://votre-domaine/editeurhtml/?page=editeur

# Doit voir :
# Content-Security-Policy: ...
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

### Phase 2 — Supply Chain & Docs (3-5 jours)

4. Ajouter SRI sur tous les CDN (CodeMirror, JSZip, etc.)
5. Documenter le modèle de persistance localStorage dans README
6. Créer/valider `plan-data.php` avec authentification

### Phase 3 — Infrastructure (1-2 semaines)

7. Forcer HTTPS au niveau serveur/DNS
8. Audit des dépendances (npm audit, composer audit)
9. Tests de pénétration basiques (Burp Community, OWASP ZAP)

---

## CONFORMITÉ & RÉFÉRENCES

| Standard                 | Couverture                    | Lien                                                                                                             |
| ------------------------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **OWASP Top 10**         | XSS, Injection, Configuration | [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)                                                      |
| **OWASP CSP**            | Recommandation CSP            | [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) |
| **MDN SRI**              | Subresource Integrity         | [MDN SRI](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)                           |
| **MDN Security Headers** | Headers défensifs             | [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Glossary/HTTP_header)                            |

---

## CONCLUSION

**Verdict :** Code **prototype sain**, **durcissements accessibles** avant production.

L'absence de CSP est le seul vrai point d'amélioration critique. Le reste relève de la maîtrise du risque supply-chain et de la configuration défensive standard.

Les 3 correctifs prioritaires (CSP + validation routeur + en-têtes) prennent moins d'1 heure à mettre en place et améliorent drastiquement la posture de sécurité.

---

**Rapport préparé par :** Copilot Security Audit  
**Révision :** 2026-06-09 v2 (recalibrée)
