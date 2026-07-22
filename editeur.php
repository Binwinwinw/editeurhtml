<?php
declare(strict_types=1);

// Accès direct interdit : headers de sécurité uniquement via index.php
if (!defined('EDITEURHTML_ROUTER')) {
    header('Location: index.php?page=editeur', true, 302);
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Éditeur HTML/CSS/JS Temps Réel</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- CodeMirror -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/lib/codemirror.min.css" integrity="sha384-UqdjraPcE1MAStowZ2luyneWqy6SA4vw0x0UMlFpYwqAuahEHhTka/bF62Udsa5z" crossorigin="anonymous" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/theme/dracula.min.css" integrity="sha384-WKD/1WyJ2xVZdLcIx51pvNeXdZxYrwdAquqF6Hf/gLzf9a7KX+WX2uUB0Vyh8enS" crossorigin="anonymous" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/theme/mdn-like.min.css" integrity="sha384-Cs7inSJmN64nDOau80umun+Pe3tqcKGDh0VJ8BJjeBBcq8aKtee9Uwb/TZKd5IwD" crossorigin="anonymous" />

  <!-- Addons CodeMirror -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/addon/dialog/dialog.min.css" integrity="sha384-uJK9/04LELjSBboSS32NWYcsKNKX7t4fwrMAhpgXK4E2opdYfCXVGf++DWE+8uIL" crossorigin="anonymous" />

  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <span class="brand-mark">🚀</span>
      <div>
        <h1>Éditeur HTML Temps Réel</h1>
        <p>HTML, CSS et JavaScript avec aperçu instantané</p>
      </div>
    </div>

    <div class="controls" aria-label="Actions de l’éditeur">
      <button id="themeToggle" type="button" title="Basculer le thème" aria-label="Basculer le thème">🌙</button>
      <button id="runPreviewBtn" type="button" title="Rafraîchir l’aperçu" aria-label="Rafraîchir l’aperçu">▶️</button>
      <button id="pasteCode" type="button" title="Coller" aria-label="Coller dans l’éditeur actif">📥</button>
      <button id="copyCode" type="button" title="Copier" aria-label="Copier le code de l’éditeur actif">📋</button>
      <button id="clearCode" type="button" title="Effacer l’éditeur actif" aria-label="Effacer l’éditeur actif">🗑️</button>
      <button id="clearAllCode" type="button" title="Tout effacer" aria-label="Tout effacer">🧹</button>
      <button id="saveCode" type="button" title="Télécharger le fichier actif" aria-label="Télécharger le fichier actif">💾</button>
      <button id="saveProjectBtn" type="button" title="Exporter le projet ZIP" aria-label="Exporter le projet ZIP">📦</button>
      <button id="gotoErrorBtn" type="button" title="Aller à la dernière erreur JS" aria-label="Aller à la dernière erreur JS">➡️</button>
    </div>
  </header>

  <main class="app-shell">
    <section id="editorPane" class="pane pane-editors" aria-label="Zone d’édition">
      <div class="pane-header">
        <span>Code source</span>
        <div class="header-actions">
          <button class="switch-btn active" data-editor="html" type="button">HTML</button>
          <button class="switch-btn" data-editor="css" type="button">CSS</button>
          <button class="switch-btn" data-editor="js" type="button">JS</button>
        </div>
      </div>

      <div class="multi-editors">
        <section class="editor-block" data-editor-panel="html">
          <div class="editor-label">HTML</div>
          <textarea id="htmlEditor">&lt;main class="demo"&gt;
  &lt;h1&gt;Bonjour 👋&lt;/h1&gt;
  &lt;p&gt;Commencez à écrire votre HTML dans l’éditeur.&lt;/p&gt;
  &lt;button id="demoBtn"&gt;Clique-moi&lt;/button&gt;
&lt;/main&gt;</textarea>
        </section>

        <section class="editor-block" data-editor-panel="css">
          <div class="editor-label">CSS</div>
          <textarea id="cssEditor">:root {
  color-scheme: light;
}

body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  background: linear-gradient(135deg, #f5f7fb 0%, #e8eefc 100%);
  color: #172033;
}

.demo {
  max-width: 720px;
  margin: 60px auto;
  background: white;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(0,0,0,.08);
}

h1 {
  color: #1d4ed8;
}

button {
  border: 0;
  padding: 12px 18px;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}</textarea>
        </section>

        <section class="editor-block" data-editor-panel="js">
          <div class="editor-label">JS</div>
          <textarea id="jsEditor">document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('demoBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      alert('Le JavaScript fonctionne 🎉');
    });
  }
});</textarea>
        </section>
      </div>
    </section>

    <div id="resizer" aria-hidden="true"></div>

    <section id="previewPane" class="pane pane-preview" aria-label="Aperçu">
      <div class="pane-header">
        <span>Aperçu</span>
        <span class="preview-hint">sandbox / srcdoc</span>
      </div>
      <iframe id="viewer" sandbox="allow-scripts" tabindex="-1" title="Aperçu du code"></iframe>
    </section>
  </main>

  <div id="status" role="status" aria-live="polite">Prêt</div>

  <div id="saveModal" class="modal hidden" aria-hidden="true">
    <div class="modal-content">
      <h2>Sauvegarder le fichier actif</h2>
      <label for="filename">Nom du fichier</label>
      <input id="filename" type="text" placeholder="mon-fichier" />
      <div class="modal-buttons">
        <button id="cancelSaveBtn" type="button" class="btn btn-secondary">Annuler</button>
        <button id="confirmSaveBtn" type="button" class="btn btn-primary">Télécharger</button>
      </div>
    </div>
  </div>

  <div id="exportZipModal" class="modal hidden" aria-hidden="true">
    <div class="modal-content">
      <h2>Exporter le projet</h2>

      <label for="zipFolderName">Nom du dossier</label>
      <input id="zipFolderName" type="text" value="mon_projet" placeholder="mon_projet" />

      <label class="check-row">
        <input type="checkbox" id="zipIncludeReadme" checked />
        <span>Inclure un README.md</span>
      </label>

      <label class="check-row">
        <input type="checkbox" id="zipPreviewStructure" checked />
        <span>Afficher la structure</span>
      </label>

      <pre id="zipStructurePreview" class="zip-preview"></pre>

      <div class="modal-buttons">
        <button id="cancelExportZipBtn" type="button" class="btn btn-secondary">Annuler</button>
        <button id="confirmExportZipBtn" type="button" class="btn btn-primary">Exporter ZIP</button>
      </div>
    </div>
  </div>

  <!-- CodeMirror core -->
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/lib/codemirror.min.js" integrity="sha384-mrit0DKzgTOYl4hNHMU+T7t0/ZMk85xHVtSW5jqoKpbI63sIST7QMABKBQ7PLc/h" crossorigin="anonymous"></script>

  <!-- Modes -->
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/mode/xml/xml.min.js" integrity="sha384-C/TRA7UeA98ARyJg3luDaY35lAo5xPYxFJxJ3mkAl6lMe7/aWa6uXzLAKpUr2Sod" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/mode/javascript/javascript.min.js" integrity="sha384-A++nJ9Gpr+ghHv17VzpmxsGIPCjAm0nN0V5pQwx1UzeZQB1UiuAAcyRCqCgueEsY" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/mode/css/css.min.js" integrity="sha384-1AHaMt2GR+tbr+IjHQEgnQ11EhkbreoZGlr9BnOwf9YkhyR7wGXIg4tUMOMx45wd" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/mode/htmlmixed/htmlmixed.min.js" integrity="sha384-bl89SfclQ7sndast1KL1mwov4JagTNH02UqVzOAHzyoPS2k2uvhQnkw6A0U49af4" crossorigin="anonymous"></script>

  <!-- Addons -->
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/addon/edit/closebrackets.min.js" integrity="sha384-hBecqjI4XNNQRwFZJeeHJcKjUi106ITOkb0SCI3dKQGQz3fpTzQJwUxmwhYTj3iR" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/addon/edit/matchbrackets.min.js" integrity="sha384-8hJWmYgam1/rlps5AkxiosWVvegPxaXMY4GrUsLFaOGntQbSk4dN1wrqmORW65nM" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.2/addon/selection/active-line.min.js" integrity="sha384-qZGar2ZicPDbTAQNd1uGm8l6XJeP4Rh2qHv7OUdnsYoKw46P3yv3LTYVa475mcNF" crossorigin="anonymous"></script>

  <script src="main.js"></script>
</body>
</html>
