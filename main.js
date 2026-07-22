const DEFAULT_PROJECT = {
  html: `<main class="demo">
  <h1>Bonjour 👋</h1>
  <p>Commencez à écrire votre HTML dans l’éditeur.</p>
  <button id="demoBtn">Clique-moi</button>
</main>`,
  css: `:root {
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
}`,
  js: `document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('demoBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      alert('Le JavaScript fonctionne 🎉');
    });
  }
});`,
};

const STORAGE_KEYS = {
  html: "rt_editor_html",
  css: "rt_editor_css",
  js: "rt_editor_js",
  theme: "rt_editor_theme",
};

const state = {
  htmlEditor: null,
  cssEditor: null,
  jsEditor: null,
  currentTheme: "dracula",
  activeEditor: "html",
  saveTimer: null,
  previewTimer: null,
  lastPreviewError: null,
  previewJsLineOffset: 0,
  isResizing: false,
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

function setStatus(message) {
  const node = $("#status");
  if (node) node.textContent = message;
}

function showNotification(message, type = "success") {
  const node = document.createElement("div");
  node.className = `notification ${type}`;
  node.textContent = message;
  document.body.appendChild(node);

  setTimeout(() => {
    node.style.opacity = "0";
    node.style.transform = "translateY(-8px)";
    setTimeout(() => node.remove(), 240);
  }, 2200);
}

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadTextFile(
  content,
  filename,
  type = "text/plain;charset=utf-8",
) {
  downloadBlob(new Blob([content], { type }), filename);
}

function getEditorsMap() {
  return {
    html: state.htmlEditor,
    css: state.cssEditor,
    js: state.jsEditor,
  };
}

function getActiveEditorInstance() {
  return getEditorsMap()[state.activeEditor];
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makeTextareaAdapter(selector) {
  const textarea = $(selector);
  if (!textarea) return null;
  return {
    getValue() {
      return textarea.value;
    },
    setValue(value) {
      textarea.value = value;
    },
    focus() {
      textarea.focus();
    },
    replaceSelection(text) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value =
        textarea.value.slice(0, start) + text + textarea.value.slice(end);
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
    },
    setCursor(pos) {
      // Convertit {line, ch} de CodeMirror en position absolue pour textarea
      const lines = textarea.value.split("\n");
      let offset = 0;
      for (let i = 0; i < pos.line && i < lines.length; i++) {
        offset += lines[i].length + 1; // +1 pour '\n'
      }
      offset += Math.min(pos.ch, lines[pos.line]?.length || 0);
      textarea.setSelectionRange(offset, offset);
    },
    scrollIntoView(pos, margin) {
      // Pour textarea natif, focus + scroll vers le curseur
      if (pos) this.setCursor(pos);
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    refresh() {},
    setOption() {},
    on(event, callback) {
      // Implémente les event listeners pour le fallback textarea
      if (event === "change") {
        textarea.addEventListener("input", callback);
      } else if (event === "focus") {
        textarea.addEventListener("focus", callback);
      }
      // Retourne this pour permettre le chaînage
      return this;
    },
  };
}

function enableTextareaFallback() {
  $$(".editor-block").forEach((block) =>
    block.classList.add("textarea-fallback"),
  );
  $$(".editor-block textarea").forEach((textarea) => {
    textarea.style.display = "block";
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.padding = "16px";
    textarea.style.fontFamily = "Menlo, Consolas, Monaco, monospace";
    textarea.style.fontSize = "0.95rem";
    textarea.style.lineHeight = "1.6";
    textarea.style.background = "transparent";
    textarea.style.color = "inherit";
    textarea.style.border = "0";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
  });
  showNotification(
    "CodeMirror indisponible — éditeurs natifs activés",
    "warning",
  );
}

function isFullHtmlDocument(text) {
  return /^\s*<!doctype\s+html/i.test(text) || /^\s*<html[\s>]/i.test(text);
}

function getPreviewBodyHtml(html) {
  if (!isFullHtmlDocument(html)) return { bodyHtml: html, headCss: "" };
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const headCss = [...doc.querySelectorAll("head style")]
      .map((node) => node.textContent.trim())
      .filter(Boolean)
      .join("\n\n");
    return {
      bodyHtml: doc.body ? doc.body.innerHTML : html,
      headCss,
    };
  } catch {
    return { bodyHtml: html, headCss: "" };
  }
}

function getPreviewErrorHandlerScript() {
  return `window.addEventListener('error', function(event) {
  try {
    parent.postMessage({
      type: 'preview-error',
      message: event.message || 'Erreur JavaScript',
      line: event.lineno || 0,
      column: event.colno || 0,
      stack: event.error && event.error.stack ? event.error.stack : null
    }, '*');
  } catch (e) {}
});

window.addEventListener('unhandledrejection', function(event) {
  try {
    const reason = event.reason;
    parent.postMessage({
      type: 'preview-error',
      message: reason && reason.message ? reason.message : 'Promesse rejetée',
      line: 0,
      column: 0,
      stack: reason && reason.stack ? reason.stack : null
    }, '*');
  } catch (e) {}
});`;
}

function buildPreviewDocument(html, css, js) {
  const { bodyHtml, headCss } = getPreviewBodyHtml(html);
  const mergedCss = [headCss, css].filter((part) => part && part.trim()).join("\n\n");
  const styleBlock = `html, body { margin: 0; padding: 0; }
    ${mergedCss}`;

  const beforeUserJs = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    ${styleBlock}
  </style>
</head>
<body>
  ${bodyHtml}
  <script>
${getPreviewErrorHandlerScript()}
  <\/script>
  <script>
`;
  const afterUserJs = `
  <\/script>
</body>
</html>`;

  // Ligne 1-based du début du JS utilisateur dans le document srcdoc
  state.previewJsLineOffset = beforeUserJs.split("\n").length;
  return beforeUserJs + js + afterUserJs;
}

function buildExportIndexHtml(htmlContent) {
  let bodyHtml = htmlContent;
  let title = "Projet";

  if (isFullHtmlDocument(htmlContent)) {
    try {
      const doc = new DOMParser().parseFromString(htmlContent, "text/html");
      bodyHtml = doc.body ? doc.body.innerHTML.trim() : htmlContent;
      const titleNode = doc.querySelector("title");
      if (titleNode && titleNode.textContent.trim()) {
        title = titleNode.textContent.trim();
      }
    } catch {
      bodyHtml = htmlContent;
    }
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
${bodyHtml}
  <script src="script.js"><\/script>
</body>
</html>
`;
}

function updatePreview() {
  const html = state.htmlEditor.getValue();
  const css = state.cssEditor.getValue();
  const js = state.jsEditor.getValue();
  const iframe = $("#viewer");

  if (!iframe) return;

  const totalSize = (html + css + js).length;
  if (totalSize > 50000) {
    showNotification(
      "⚠️ Code très volumineux (>50KB) — performance réduite",
      "warning",
    );
  }

  state.lastPreviewError = null;
  iframe.srcdoc = buildPreviewDocument(html, css, js);
  setStatus("Aperçu mis à jour");
}

function schedulePreviewAndSave() {
  clearTimeout(state.previewTimer);
  clearTimeout(state.saveTimer);

  state.previewTimer = setTimeout(updatePreview, 250);
  state.saveTimer = setTimeout(saveProjectToStorage, 400);
}

function saveProjectToStorage() {
  const ok1 = safeStorageSet(STORAGE_KEYS.html, state.htmlEditor.getValue());
  const ok2 = safeStorageSet(STORAGE_KEYS.css, state.cssEditor.getValue());
  const ok3 = safeStorageSet(STORAGE_KEYS.js, state.jsEditor.getValue());

  if (ok1 && ok2 && ok3) {
    setStatus("Sauvegarde locale effectuée");
  } else {
    setStatus("Sauvegarde mémoire uniquement");
  }
}

function restoreProject() {
  const html = safeStorageGet(STORAGE_KEYS.html);
  const css = safeStorageGet(STORAGE_KEYS.css);
  const js = safeStorageGet(STORAGE_KEYS.js);

  if (state.htmlEditor) state.htmlEditor.setValue(html ?? DEFAULT_PROJECT.html);
  if (state.cssEditor) state.cssEditor.setValue(css ?? DEFAULT_PROJECT.css);
  if (state.jsEditor) state.jsEditor.setValue(js ?? DEFAULT_PROJECT.js);

  if (html !== null || css !== null || js !== null) {
    showNotification("Projet restauré depuis la sauvegarde locale");
  }
}

function looksLikeFullHtmlDocument(text) {
  // Détecte si le texte ressemble à un document HTML complet
  return /<!doctype html>|<html[\s>]|<head[\s>]|<body[\s>]|<style[\s>]|<script[\s>]/i.test(
    text,
  );
}

function splitCombinedHtmlDocument(input) {
  // Parse et extrait HTML, CSS, JS d'un document complet
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "text/html");

  // Extrait tous les blocs <style>
  const styleNodes = [...doc.querySelectorAll("style")];
  const css = styleNodes
    .map((node) => node.textContent.trim())
    .filter(Boolean)
    .join("\n\n");

  // Extrait tous les blocs <script> inline (pas src="...")
  const scriptNodes = [...doc.querySelectorAll("script:not([src])")];
  const js = scriptNodes
    .map((node) => node.textContent.trim())
    .filter(Boolean)
    .join("\n\n");

  // Supprime les balises <style> et <script> du DOM
  styleNodes.forEach((node) => node.remove());
  scriptNodes.forEach((node) => node.remove());

  // Récupère le HTML nettoyé
  let html = "";
  if (doc.body && doc.body.innerHTML.trim()) {
    html = doc.body.innerHTML.trim();
  } else {
    html = doc.documentElement
      ? doc.documentElement.outerHTML.trim()
      : input.trim();
  }

  return { html, css, js };
}

function applyPastedContent(html, css, js) {
  // Remplît les trois éditeurs avec le contenu extrait
  if (html) state.htmlEditor.setValue(html);
  if (css) state.cssEditor.setValue(css);
  if (js) state.jsEditor.setValue(js);
  updatePreview();
  showNotification("Document réparti en HTML/CSS/JS");
}

/**
 * Tente de répartir un collage multi-langage.
 * @returns {'distributed'|'declined'|'plain'} 
 * distributed = réparti, declined = user a refusé (coller brut), plain = pas de doc combiné
 */
function tryDistributePastedDocument(text) {
  if (!text || !looksLikeFullHtmlDocument(text)) return "plain";

  const { html, css, js } = splitCombinedHtmlDocument(text);
  const hasStyles = css && css.trim().length > 0;
  const hasScripts = js && js.trim().length > 0;

  if (!hasStyles && !hasScripts) return "plain";

  if (
    confirm(
      "Document détecté avec HTML, CSS et JS.\nRépartir automatiquement dans les trois panneaux ?",
    )
  ) {
    applyPastedContent(html, css, js);
    return "distributed";
  }

  return "declined";
}

function createEditor(textareaSelector, mode) {
  return CodeMirror.fromTextArea($(textareaSelector), {
    mode,
    theme: state.currentTheme,
    lineNumbers: true,
    lineWrapping: true,
    indentUnit: 2,
    tabSize: 2,
    matchBrackets: true,
    autoCloseBrackets: true,
    styleActiveLine: true,
    viewportMargin: Infinity,
  });
}

function initEditors() {
  const hasCodeMirror = typeof CodeMirror !== "undefined";

  if (!hasCodeMirror) {
    state.htmlEditor = makeTextareaAdapter("#htmlEditor");
    state.cssEditor = makeTextareaAdapter("#cssEditor");
    state.jsEditor = makeTextareaAdapter("#jsEditor");
    enableTextareaFallback();
  } else {
    try {
      state.htmlEditor = createEditor("#htmlEditor", "htmlmixed");
      state.cssEditor = createEditor("#cssEditor", "css");
      state.jsEditor = createEditor("#jsEditor", "javascript");

      // Applique la classe .editor-ready APRÈS l'init CodeMirror
      // pour masquer le textarea source sans affecter le DOM interne
      $$(".editor-block").forEach((block) => {
        block.classList.add("editor-ready");
      });
    } catch (error) {
      console.error("CodeMirror init failed:", error);
      state.htmlEditor = makeTextareaAdapter("#htmlEditor");
      state.cssEditor = makeTextareaAdapter("#cssEditor");
      state.jsEditor = makeTextareaAdapter("#jsEditor");
      enableTextareaFallback();
    }
  }

  const mapping = {
    html: state.htmlEditor,
    css: state.cssEditor,
    js: state.jsEditor,
  };

  Object.entries(mapping).forEach(([key, editor]) => {
    const panel = document.querySelector(`[data-editor-panel="${key}"]`);
    const textarea = document.querySelector(`#${key}Editor`);

    const handleFocus = () => {
      state.activeEditor = key;
      syncActiveButtons();
      $$(".editor-block").forEach((block) =>
        block.classList.remove("is-focused"),
      );
      if (panel) panel.classList.add("is-focused");
    };

    if (editor && typeof editor.on === "function") {
      editor.on("focus", handleFocus);
      editor.on("change", schedulePreviewAndSave);
    } else if (textarea) {
      textarea.addEventListener("focus", handleFocus);
      textarea.addEventListener("input", schedulePreviewAndSave);
    }
  });
}

function syncActiveButtons() {
  $$(".switch-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.editor === state.activeEditor);
  });
}

function setupEditorSwitches() {
  $$(".switch-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.editor;
      const editor = getEditorsMap()[target];
      state.activeEditor = target;
      syncActiveButtons();
      if (editor) {
        editor.focus();
        if (typeof editor.refresh === "function") editor.refresh();
      }
    });
  });
}

function setTheme(theme) {
  state.currentTheme = theme;
  document.body.classList.toggle("light", theme === "mdn-like");

  [state.htmlEditor, state.cssEditor, state.jsEditor].forEach((editor) => {
    if (editor) editor.setOption("theme", theme);
  });

  const toggle = $("#themeToggle");
  if (toggle) toggle.textContent = theme === "dracula" ? "🌙" : "☀️";

  safeStorageSet(STORAGE_KEYS.theme, theme);
}

function setupTheme() {
  const savedTheme = safeStorageGet(STORAGE_KEYS.theme);
  state.currentTheme = savedTheme || "dracula";
  setTheme(state.currentTheme);

  $("#themeToggle").addEventListener("click", () => {
    const next = state.currentTheme === "dracula" ? "mdn-like" : "dracula";
    setTheme(next);
    showNotification(`Thème ${next === "dracula" ? "sombre" : "clair"} activé`);
  });
}

function getCurrentFileInfo() {
  switch (state.activeEditor) {
    case "html":
      return {
        content: state.htmlEditor.getValue(),
        extension: ".html",
        mime: "text/html;charset=utf-8",
      };
    case "css":
      return {
        content: state.cssEditor.getValue(),
        extension: ".css",
        mime: "text/css;charset=utf-8",
      };
    case "js":
      return {
        content: state.jsEditor.getValue(),
        extension: ".js",
        mime: "application/javascript;charset=utf-8",
      };
    default:
      return {
        content: "",
        extension: ".txt",
        mime: "text/plain;charset=utf-8",
      };
  }
}

function setupButtons() {
  $("#runPreviewBtn").addEventListener("click", () => {
    updatePreview();
    showNotification("Aperçu rafraîchi");
  });

  $("#copyCode").addEventListener("click", async () => {
    const editor = getActiveEditorInstance();
    if (!editor) return;

    try {
      await navigator.clipboard.writeText(editor.getValue());
      showNotification("Code copié");
    } catch {
      showNotification("Copie impossible", "error");
    }
  });

  $("#pasteCode").addEventListener("click", async () => {
    const editor = getActiveEditorInstance();
    if (!editor) return;

    try {
      const text = await navigator.clipboard.readText();
      const result = tryDistributePastedDocument(text);
      if (result === "distributed") return;
      editor.replaceSelection(text);
      schedulePreviewAndSave();
      updatePreview();
      showNotification("Code collé");
    } catch {
      showNotification("Collage impossible", "error");
    }
  });

  $("#clearCode").addEventListener("click", () => {
    const editor = getActiveEditorInstance();
    if (!editor) return;

    if (confirm(`Effacer l’éditeur ${state.activeEditor.toUpperCase()} ?`)) {
      editor.setValue("");
      updatePreview();
      showNotification(`Éditeur ${state.activeEditor.toUpperCase()} vidé`);
    }
  });

  $("#clearAllCode").addEventListener("click", () => {
    if (!confirm("Effacer HTML, CSS et JS ?")) return;

    state.htmlEditor.setValue("");
    state.cssEditor.setValue("");
    state.jsEditor.setValue("");
    updatePreview();
    showNotification("Tous les éditeurs ont été effacés");
  });

  $("#saveCode").addEventListener("click", () => openModal("#saveModal"));
  $("#cancelSaveBtn").addEventListener("click", () => closeModal("#saveModal"));

  $("#confirmSaveBtn").addEventListener("click", () => {
    const baseName = ($("#filename").value || "mon-fichier")
      .trim()
      .replace(/[^\w\-]+/g, "-");
    const { content, extension, mime } = getCurrentFileInfo();
    downloadTextFile(content, `${baseName}${extension}`, mime);
    closeModal("#saveModal");
    showNotification("Fichier téléchargé");
  });

  $("#saveProjectBtn").addEventListener("click", () => {
    updateZipPreview();
    openModal("#exportZipModal");
  });

  $("#cancelExportZipBtn").addEventListener("click", () =>
    closeModal("#exportZipModal"),
  );
  $("#confirmExportZipBtn").addEventListener("click", exportProjectAsZip);

  $("#gotoErrorBtn").addEventListener("click", () => {
    if (!state.lastPreviewError) {
      showNotification("Aucune erreur JS récente", "warning");
      return;
    }

    state.activeEditor = "js";
    syncActiveButtons();
    state.jsEditor.focus();

    // line déjà normalisée en 1-based panneau JS (voir setupPreviewErrorChannel)
    const line = Math.max(0, (state.lastPreviewError.line || 1) - 1);
    const ch = Math.max(0, (state.lastPreviewError.column || 1) - 1);

    try {
      if (typeof state.jsEditor.setCursor === "function") {
        state.jsEditor.setCursor({ line, ch });
      }
      if (typeof state.jsEditor.scrollIntoView === "function") {
        state.jsEditor.scrollIntoView({ line, ch }, 120);
      }
      showNotification("Curseur déplacé vers l’erreur JS", "warning");
    } catch {
      showNotification("Navigation vers l’erreur impossible", "error");
    }
  });
}

function updateZipPreview() {
  const folder =
    ($("#zipFolderName").value || "mon_projet").trim() || "mon_projet";
  const includeReadme = $("#zipIncludeReadme").checked;
  const showPreview = $("#zipPreviewStructure").checked;
  const node = $("#zipStructurePreview");

  let lines = [
    `${folder}/`,
    `├── index.html`,
    `├── styles.css`,
    `└── script.js`,
  ];

  if (includeReadme) {
    lines = [
      `${folder}/`,
      `├── index.html`,
      `├── styles.css`,
      `├── script.js`,
      `└── README.md`,
    ];
  }

  node.textContent = lines.join("\n");
  node.classList.toggle("is-visible", showPreview);
}

function sanitizeZipFolderName(name) {
  const cleaned = String(name || "mon_projet")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\.+/g, ".")
    .replace(/^\.+/, "")
    .replace(/[^\w\-.\u00C0-\u024F ]+/g, "-")
    .replace(/\s+/g, "_")
    .slice(0, 80);
  return cleaned || "mon_projet";
}

/** Table CRC32 (ZIP). */
const ZIP_CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function zipCrc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = ZIP_CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function concatUint8Arrays(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

/**
 * ZIP natif (méthode STORE) — sans JSZip / CDN.
 * @param {{ path: string, content: string }[]} entries
 */
function createStoreZipBlob(entries) {
  const encoder = new TextEncoder();
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.path.replace(/\\/g, "/"));
    const dataBytes = encoder.encode(entry.content ?? "");
    const crc = zipCrc32(dataBytes);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true); // UTF-8
    lv.setUint16(8, 0, true); // STORE
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataBytes.length, true);
    lv.setUint32(22, dataBytes.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    const localFile = concatUint8Arrays([localHeader, dataBytes]);
    locals.push(localFile);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataBytes.length, true);
    cv.setUint32(24, dataBytes.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);
    centrals.push(centralHeader);

    offset += localFile.length;
  }

  const centralDir = concatUint8Arrays(centrals);
  const endRecord = new Uint8Array(22);
  const ev = new DataView(endRecord.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralDir.length, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const zipBytes = concatUint8Arrays([...locals, centralDir, endRecord]);
  return new Blob([zipBytes], { type: "application/zip" });
}

async function exportProjectAsZip() {
  try {
    const folderName = sanitizeZipFolderName(
      $("#zipFolderName")?.value || "mon_projet",
    );
    const includeReadme = Boolean($("#zipIncludeReadme")?.checked);

    const entries = [
      {
        path: `${folderName}/index.html`,
        content: buildExportIndexHtml(state.htmlEditor.getValue()),
      },
      {
        path: `${folderName}/styles.css`,
        content: state.cssEditor.getValue(),
      },
      {
        path: `${folderName}/script.js`,
        content: state.jsEditor.getValue(),
      },
    ];

    if (includeReadme) {
      entries.push({
        path: `${folderName}/README.md`,
        content: `# ${folderName}

Projet exporté depuis l’éditeur HTML temps réel.

## Fichiers
- index.html
- styles.css
- script.js
`,
      });
    }

    const blob = createStoreZipBlob(entries);
    downloadBlob(blob, `${folderName}.zip`);
    closeModal("#exportZipModal");
    showNotification("Projet ZIP exporté");
  } catch (error) {
    console.error("exportProjectAsZip:", error);
    showNotification(
      `Erreur export ZIP: ${error?.message || "inconnue"}`,
      "error",
    );
  }
}

function openModal(selector) {
  const modal = $(selector);
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  const input = $("input", modal);
  if (input) setTimeout(() => input.focus(), 20);
}

function closeModal(selector) {
  const modal = $(selector);
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function setupModalHandlers() {
  ["#saveModal", "#exportZipModal"].forEach((selector) => {
    const modal = $(selector);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(selector);
    });
  });

  $("#zipFolderName").addEventListener("input", updateZipPreview);
  $("#zipIncludeReadme").addEventListener("change", updateZipPreview);
  $("#zipPreviewStructure").addEventListener("change", updateZipPreview);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal("#saveModal");
      closeModal("#exportZipModal");
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      openModal("#saveModal");
    }
  });
}

function setupResizer() {
  const resizer = $("#resizer");
  const editorPane = $("#editorPane");
  const container = $(".app-shell");

  if (!resizer || !editorPane || !container) return;

  resizer.addEventListener("mousedown", (event) => {
    state.isResizing = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor =
      window.innerWidth <= 980 ? "row-resize" : "col-resize";
    event.preventDefault();
  });

  document.addEventListener("mousemove", (event) => {
    if (!state.isResizing) return;

    const rect = container.getBoundingClientRect();
    const mobile = window.innerWidth <= 980;

    if (mobile) {
      const newHeight = event.clientY - rect.top;
      const min = 180;
      const max = rect.height - 180;

      if (newHeight >= min && newHeight <= max) {
        editorPane.style.flex = "none";
        editorPane.style.height = `${newHeight}px`;
      }
      return;
    }

    const newWidth = event.clientX - rect.left;
    const min = 260;
    const max = rect.width - 260;

    if (newWidth >= min && newWidth <= max) {
      editorPane.style.flex = "none";
      editorPane.style.width = `${newWidth}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    state.isResizing = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    // Refresh tous les éditeurs après resize pour éviter les problèmes de layout CodeMirror
    [state.htmlEditor, state.cssEditor, state.jsEditor].forEach((editor) => {
      if (editor && typeof editor.refresh === "function") {
        editor.refresh();
      }
    });
  });
}

function setupPreviewErrorChannel() {
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.type !== "preview-error") return;

    const rawLine = Number(data.line) || 0;
    const offset = state.previewJsLineOffset || 0;
    // Convertit lineno document srcdoc → lineno panneau JS (1-based)
    const editorLine =
      rawLine > 0 && offset > 0 ? Math.max(1, rawLine - offset + 1) : rawLine;

    state.lastPreviewError = {
      ...data,
      line: editorLine,
      column: Number(data.column) || 0,
      rawLine,
    };
    setStatus(`Erreur JS: ${data.message || "inconnue"}`);
    showNotification(
      `Erreur aperçu: ${data.message || "Erreur JavaScript"}`,
      "error",
    );
  });
}

function setupPasteHandlers() {
  const editors = [state.htmlEditor, state.cssEditor, state.jsEditor];

  editors.forEach((editor) => {
    if (!editor || typeof editor.on !== "function") return;

    editor.on("paste", (instance, event) => {
      const text = event.clipboardData?.getData("text/plain") || "";
      if (!text || !looksLikeFullHtmlDocument(text)) return;

      const result = tryDistributePastedDocument(text);
      if (result === "plain") return;

      event.preventDefault();
      if (result === "declined") {
        instance.replaceSelection(text);
      }
    });
  });
}

function init() {
  initEditors();
  restoreProject();
  setupEditorSwitches();
  setupTheme();
  setupButtons();
  setupModalHandlers();
  setupResizer();
  setupPasteHandlers();
  setupPreviewErrorChannel();

  syncActiveButtons();
  state.htmlEditor.focus();
  updatePreview();
  setStatus("Éditeur prêt");
  showNotification("Éditeur prêt");
}

document.addEventListener("DOMContentLoaded", init);
