/* =========================================================
 *  ÉDITEUR HTML / CSS / JS  –  main.js  (version corrigée)
 * ========================================================= */

// ----------  CONSTANTES  ----------
const INIT_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Editeur MultiLanguage</title>
    <style>
        body {
            font-family: system-ui;
            padding: 2rem;
            background: #f0f0f0;
        }
        h1 {
            color: #3498db;
        }
    </style>
</head>
<body>
    <h1>Bonjour !</h1>
    <p>Commencez à éditer votre code ici...</p>
</body>
</html>`;

const INIT_CSS  = `/* Votre CSS ici */
body {
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
}

h1 {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}`;

const INIT_JS   = `// Votre JavaScript ici
console.log('Éditeur HTML Temps Réel - Prêt !');

// ----------  ÉLÉMENTS GLOBAUX  ----------
let htmlEditor = null;
let cssEditor = null;
let jsEditor = null;
let currentTheme = 'dracula';
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page chargée');
    
    // Exemple d'interaction
    const btn = document.createElement('button');
    btn.textContent = 'Cliquez-moi';
    btn.style.padding = '10px 20px';
    btn.style.margin = '20px';
    btn.style.borderRadius = '5px';
    btn.style.border = 'none';
    btn.style.background = '#27ae60';
    btn.style.color = 'white';
    btn.style.cursor = 'pointer';
    
    btn.addEventListener('click', function() {
        alert('Bonjour depuis l\'éditeur !');
    });
    
    document.body.appendChild(btn);
});`;

// ----------  ÉLÉMENTS DOM  ----------
let htmlEditor, cssEditor, jsEditor;
let currentTheme = 'dracula';

// ----------  FONCTIONS UTILITAIRES  ----------
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ----------  INITIALISATION DES ÉDITEURS  ----------
    showActiveEditor('html');
    console.log('Initialisation de CodeMirror...');
    
function showActiveEditor(type) {
    // Gérer les onglets
    const tabs = $$('.tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-editor') === type) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Gérer la visibilité des éditeurs
    const editors = [
        { editor: htmlEditor, id: 'html' },
        { editor: cssEditor, id: 'css' },
        { editor: jsEditor, id: 'js' }
    ];

    editors.forEach(({ editor, id }) => {
        if (editor && editor.getWrapperElement) {
            const wrapper = editor.getWrapperElement();
            if (id === type) {
                wrapper.classList.add('active');
                // Rafraîchir et donner le focus
                setTimeout(() => {
                    editor.refresh();
                    editor.focus();
                }, 50);
            } else {
                wrapper.classList.remove('active');
            }
        }
    });
}
        console.log('Éditeur JS initialisé');
        console.log('JS Editor readOnly:', jsEditor.getOption('readOnly'));
        console.log('JS Editor textarea:', jsEditor.getTextArea());
    } catch (error) {
        console.error('Erreur initialisation JS:', error);
    }

    // Afficher l'éditeur HTML par défaut
    showActiveEditor('html');
}

function showActiveEditor(type) {
    // Masquer tous les éditeurs
    const editors = [
        { editor: htmlEditor, id: 'html' },
        { editor: cssEditor, id: 'css' },
        { editor: jsEditor, id: 'js' }
    ];

    editors.forEach(({ editor, id }) => {
        if (editor && editor.getWrapperElement) {
            const wrapper = editor.getWrapperElement();
            if (id === type) {
                wrapper.classList.add('active');
                wrapper.style.display = 'block';
                setTimeout(() => {
                    editor.refresh();
                    editor.focus();
                }, 50);
            } else {
                wrapper.classList.remove('active');
                wrapper.style.display = 'none';
            }
        } else if (!editor && id === type) {
            if (id === 'html') {
                htmlEditor = CodeMirror.fromTextArea($('#htmlEditor'), { lineNumbers: true, theme: currentTheme, mode: 'htmlmixed' });
                htmlEditor.setValue(INIT_HTML);
                setTimeout(() => {
                    htmlEditor.refresh();
                    htmlEditor.focus();
                }, 50);
            } else if (id === 'css') {
                cssEditor = CodeMirror.fromTextArea($('#cssEditor'), { lineNumbers: true, theme: currentTheme, mode: 'css' });
                cssEditor.setValue(INIT_CSS);
                setTimeout(() => {
                    cssEditor.refresh();
                    cssEditor.focus();
                }, 50);
            } else if (id === 'js') {
                jsEditor = CodeMirror.fromTextArea($('#jsEditor'), { lineNumbers: true, theme: currentTheme, mode: 'javascript' });
                jsEditor.setValue(INIT_JS);
                setTimeout(() => {
                    jsEditor.refresh();
                    jsEditor.focus();
                }, 50);
            }
        }
    });
}

// ----------  MISE À JOUR DE LA PRÉVISUALISATION  ----------
function updatePreview() {
    try {
        const html = htmlEditor ? htmlEditor.getValue() : '';
        const css = cssEditor ? cssEditor.getValue() : '';
        const js = jsEditor ? jsEditor.getValue() : '';

        // Validation JS simple : on tente un new Function
        let jsIsValid = true;
        if (js.trim()) {
            try {
                // eslint-disable-next-line no-new-func
                new Function(js);
            } catch (e) {
                jsIsValid = false;
            }
        }

        let fullDocument;
        if (jsIsValid) {
            fullDocument = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${js}<\/script>
</body>
</html>`;
        } else {
            fullDocument = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
    ${html}
    <div style='color: #e74c3c; font-weight: bold; padding: 1em;'>Erreur de syntaxe dans le code JavaScript : l'aperçu JS est désactivé.</div>
</body>
</html>`;
        }

        // Mettre à jour l'iframe
        const iframe = $('#viewer');
        if (iframe) {
            iframe.srcdoc = fullDocument;
        }

        // Mettre à jour le statut
        const status = $('#status');
        if (status) {
            status.textContent = jsIsValid ? 'Prévisualisation mise à jour' : 'Erreur JS dans l\'aperçu';
            setTimeout(() => {
                status.textContent = 'Prêt';
            }, 2000);
        }
        if (!jsIsValid) {
            showNotification('Erreur de syntaxe dans le JS', 'error');
        }
    } catch (error) {
        console.error('Erreur de prévisualisation:', error);
        showNotification('Erreur dans le code', 'error');
    }
}

// ----------  GESTION DES ONGLETS  ----------
function setupTabs() {
    const tabs = $$('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Retirer la classe active de tous les onglets
            tabs.forEach(t => t.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            
            // Afficher l'éditeur correspondant
            const editorType = this.getAttribute('data-editor');
            showActiveEditor(editorType);
        });
    });
}

// ----------  GESTION DES BOUTONS  ----------
function setupButtons() {
    console.log('Configuration des boutons...');
    
    // Bouton de changement de thème
    $('#themeToggle').addEventListener('click', function() {
        const newTheme = currentTheme === 'dracula' ? 'mdn-like' : 'dracula';
        currentTheme = newTheme;
        
        [htmlEditor, cssEditor, jsEditor].forEach(editor => {
            if (editor) {
                editor.setOption('theme', newTheme);
            }
        });
        
        // Changer l'icône
        this.textContent = newTheme === 'dracula' ? '🌙' : '☀️';
        
        // Basculer la classe sur le body
        document.body.classList.toggle('light', newTheme === 'mdn-like');
        
        showNotification(`Thème ${newTheme === 'dracula' ? 'sombre' : 'clair'} activé`);
    });
    
    // Bouton Copier
    $('#copyCode').addEventListener('click', function() {
        const activeTab = $('.tab.active').getAttribute('data-editor');
        let content = '';
        
        switch(activeTab) {
            case 'html': content = htmlEditor.getValue(); break;
            case 'css': content = cssEditor.getValue(); break;
            case 'js': content = jsEditor.getValue(); break;
        }
        
        navigator.clipboard.writeText(content)
            .then(() => showNotification('Code copié !'))
            .catch(() => showNotification('Erreur lors de la copie', 'error'));
    });
    
    // Bouton Coller
    $('#pasteCode').addEventListener('click', async function() {
        try {
            const text = await navigator.clipboard.readText();
            const activeTab = $('.tab.active').getAttribute('data-editor');
            
            switch(activeTab) {
                case 'html': htmlEditor.replaceSelection(text); break;
                case 'css': cssEditor.replaceSelection(text); break;
                case 'js': jsEditor.replaceSelection(text); break;
            }
            
            showNotification('Texte collé');
            updatePreview();
        } catch (error) {
            showNotification('Impossible de coller', 'error');
        }
    });
    
    // Bouton Effacer l'éditeur actif
    $('#clearCode').addEventListener('click', function() {
        if (confirm('Effacer le contenu de l\'éditeur actif ?')) {
            const activeTab = $('.tab.active').getAttribute('data-editor');
            
            switch(activeTab) {
                case 'html': htmlEditor.setValue(''); break;
                case 'css': cssEditor.setValue(''); break;
                case 'js': jsEditor.setValue(''); break;
            }
            
            showNotification('Éditeur effacé');
            updatePreview();
        }
    });
    
    // Bouton Tout effacer
    $('#clearAllCode').addEventListener('click', function() {
        if (confirm('Effacer TOUS les éditeurs ?')) {
            htmlEditor.setValue('');
            cssEditor.setValue('');
            jsEditor.setValue('');
            showNotification('Tous les éditeurs ont été effacés');
            updatePreview();
        }
    });
    
    // Bouton Sauvegarder
    $('#saveCode').addEventListener('click', function() {
        $('#saveModal').style.display = 'flex';
        $('#filename').focus();
    });
    
    // Sauvegarde - Confirmer
    $('#confirmSaveBtn').addEventListener('click', function() {
        const filename = $('#filename').value.trim() || 'code';
        const activeTab = $('.tab.active').getAttribute('data-editor');
        let content = '';
        let extension = '';
        
        switch(activeTab) {
            case 'html':
                content = htmlEditor.getValue();
                extension = '.html';
                break;
            case 'css':
                content = cssEditor.getValue();
                extension = '.css';
                break;
            case 'js':
                content = jsEditor.getValue();
                extension = '.js';
                break;
        }
        
        downloadFile(content, filename + extension);
        $('#saveModal').style.display = 'none';
        showNotification('Fichier sauvegardé');
    });
    
    // Sauvegarde - Annuler
    $('#cancelSaveBtn').addEventListener('click', function() {
        $('#saveModal').style.display = 'none';
    });
    
    // Export ZIP
    $('#saveProjectBtn').addEventListener('click', function() {
        $('#exportZipModal').style.display = 'flex';
        updateZipPreview();
    });
    
    // Export ZIP - Annuler
    $('#cancelExportZipBtn').addEventListener('click', function() {
        $('#exportZipModal').style.display = 'none';
    });
    
    // Export ZIP - Confirmer
    $('#confirmExportZipBtn').addEventListener('click', function() {
        exportProjectAsZip();
    });
}

// ----------  PRÉVISUALISATION ZIP  ----------
function updateZipPreview() {
    const folderName = $('#zipFolderName').value || 'mon_projet';
    const includeReadme = $('#zipIncludeReadme').checked;
    const showPreview = $('#zipPreviewStructure').checked;
    
    let preview = `${folderName}/\n`;
    preview += `├── index.html\n`;
    preview += `├── style.css\n`;
    preview += `└── script.js\n`;
    
    if (includeReadme) {
        preview = `${folderName}/\n`;
        preview += `├── index.html\n`;
        preview += `├── style.css\n`;
        preview += `├── script.js\n`;
        preview += `└── README.md`;
    }
    
    $('#zipStructurePreview').textContent = preview;
    $('#zipStructurePreview').style.display = showPreview ? 'block' : 'none';
}

// ----------  EXPORT ZIP  ----------
async function exportProjectAsZip() {
    try {
        // Charger JSZip si nécessaire
        if (typeof JSZip === 'undefined') {
            await loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
        }
        
        const folderName = $('#zipFolderName').value || 'mon_projet';
        const includeReadme = $('#zipIncludeReadme').checked;
        
        const zip = new JSZip();
        const folder = zip.folder(folderName);
        
        // Ajouter les fichiers
        folder.file('index.html', htmlEditor.getValue());
        folder.file('style.css', cssEditor.getValue());
        folder.file('script.js', jsEditor.getValue());
        
        // Ajouter README si demandé
        if (includeReadme) {
            const readmeContent = `# Projet ${folderName}\n\nGénéré avec l'éditeur HTML Temps Réel\n\n## Fichiers\n- index.html\n- style.css\n- script.js`;
            folder.file('README.md', readmeContent);
        }
        
        // Générer le ZIP
        const content = await zip.generateAsync({ type: 'blob' });
        
        // Télécharger
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `${folderName}.zip`;
        a.click();
        
        // Nettoyer
        URL.revokeObjectURL(a.href);
        
        $('#exportZipModal').style.display = 'none';
        showNotification('Projet exporté en ZIP !');
        
    } catch (error) {
        console.error('Erreur export ZIP:', error);
        showNotification('Erreur lors de l\'export ZIP', 'error');
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ----------  GESTION DU REDIMENSIONNEMENT  ----------
function setupResizer() {
    const resizer = $('#resizer');
    const editorPane = $('#editorPane');
    const previewPane = $('#previewPane');
    let isResizing = false;
    
    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        
        const containerRect = $('.main').getBoundingClientRect();
        const newWidth = e.clientX - containerRect.left;
        
        // Limites min/max
        const minWidth = 200;
        const maxWidth = containerRect.width - 200;
        
        if (newWidth >= minWidth && newWidth <= maxWidth) {
            editorPane.style.width = newWidth + 'px';
            editorPane.style.flex = 'none';
            previewPane.style.flex = '1';
        }
    });
    
    document.addEventListener('mouseup', function() {
        isResizing = false;
        document.body.style.cursor = '';
    });
}

// ----------  SAUVEGARDE AUTOMATIQUE  ----------
function setupAutoSave() {
    // Sauvegarder dans localStorage lors des changements
    const saveToStorage = () => {
        try {
            localStorage.setItem('editor_html', htmlEditor.getValue());
            localStorage.setItem('editor_css', cssEditor.getValue());
            localStorage.setItem('editor_js', jsEditor.getValue());
        } catch (error) {
            console.warn('Impossible de sauvegarder dans localStorage');
        }
    };
    
    // Écouter les changements avec un délai
    let saveTimeout;
    const editors = [htmlEditor, cssEditor, jsEditor];
    
    editors.forEach(editor => {
        if (editor) {
            editor.on('change', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    saveToStorage();
                    updatePreview();
                }, 500);
            });
        }
    });
    
    // Restaurer depuis localStorage
    try {
        const savedHTML = localStorage.getItem('editor_html');
        const savedCSS = localStorage.getItem('editor_css');
        const savedJS = localStorage.getItem('editor_js');
        
        if (savedHTML) htmlEditor.setValue(savedHTML);
        if (savedCSS) cssEditor.setValue(savedCSS);
        if (savedJS) jsEditor.setValue(savedJS);
        
        if (savedHTML || savedCSS || savedJS) {
            showNotification('Code restauré depuis la sauvegarde');
        }
    } catch (error) {
        console.warn('Impossible de restaurer depuis localStorage');
    }
}

// ----------  INITIALISATION  ----------
function init() {
    console.log('Initialisation de l\'éditeur...');
    
    try {
        // Initialiser CodeMirror
        initCodeMirror();
        
        // Configurer les onglets
        setupTabs();
        
        // Configurer les boutons
        setupButtons();
        
        // Configurer le redimensionnement
        setupResizer();
        
        // Configurer la sauvegarde automatique
        setupAutoSave();
        
        // Mettre à jour la prévisualisation initiale
        setTimeout(updatePreview, 100);
        
        // Gestion des modals
        setupModalHandlers();
        
        console.log('Éditeur initialisé avec succès');
        showNotification('Éditeur prêt !');
        
    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
        showNotification('Erreur d\'initialisation', 'error');
    }
}

function setupModalHandlers() {
    // Fermer les modals en cliquant à l'extérieur
    window.addEventListener('click', function(event) {
        if (event.target === $('#saveModal')) {
            $('#saveModal').style.display = 'none';
        }
        if (event.target === $('#exportZipModal')) {
            $('#exportZipModal').style.display = 'none';
        }
    });
    
    // Écouter les changements dans le modal ZIP
    $('#zipFolderName').addEventListener('input', updateZipPreview);
    $('#zipIncludeReadme').addEventListener('change', updateZipPreview);
    $('#zipPreviewStructure').addEventListener('change', updateZipPreview);
}

// ----------  DÉMARRER L'APPLICATION  ----------
document.addEventListener('DOMContentLoaded', init);