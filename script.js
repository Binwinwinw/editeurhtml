// [1] Éditeur HTML/CSS/JS unifié - tout en un seul fichier

// [2] Constantes initiales
const initialHTML = '';
const initialCSS = '';
const initialJS = '';

// --- Variables globales éditeurs ---

// [3] Initialisation des éditeurs CodeMirror
function initializeEditors() {
  // [3.1] Création des éditeurs CodeMirror
  htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
    value: initialHTML,
    mode: "htmlmixed",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true,
    matchBrackets: true,
    indentUnit: 2,
    lineWrapping: true,
    readOnly: false
  });
  cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
    value: initialCSS,
    mode: "css",
    theme: "dracula",
    lineNumbers: true,
    matchBrackets: true,
    indentUnit: 2,
    lineWrapping: true,
    readOnly: false
  });
  jsEditor = CodeMirror.fromTextArea(document.getElementById('jsEditor'), {
    value: initialJS,
    mode: "javascript",
    theme: "dracula",
    lineNumbers: true,
    matchBrackets: true,
    indentUnit: 2,
    lineWrapping: true,
    readOnly: false
  });
}

// --- Notifications ---
function showNotification(message, type = 'success') {
  // [4] Affichage d'une notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'notificationSlideOut 0.4s ease-in forwards';
    setTimeout(() => notification.remove(), 400);
  }, 2200);
}

// --- Thème ---
function toggleTheme() {
  // [5] Changement de thème
  const isDark = htmlEditor.getOption('theme') === 'dracula';
  const newTheme = isDark ? 'mdn-like' : 'dracula';
  htmlEditor.setOption('theme', newTheme);
  cssEditor.setOption('theme', newTheme);
  jsEditor.setOption('theme', newTheme);
  document.body.classList.toggle('light', isDark);
  document.getElementById('themeToggle').textContent = isDark ? '🌙' : '☀️';
}

// --- Débounce ---
function debounce(fn, delay) {
  // [6] Fonction utilitaire debounce
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };






// --- Initialisation globale ---
document.addEventListener('DOMContentLoaded', () => {
  initializeEditors();
  setTimeout(() => {
    showNotification('Éditeur prêt ! Commencez à coder.', 'success');
    setupTabHandlers();
    setupButtonHandlers();
    setupEditorChangeHandlers();
    setupPasteHandlers();
    refreshPreview();
    if (htmlEditor) {
      htmlEditor.focus();
      setTimeout(() => {
        if (htmlEditor.execCommand) htmlEditor.execCommand('selectAll');
      }, 0);
    }
  }, 200);
});

// --- Variables globales pour les éditeurs ---
let htmlEditor, cssEditor, jsEditor;

// --- Initialisation des éditeurs CodeMirror ---
function initializeEditors() {
  htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
    value: initialHTML,
    mode: "htmlmixed",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true,
    matchBrackets: true,
    indentUnit: 2,
    lineWrapping: true,
    readOnly: false
  });
  htmlEditor.on('focus', () => {
    console.log('[DEBUG] Focus HTML editor');
  });
  cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
    value: initialCSS,
    mode: "css",
    theme: "dracula",
    lineNumbers: true,
    matchBrackets: true,
    indentUnit: 2,
    lineWrapping: true,
    readOnly: false
  });
  cssEditor.on('focus', () => {
    console.log('[DEBUG] Focus CSS editor');
  });
  jsEditor = CodeMirror.fromTextArea(document.getElementById('jsEditor'), {
    value: initialJS,
    mode: "javascript",
    theme: "dracula",
    lineNumbers: true,
    matchBrackets: true,
    indentUnit: 2,
    lineWrapping: true,
    readOnly: false
  });
  jsEditor.on('focus', () => {
    console.log('[DEBUG] Focus JS editor');
  });

  // Afficher uniquement l'éditeur HTML au démarrage
  setTimeout(() => {
    // Ajoute la classe active sur le wrapper de htmlEditor
    if (htmlEditor.display && htmlEditor.display.wrapper) {
      htmlEditor.display.wrapper.classList.add('active');
      htmlEditor.display.wrapper.style.display = 'block';
      htmlEditor.focus();
    }
    // Masquer les autres
    if (cssEditor.display && cssEditor.display.wrapper) {
      cssEditor.display.wrapper.classList.remove('active');
      cssEditor.display.wrapper.style.display = 'none';
    }
    if (jsEditor.display && jsEditor.display.wrapper) {
      jsEditor.display.wrapper.classList.remove('active');
      jsEditor.display.wrapper.style.display = 'none';
    }
  }, 50);
}

// --- Fonction pour combiner le code des trois éditeurs ---
function combineCode() {
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();
  
  // Extraire la partie head et body du HTML
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  
  let headContent = headMatch ? headMatch[1] : '';
  let bodyContent = bodyMatch ? bodyMatch[1] : html;
  
  // Ajouter le CSS dans la balise head
  if (css.trim()) {
    headContent += `<style>${css}</style>`;
  }
  
  // Ajouter le JavaScript à la fin du body
  if (js.trim()) {
    bodyContent += `<script>${js}<\/script>`;
  }
  
  // Reconstruire le document HTML complet
  return html
    .replace(/<head[^>]*>([\s\S]*?)<\/head>/i, `<head>${headContent}</head>`)
    .replace(/<body[^>]*>([\s\S]*?)<\/body>/i, `<body>${bodyContent}</body>`);
}

// --- Système de notifications et accessibilité ---

// Système de notifications
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'notificationSlideIn 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// États de chargement
function setLoadingState(element, isLoading) {
  if (isLoading) {
    element.classList.add('loading');
    element.setAttribute('aria-busy', 'true');
  } else {
    element.classList.remove('loading');
    element.setAttribute('aria-busy', 'false');
  }
}

// Gestion du focus de la modal
function setupModalFocus() {
  const modal = document.getElementById('saveModal');
  const firstFocusable = modal.querySelector('input');
  const lastFocusable = modal.querySelector('#cancelSaveBtn');
  
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.style.display = 'none';
    }
    
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
}

// --- Fonction de détection et répartition des langages ---
function parseMultiLanguageCode(pastedCode) {
  // [7] Détection et extraction multi-langage lors du collage
  const result = {
    html: '',
    css: '',
    js: ''
  };
  
  // Détecter et extraire le CSS
  const cssMatch = pastedCode.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (cssMatch) {
    result.css = cssMatch.map(match => 
      match.replace(/<\/?style[^>]*>/gi, '')
    ).join('\n\n').trim();
  }

  // Détecter et extraire le JavaScript (exclure les <script src=...>)
  // On ne prend que les <script> sans attribut src
  const jsMatch = pastedCode.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi);
  if (jsMatch) {
    result.js = jsMatch.map(match => 
      match.replace(/<\/?script[^>]*>/gi, '')
    ).join('\n\n').trim();
  }
  
  // Le HTML restant (sans les balises style et script)
  let cleanHtml = pastedCode
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .trim();
  
  // Si c'est du HTML complet, le garder tel quel
  if (cleanHtml.includes('<html') || cleanHtml.includes('<!DOCTYPE')) {
    result.html = cleanHtml;
  } else if (cleanHtml) {
    // Si c'est juste du contenu, l'encapsuler dans une structure HTML basique
    result.html = `<!DOCTYPE html>
<html>
<head>
    <title>Mon Code</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
${cleanHtml}
</body>
</html>`;
  }
  
  return result;
}

// --- Fonction de réinitialisation avec code initial ---
function resetAllEditors() {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous los éditeurs ? Cette action est irréversible.')) {
    htmlEditor.setValue(initialHTML);
    cssEditor.setValue(initialCSS);
    jsEditor.setValue(initialJS);
    
    document.getElementById('status').textContent = 'Tous les éditeurs ont été réinitialisés';
    setTimeout(() => {
      document.getElementById('status').textContent = 'Prêt';
    }, 3000);
    
    // Rafraîchir l'aperçu
    refreshPreview();
  }
}

// --- Fonction pour vider complètement les éditeurs ---
function clearAllEditors() {
  htmlEditor.setValue('');
  cssEditor.setValue('');
  jsEditor.setValue('');
  // Vider aussi l'aperçu
  if (typeof viewer !== 'undefined') viewer.srcdoc = '';
  document.getElementById('status').textContent = 'Éditeurs vidés - Prêt pour un nouveau code';
  setTimeout(() => {
    document.getElementById('status').textContent = 'Prêt - En attente de votre code';
  }, 3000);
  // Les éditeurs restent éditables
  htmlEditor.setOption('readOnly', false);
  cssEditor.setOption('readOnly', false);
  jsEditor.setOption('readOnly', false);
  // Focus et sélectionne tout dans l'éditeur actif
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    const type = activeTab.getAttribute('data-editor');
    let ed = null;
    if (type === 'html') ed = htmlEditor;
    else if (type === 'css') ed = cssEditor;
    else if (type === 'js') ed = jsEditor;
    if (ed) {
      ed.focus();
      if (ed.execCommand) ed.execCommand('selectAll');
    }
  }
}

// Fin de clearAllEditors


// --- Fonction principale de rafraîchissement ---
function refreshPreview() {
  // [8] Rafraîchissement de l'aperçu (iframe)
  try {
    const combinedCode = combineCode();
    document.getElementById('status').textContent = 'Aperçu actualisé';
    
    // Injection du code combiné dans l'iframe
    viewer.srcdoc = combinedCode;
    
    // Écouter les clics dans l'iframe pour détecter le bouton de test
    viewer.onload = function() {
      try {
        const iframeDoc = viewer.contentDocument || viewer.contentWindow.document;
        const testButton = iframeDoc.getElementById('testButton');
        if (testButton) {
          // Le bouton 'Cliquez-moi !' n'a plus d'action après suppression des données
          testButton.addEventListener('click', function() {
            // Ne rien faire
          });
        }
      } catch (e) {
        // Ignorer les erreurs cross-origin si elles se produisent
        console.log('Impossible d\'accéder au contenu de l\'iframe:', e);
      }
    };
    
  } catch (error) {
    console.error('Erreur:', error);
    document.getElementById('status').textContent = 'Erreur: ' + error.message;
  }
}

// --- Gestion des onglets ---
// Dans la fonction setupTabHandlers(), remplacez par :
function setupTabHandlers() {
  // [9] Gestion des onglets éditeurs
  // [10] Gestion des boutons de la barre d'outils
  // [11] Gestion du collage multi-langage dans chaque éditeur
  // [12] Rafraîchissement automatique de l'aperçu à chaque modification
  // [13] Initialisation globale au chargement du DOM
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      // Désactiver tous les onglets
      document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      
      // Activer l'onglet cliqué
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      
      const editorType = this.getAttribute('data-editor');
      
      // Afficher/masquer les éditeurs de manière plus simple
      const editors = {
        'html': htmlEditor,
        'css': cssEditor, 
        'js': jsEditor
      };
      
      // Masquer tous les wrappers d'éditeurs et retirer la classe active
      document.querySelectorAll('.CodeMirror').forEach(cm => {
        cm.style.display = 'none';
        cm.classList.remove('active');
      });

      // Afficher et activer l'éditeur sélectionné
      const activeEditor = editors[editorType];
      if (activeEditor && activeEditor.getWrapperElement()) {
        const wrapper = activeEditor.getWrapperElement();
        wrapper.style.display = 'block';
        wrapper.classList.add('active');
        setTimeout(() => {
          activeEditor.refresh();
          activeEditor.focus();
          if (activeEditor.execCommand) activeEditor.execCommand('selectAll');
        }, 50);
      }
      
      // Mettre à jour le statut
      document.getElementById('status').textContent = `Éditeur ${this.textContent} activé`;
      setTimeout(() => {
        document.getElementById('status').textContent = 'Prêt';
      }, 2000);
    });
  });
  
  // Forcer l'affichage initial de l'éditeur HTML
  setTimeout(() => {
    if (htmlEditor && htmlEditor.getWrapperElement()) {
      htmlEditor.getWrapperElement().style.display = 'block';
      htmlEditor.refresh();
    }
  }, 100);
}

// --- Fonction pour sauvegarder le code ---
function saveCode() {
  const modal = document.getElementById('saveModal');
  const filenameInput = document.getElementById('filename');
  filenameInput.value = 'mon_code'; // Valeur par défaut
  modal.style.display = 'flex';
  filenameInput.focus();
}

// --- Fonction pour télécharger le fichier ---
function downloadFile(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

// --- Gestion des thèmes ---
function toggleTheme() {
  const isDark = htmlEditor.getOption('theme') === 'dracula';
  const newTheme = isDark ? 'mdn-like' : 'dracula';
  
  htmlEditor.setOption('theme', newTheme);
  cssEditor.setOption('theme', newTheme);
  jsEditor.setOption('theme', newTheme);
  
  document.body.classList.toggle('light', isDark);
  document.getElementById('themeToggle').textContent = isDark ? '🌙' : '☀️';
}

// --- Gestion de la copie ---
function copyActiveCode() {
  // Déterminer quel éditeur est actif
  const activeTab = document.querySelector('.tab.active').getAttribute('data-editor');
  let codeToCopy = '';
  
  if (activeTab === 'html') codeToCopy = htmlEditor.getValue();
  else if (activeTab === 'css') codeToCopy = cssEditor.getValue();
  else if (activeTab === 'js') codeToCopy = jsEditor.getValue();
  
  navigator.clipboard.writeText(codeToCopy).then(() => {
    document.getElementById('status').textContent = 'Code copié !';
    setTimeout(() => document.getElementById('status').textContent = 'Prêt', 2000);
  }).catch(err => {
    document.getElementById('status').textContent = 'Erreur de copie';
  });
}

// --- Gestion de la sauvegarde ---
function setupSaveHandlers() {
  // Confirmation de sauvegarde
  document.getElementById('confirmSaveBtn').addEventListener('click', function() {
    const filename = document.getElementById('filename').value.trim() || 'mon_code';
    
    // Déterminer quel éditeur est actif et sauvegarder le contenu correspondant
    const activeTab = document.querySelector('.tab.active').getAttribute('data-editor');
    let contentToSave = '';
    let extension = '';
    
    let ed = null;
    if (activeTab === 'html') {
      htmlEditor.setValue('');
      htmlEditor.setOption('readOnly', false);
      ed = htmlEditor;
    } else if (activeTab === 'css') {
      cssEditor.setValue('');
      cssEditor.setOption('readOnly', false);
      ed = cssEditor;
    } else if (activeTab === 'js') {
      jsEditor.setValue('');
      jsEditor.setOption('readOnly', false);
      ed = jsEditor;
    }
    if (ed) {
      ed.focus();
      if (ed.execCommand) ed.execCommand('selectAll');
    }
    
    const fullFilename = filename + extension;
    
    // Télécharger le fichier
    downloadFile(contentToSave, fullFilename, 'text/plain');
    
    // Fermer le modal et mettre à jour le statut
    document.getElementById('saveModal').style.display = 'none';
    document.getElementById('status').textContent = `Fichier "${fullFilename}" sauvegardé`;
    
    setTimeout(() => {
      document.getElementById('status').textContent = 'Prêt';
    }, 3000);
  });

  // Annulation de sauvegarde
  document.getElementById('cancelSaveBtn').addEventListener('click', function() {
    document.getElementById('saveModal').style.display = 'none';
  });

  // Fermer le modal en cliquant à l'extérieur
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('saveModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// --- Redimensionnement ---
function setupResizer() {
  const resizer = document.getElementById('resizer');
  let isResizing = false;

  resizer.addEventListener('mousedown', function(e) {
    e.preventDefault();
    isResizing = true;
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isResizing) return;
    
    const editorPane = document.getElementById('editorPane');
    const containerRect = document.querySelector('.main').getBoundingClientRect();
    const newWidth = Math.max(100, Math.min(e.clientX - containerRect.left, containerRect.width - 100));
    
    editorPane.style.flex = `0 0 ${newWidth}px`;
  });

  document.addEventListener('mouseup', function() {
    isResizing = false;
    document.body.style.cursor = '';
  });
}

// --- Gestion du collage avec détection multi-langage ---
function setupPasteHandler(editor, editorType) {
  editor.getWrapperElement().addEventListener('paste', function(e) {
    setTimeout(function() {
      const pastedContent = editor.getValue();
      const parsed = parseMultiLanguageCode(pastedContent);
      // Compter le nombre de langages non vides
      const nonEmpty = [parsed.html, parsed.css, parsed.js].filter(x => x && x.trim() !== '').length;
      if (nonEmpty >= 2) {
        if (confirm('Code multi-langage détecté ! Voulez-vous le répartir automatiquement dans les éditeurs correspondants ?')) {
          if (parsed.html) htmlEditor.setValue(parsed.html);
          if (parsed.css) cssEditor.setValue(parsed.css);
          if (parsed.js) jsEditor.setValue(parsed.js);
          document.getElementById('status').textContent = 'Code réparti automatiquement dans les éditeurs';
          setTimeout(() => {
            document.getElementById('status').textContent = 'Prêt';
          }, 3000);
        } else {
          document.getElementById('status').textContent = 'Code collé - mise à jour...';
        }
      } else {
        document.getElementById('status').textContent = 'Code collé - mise à jour...';
      }
      refreshPreview();
    }, 100);
  });
}

// --- Gestionnaires d'événements ---
function setupEventListeners() {
  // Bouton "Coller" universel avec fallback prompt
  document.getElementById('pasteCode').addEventListener('click', async function() {
    const activeTab = document.querySelector('.tab.active').getAttribute('data-editor');
    let editor = null;
    if (activeTab === 'html') editor = htmlEditor;
    else if (activeTab === 'css') editor = cssEditor;
    else if (activeTab === 'js') editor = jsEditor;
    let pasted = '';
    if (navigator.clipboard && window.isSecureContext) {
      try {
        pasted = await navigator.clipboard.readText();
        console.log('[DEBUG] Collage via bouton, texte:', pasted);
      } catch (e) {
        console.warn('[DEBUG] Échec accès clipboard API', e);
      }
    }
    if (!pasted) {
      pasted = prompt('Impossible d\'accéder directement au presse-papiers. Collez ici (Ctrl+V) puis validez :');
      if (!pasted) {
        showNotification('Échec du collage (accès refusé ou annulé)', 'error');
        console.warn('[DEBUG] Collage refusé ou annulé');
        return;
      }
    }
    if (pasted) {
      if (editor && editor.replaceSelection) editor.replaceSelection(pasted);
      else if (editor && editor.setValue) editor.setValue(editor.getValue() + pasted);
      showNotification('Code collé dans l\'éditeur actif !');
      refreshPreview();
    }
  });
  // Changements dans les éditeurs
  htmlEditor.on('change', function() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(refreshPreview, 500);
  });

  cssEditor.on('change', function() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(refreshPreview, 500);
  });

  jsEditor.on('change', function() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(refreshPreview, 500);
  });

  // Boutons de la barre d'outils avec nouvelles fonctionnalités
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('copyCode').addEventListener('click', function() {
    const copyBtn = this;
    const activeTab = document.querySelector('.tab.active').getAttribute('data-editor');
    let codeToCopy = '';
    if (activeTab === 'html') codeToCopy = htmlEditor.getValue();
    else if (activeTab === 'css') codeToCopy = cssEditor.getValue();
    else if (activeTab === 'js') codeToCopy = jsEditor.getValue();
    setLoadingState(copyBtn, true);
    // Fallback universel pour copier dans le presse-papiers
    function fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      let successful = false;
      try {
        successful = document.execCommand('copy');
      } catch (err) {
        successful = false;
      }
      document.body.removeChild(textArea);
      return successful;
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(codeToCopy)
        .then(() => {
          showNotification('Code copié dans le presse-papiers !');
          copyBtn.classList.add('save-success');
          setTimeout(() => copyBtn.classList.remove('save-success'), 1000);
        })
        .catch(() => {
          if (fallbackCopyTextToClipboard(codeToCopy)) {
            showNotification('Code copié (fallback) !');
            copyBtn.classList.add('save-success');
            setTimeout(() => copyBtn.classList.remove('save-success'), 1000);
          } else {
            showNotification('Erreur lors de la copie', 'error');
            copyBtn.classList.add('error-state');
            setTimeout(() => copyBtn.classList.remove('error-state'), 1000);
          }
        })
        .finally(() => {
          setLoadingState(copyBtn, false);
        });
    } else {
      if (fallbackCopyTextToClipboard(codeToCopy)) {
        showNotification('Code copié (fallback) !');
        copyBtn.classList.add('save-success');
        setTimeout(() => copyBtn.classList.remove('save-success'), 1000);
      } else {
        showNotification('Erreur lors de la copie', 'error');
        copyBtn.classList.add('error-state');
        setTimeout(() => copyBtn.classList.remove('error-state'), 1000);
      }
      setLoadingState(copyBtn, false);
    }
  });
  
  document.getElementById('clearCode').addEventListener('click', function() {
    if (confirm('Êtes-vous sûr de vouloir effacer le code de l\'éditeur actuel ?')) {
      const activeTab = document.querySelector('.tab.active').getAttribute('data-editor');
      let editor = null;
      if (activeTab === 'html') {
        editor = htmlEditor;
      } else if (activeTab === 'css') {
        editor = cssEditor;
      } else if (activeTab === 'js') {
        editor = jsEditor;
      }
      if (editor) {
        editor.setValue('');
        editor.setOption('readOnly', false);
        editor.focus();
        // Sélectionner tout le contenu (même si vide, pour cohérence UX)
        setTimeout(() => {
          if (editor.execCommand) editor.execCommand('selectAll');
        }, 0);
      }
      showNotification('Code effacé');
      refreshPreview();
    }
  });
  
  document.getElementById('saveCode').addEventListener('click', function() {
    const modal = document.getElementById('saveModal');
    const filenameInput = document.getElementById('filename');
    
    modal.style.display = 'flex';
    filenameInput.focus();
    
    // Pré-remplir avec un nom de fichier logique
    const activeTab = document.querySelector('.tab.active').getAttribute('data-editor');
    filenameInput.value = `mon_${activeTab}`;
  });

  // Gestionnaires de collage
  setupPasteHandler(htmlEditor, 'html');
  setupPasteHandler(cssEditor, 'css');
  setupPasteHandler(jsEditor, 'js');
}

// --- Initialisation de l'application ---
function initializeApp() {
  // Initialiser les éditeurs CodeMirror
  initializeEditors();

  // Réinitialiser tous les éditeurs pour garantir un état propre
  if (typeof htmlEditor !== 'undefined' && typeof cssEditor !== 'undefined' && typeof jsEditor !== 'undefined') {
    htmlEditor.setValue('');
    cssEditor.setValue('');
    jsEditor.setValue('');
    // Réactive l'onglet HTML et masque les autres
    document.querySelectorAll('.tab').forEach(tab => {
      if (tab.getAttribute('data-editor') === 'html') {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    if (htmlEditor.display && htmlEditor.display.wrapper) {
      htmlEditor.display.wrapper.classList.add('active');
      htmlEditor.display.wrapper.style.display = 'block';
      htmlEditor.focus();
      // Sélectionner tout (pour permettre Ctrl+V ou saisie directe sans clic)
      setTimeout(() => {
        if (htmlEditor.execCommand) htmlEditor.execCommand('selectAll');
      }, 0);
    }
    if (cssEditor.display && cssEditor.display.wrapper) {
      cssEditor.display.wrapper.classList.remove('active');
      cssEditor.display.wrapper.style.display = 'none';
    }
    if (jsEditor.display && jsEditor.display.wrapper) {
      jsEditor.display.wrapper.classList.remove('active');
      jsEditor.display.wrapper.style.display = 'none';
    }
  }
  // Configurer tous les gestionnaires d'événements
  // [14] setupEventListeners();
  setupTabHandlers();
  // [15] setupSaveHandlers();
  // [16] setupResizer();
  // [17] setupTabAccessibility();
  // [18] setupModalFocus();
  // Rafraîchir l'aperçu initial
  setTimeout(refreshPreview, 100);
  // Message de bienvenue
  showNotification('Éditeur prêt ! Commencez à coder.', 'success');
}

// Démarrer l'application quand le DOM est chargé
// [13] Initialisation globale au chargement du DOM

// document.addEventListener('DOMContentLoaded', initializeApp);
// [99] Fin du script principal
}