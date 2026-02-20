/**
 * @file main.js
 * @title Live HTML Playground — Main Application Script
 * @description Handles all interactive logic and dynamic UI behavior of the Live HTML Playground.
 *
 * This module manages:
 * - Initialization and binding of ACE editors (HTML, CSS, JS)
 * - Real-time live preview rendering inside an iframe
 * - Tab management for code panels and console output
 * - User preferences persistence via localStorage (theme, layout, font size, tab width)
 * - Dynamic resizing, fullscreen toggling, and responsive preview modes
 * - Code formatting (via Prettier), copying, clearing, and ZIP download support
 *
 * @requires lucide
 * @requires prettier
 * @requires JSZip
 * @requires ./config.js
 * @requires ./editor.js
 *
 * @author
 * Forhad Khan — https://forhadkhan.com
 * @repository
 * https://github.com/forhadkhan/live-html-playground
 * @license MIT
 */


document.addEventListener('DOMContentLoaded', () => {
    // --- 1. INITIALIZATION ---
    lucide.createIcons();

    // --- 2. DOM ELEMENT REFERENCES ---
    const header = document.querySelector('header');
    const mainContent = document.querySelector('main');
    const footer = document.getElementById('app-footer');
    const editorTabs = document.getElementById('editor-tabs');
    const previewIframe = document.getElementById('preview-iframe');
    const runBtn = document.getElementById('run-btn');
    const formatBtn = document.getElementById('format-code-btn');
    const tabSizeSelector = document.getElementById('tab-size');
    const downloadZipBtn = document.getElementById('download-zip-btn');
    const editorPane = document.getElementById('editor-pane');
    const previewPane = document.getElementById('preview-pane');
    const resizer = document.getElementById('resizer');
    const editorFullscreenBtn = document.getElementById('editor-fullscreen-btn');
    const previewFullscreenBtn = document.getElementById('preview-fullscreen-btn');
    const responsiveControls = document.getElementById('responsive-controls');
    const editorZoomInBtn = document.getElementById('editor-zoom-in-btn');
    const editorZoomOutBtn = document.getElementById('editor-zoom-out-btn');
    const editorThemeBtn = document.getElementById('editor-theme-btn');
    const editorCopyBtn = document.getElementById('editor-copy-btn');
    const editorClearBtn = document.getElementById('editor-clear-btn');
    const layoutToggleBtn = document.getElementById('layout-toggle-btn');
    const consoleOutput = document.getElementById('console-output');
    const clearConsoleBtn = document.getElementById('clear-console-btn');
    const appHeaderTitle = document.getElementById('app-header-title');
    const cssLibraryControls = document.getElementById('css-library-controls');
    const libButtons = document.querySelectorAll('.lib-btn');

    // --- 3. STATE MANAGEMENT ---
    // A reference to all initialized ACE editor instances.
    let editors = {};
    // Tracks the current fullscreen state to manage toggling.
    let currentFullscreen = null; // Can be null, 'editor', or 'preview'.
    // Timer for debouncing the live preview update.
    // DEPRECATED: The timer is now managed inside the debounce closure.
    // let debounceTimer;

    // Holds the current font size for the editors.
    let editorFontSize = 14; // Default: 14px
    // Holds the current theme for the editors.
    let currentEditorTheme = 'dark';
    const editorThemes = {
        dark: "ace/theme/tomorrow_night_eighties",
        light: "ace/theme/chrome"
    };
    let forcedLayout = null;
    let currentCssLibrary = 'none';
    const CSS_LIBRARIES = {
        tailwind: 'https://cdn.tailwindcss.com',
        bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
        mui: 'https://unpkg.com/@mui/material@latest/dist/material-ui.min.css',
        bulma: 'https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css'
    };
    const LOCAL_STORAGE_KEYS = {
        code: 'live-html-editor-code',
        prefs: 'live-html-editor-prefs'
    };

    // --- 4. UTILITY FUNCTIONS ---
    /**
     * A simple debounce function to limit the rate at which a function gets called.
     * This is crucial for the live preview to prevent updates on every single keystroke.
     * @param {Function} func The function to debounce.
     * @param {number} delay The debounce delay in milliseconds.
     * @returns {Function} The debounced function.
     */
    const debounce = (func, delay) => {
        // The timer variable MUST be created inside the closure.
        // This ensures that each debounced function gets its own, independent timer
        // and they don't cancel each other out.
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    // --- 5. CORE FUNCTION DEFINITIONS ---

    function updateLayout() {
        const LG_BREAKPOINT = 1024;
        const currentLayout = forcedLayout || (window.innerWidth < LG_BREAKPOINT ? 'vertical' : 'horizontal');

        if (currentLayout === 'vertical') {
            mainContent.classList.remove('flex-row');
            mainContent.classList.add('flex-col');
            resizer.classList.remove('w-2', 'h-auto', 'cursor-col-resize');
            resizer.classList.add('w-full', 'h-2', 'cursor-row-resize');
            editorPane.style.width = '100%';
            previewPane.style.width = '100%';
            editorPane.style.height = '50%';
            previewPane.style.height = '50%';
        } else { // horizontal
            mainContent.classList.remove('flex-col');
            mainContent.classList.add('flex-row');
            resizer.classList.remove('w-full', 'h-2', 'cursor-row-resize');
            resizer.classList.add('w-2', 'h-auto', 'cursor-col-resize');
            editorPane.style.height = '100%';
            previewPane.style.height = '100%';
            editorPane.style.width = '50%';
            previewPane.style.width = '50%';
        }

        layoutToggleBtn.innerHTML = (currentLayout === 'vertical')
            ? '<i data-lucide="columns-2" class="w-5 h-5"></i><span class="hidden md:inline">Layout</span>'
            : '<i data-lucide="rows-2" class="w-5 h-5"></i><span class="hidden md:inline">Layout</span>';
        lucide.createIcons();

        setTimeout(() => Object.values(editors).forEach(e => e.resize()), 50);
    }

    function handleLayoutToggle() {
        const isCurrentlyVertical = mainContent.classList.contains('flex-col');
        forcedLayout = isCurrentlyVertical ? 'horizontal' : 'vertical';
        updateLayout();
        savePrefsState();
    }

    function updateEditorFontSize() {
        Object.values(editors).forEach(editor => {
            editor.setFontSize(editorFontSize);
        });
    }

    function setEditorTheme(theme) {
        currentEditorTheme = theme;
        const icon = (currentEditorTheme === 'dark') ? 'sun' : 'moon';
        editorThemeBtn.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i>`;
        lucide.createIcons();
        const newTheme = editorThemes[currentEditorTheme];
        Object.values(editors).forEach(editor => {
            editor.setTheme(newTheme);
        });
    }

    function toggleEditorTheme() {
        const newTheme = (currentEditorTheme === 'dark') ? 'light' : 'dark';
        setEditorTheme(newTheme);
        savePrefsState();
    }

    function handleTabClick(e) {
        const target = e.target.closest('.tab-btn');
        if (!target) return;

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        target.classList.add('active');
        target.setAttribute('aria-selected', 'true');

        const panelType = target.dataset.editor;

        // Show/hide copy/clear buttons based on tab
        const showUtils = (panelType !== 'console');
        editorCopyBtn.style.display = showUtils ? 'inline-flex' : 'none';
        editorClearBtn.style.display = showUtils ? 'inline-flex' : 'none';

        const panelToShowId = (panelType === 'console')
            ? 'console-panel'
            : `${panelType}-editor`;

        document.querySelectorAll('.editor-instance').forEach(instance => {
            instance.style.visibility = (instance.id === panelToShowId) ? 'visible' : 'hidden';
        });

        if (panelType !== 'console') {
            editors[`${panelType}Editor`].focus();
        }

        // Toggle CSS library controls visibility
        if (panelType === 'css') {
            cssLibraryControls.style.display = 'inline-flex';
        } else {
            cssLibraryControls.style.display = 'none';
        }
    }

    function updatePreview() {
        consoleOutput.innerHTML = '';
        const htmlCode = editors.htmlEditor.getValue();
        const cssCode = editors.cssEditor.getValue();
        const jsCode = editors.jsEditor.getValue();

        const consoleInterceptor = `
            <script>
                const originalConsole = { ...window.console };
                const postLog = (level, args) => {
                    try {
                        const processedArgs = args.map(arg => {
                             if (arg instanceof Error) {
                                return { __error: true, message: arg.message, stack: arg.stack };
                            }
                            try { return JSON.parse(JSON.stringify(arg)); } catch (e) {
                                // Catch circular references and non-serializable values
                                try { return String(arg); } catch(err) { return "[Unserializable Value]"; }
                            }
                        });
                        window.parent.postMessage({ source: 'iframe-console', level: level, message: processedArgs }, '*');
                    } catch (e) {
                        originalConsole.error('Error posting log to parent:', e);
                    }
                };
                window.console = {
                    ...originalConsole,
                    log: (...args) => { postLog('log', args); originalConsole.log(...args); },
                    error: (...args) => { postLog('error', args); originalConsole.error(...args); },
                    warn: (...args) => { postLog('warn', args); originalConsole.warn(...args); },
                    info: (...args) => { postLog('info', args); originalConsole.info(...args); },
                };
                window.addEventListener('error', e => postLog('error', [e.message]));
                window.addEventListener('unhandledrejection', e => postLog('error', ['Unhandled promise rejection:', e.reason]));
            </script>
        `;

        let libraryTag = '';
        if (currentCssLibrary !== 'none' && CSS_LIBRARIES[currentCssLibrary]) {
            if (currentCssLibrary === 'tailwind') {
                libraryTag = `<script src="${CSS_LIBRARIES[currentCssLibrary]}"></script>`;
            } else {
                libraryTag = `<link rel="stylesheet" href="${CSS_LIBRARIES[currentCssLibrary]}">`;
            }
        }

        const combinedHtml = `
            <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${libraryTag}
                ${consoleInterceptor}<style>${cssCode}</style></head><body>${htmlCode}<script>
                    try { ${jsCode} } catch (e) { console.error(e); }
                </script></body></html>`;

        previewIframe.srcdoc = combinedHtml;
    }

    function renderConsoleMessage(level, args) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${level}`;
        const messageContainer = document.createElement('div');
        messageContainer.className = 'log-message';
        const formattedArgs = args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                if (arg.__error) return `${arg.message}\n${arg.stack || ''}`;
                return JSON.stringify(arg, null, 2);
            }
            return String(arg);
        }).join(' ');

        const pre = document.createElement('pre');
        pre.textContent = formattedArgs;
        messageContainer.appendChild(pre);

        logEntry.appendChild(messageContainer);
        consoleOutput.appendChild(logEntry);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function formatCode() {
        const activeTab = document.querySelector('.tab-btn.active');
        if (!activeTab || activeTab.dataset.editor === 'console') return;
        const editorKey = `${activeTab.dataset.editor}Editor`;
        const activeEditor = editors[editorKey];
        const mode = activeTab.dataset.editor;
        const parsers = { html: 'html', css: 'css', js: 'babel' };
        try {
            const formattedCode = prettier.format(activeEditor.getValue(), {
                parser: parsers[mode],
                plugins: prettierPlugins,
                tabWidth: parseInt(tabSizeSelector.value, 10),
            });
            activeEditor.setValue(formattedCode, 1);
        } catch (error) {
            console.error("Formatting error:", error);
        }
    }

    function applyTabSize() {
        const size = parseInt(tabSizeSelector.value, 10);
        Object.values(editors).forEach(editor => {
            editor.session.setTabSize(size);
        });
    }

    function handleTabSizeChange() {
        applyTabSize();
        savePrefsState();
    }

    function downloadZip() {
        const zip = new JSZip();
        const htmlCode = editors.htmlEditor.getValue();
        const cssCode = editors.cssEditor.getValue();
        const jsCode = editors.jsEditor.getValue();
        const linkedHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Code Project</title><link rel="stylesheet" href="style.css"></head><body>${htmlCode}<script src="script.js"></script></body></html>`;
        zip.file("index.html", linkedHtml);
        zip.file("style.css", cssCode);
        zip.file("script.js", jsCode);
        zip.generateAsync({ type: "blob" }).then(content => {
            const now = new Date();
            const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
            const filename = `code-project-${timestamp}.zip`;
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    function toggleFullscreen(pane) {
        const isExiting = currentFullscreen === pane;
        header.style.display = 'flex';
        editorPane.style.display = 'flex';
        previewPane.style.display = 'flex';
        resizer.style.display = 'flex';
        currentFullscreen = null;
        updateLayout();
        editorFullscreenBtn.innerHTML = '<i data-lucide="maximize" class="w-4 h-4"></i>';
        previewFullscreenBtn.innerHTML = '<i data-lucide="maximize" class="w-4 h-4"></i>';
        if (!isExiting) {
            if (pane === 'editor') {
                previewPane.style.display = 'none';
                resizer.style.display = 'none';
                editorPane.style.width = '100%';
                editorPane.style.height = '100%';
                editorFullscreenBtn.innerHTML = '<i data-lucide="minimize" class="w-4 h-4"></i>';
                currentFullscreen = 'editor';
            } else if (pane === 'preview') {
                header.style.display = 'none';
                editorPane.style.display = 'none';
                resizer.style.display = 'none';
                previewPane.style.width = '100%';
                previewPane.style.height = '100%';
                previewFullscreenBtn.innerHTML = '<i data-lucide="minimize" class="w-4 h-4"></i>';
                currentFullscreen = 'preview';
            }
        }
        lucide.createIcons();
        setTimeout(() => Object.values(editors).forEach(e => e.resize()), 50);
    }

    function handleResponsiveClick(e) {
        const target = e.target.closest('.responsive-btn');
        if (!target) return;
        document.querySelectorAll('.responsive-btn').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        previewIframe.style.width = target.dataset.size;
    }

    function initializeResizer() {
        let isResizing = false;
        resizer.addEventListener('mousedown', () => {
            isResizing = true;
            document.body.style.cursor = mainContent.classList.contains('flex-col') ? 'row-resize' : 'col-resize';
            document.body.style.userSelect = 'none';
            previewIframe.style.pointerEvents = 'none';
        });
        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
            previewIframe.style.pointerEvents = 'auto';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const isVertical = mainContent.classList.contains('flex-col');
            if (isVertical) {
                const totalHeight = mainContent.offsetHeight;
                const newEditorHeight = e.clientY - mainContent.getBoundingClientRect().top;
                if (newEditorHeight > 50 && (totalHeight - newEditorHeight) > 50) {
                    editorPane.style.height = `${(newEditorHeight / totalHeight) * 100}%`;
                    previewPane.style.height = `${((totalHeight - newEditorHeight - resizer.offsetHeight) / totalHeight) * 100}%`;
                }
            } else {
                const totalWidth = mainContent.offsetWidth;
                const newEditorWidth = e.clientX - mainContent.getBoundingClientRect().left;
                if (newEditorWidth > 50 && (totalWidth - newEditorWidth) > 50) {
                    editorPane.style.width = `${(newEditorWidth / totalWidth) * 100}%`;
                    previewPane.style.width = `${((totalWidth - newEditorWidth - resizer.offsetWidth) / totalWidth) * 100}%`;
                }
            }
            Object.values(editors).forEach(editor => editor.resize());
        });
    }

    function copyActiveEditorContent() {
        const activeTab = document.querySelector('.tab-btn.active');
        if (!activeTab || activeTab.dataset.editor === 'console') return;
        const editorKey = `${activeTab.dataset.editor}Editor`;
        const activeEditor = editors[editorKey];
        navigator.clipboard.writeText(activeEditor.getValue()).then(() => {
            editorCopyBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 text-green-400"></i>';
            lucide.createIcons();
            setTimeout(() => {
                editorCopyBtn.innerHTML = '<i data-lucide="copy" class="w-4 h-4"></i>';
                lucide.createIcons();
            }, 1500);
        });
    }

    function clearActiveEditorContent() {
        const activeTab = document.querySelector('.tab-btn.active');
        if (!activeTab || activeTab.dataset.editor === 'console') return;
        const editorKey = `${activeTab.dataset.editor}Editor`;
        editors[editorKey].setValue('', -1);
    }

    // --- 6. LOCALSTORAGE & STATE PERSISTENCE ---

    function saveCodeState() {
        try {
            const codeState = {
                html: editors.htmlEditor.getValue(),
                css: editors.cssEditor.getValue(),
                js: editors.jsEditor.getValue(),
                cssLib: currentCssLibrary,
            };
            localStorage.setItem(LOCAL_STORAGE_KEYS.code, JSON.stringify(codeState));
        } catch (e) {
            console.error("Failed to save code state:", e);
        }
    }

    function savePrefsState() {
        try {
            const prefsState = {
                theme: currentEditorTheme,
                fontSize: editorFontSize,
                tabSize: parseInt(tabSizeSelector.value, 10),
                layout: forcedLayout,
            };
            localStorage.setItem(LOCAL_STORAGE_KEYS.prefs, JSON.stringify(prefsState));
        } catch (e) {
            console.error("Failed to save preferences:", e);
        }
    }

    function loadState() {
        const savedCode = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.code));
        const savedPrefs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.prefs));

        if (savedPrefs) {
            editorFontSize = savedPrefs.fontSize || 14;
            tabSizeSelector.value = savedPrefs.tabSize || 4;
            forcedLayout = savedPrefs.layout || null;
            setEditorTheme(savedPrefs.theme || 'dark');
        }

        const initialContent = savedCode || APP_CONFIG.defaultEditorContent;
        editors = initializeEditors(initialContent);

        if (savedCode && savedCode.cssLib) {
            setCssLibrary(savedCode.cssLib);
        }

        updateEditorFontSize();
        applyTabSize(); // Apply loaded size without re-saving
    }

    function setCssLibrary(lib) {
        currentCssLibrary = lib;
        libButtons.forEach(btn => {
            if (btn.dataset.lib === lib) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        updatePreview();
        saveCodeState();
    }

    // --- 7. EVENT LISTENERS ---

    editorTabs.addEventListener('click', handleTabClick);
    runBtn.addEventListener('click', updatePreview);
    editorTabs.addEventListener('click', handleTabClick);
    runBtn.addEventListener('click', updatePreview);
    formatBtn.addEventListener('click', formatCode);
    tabSizeSelector.addEventListener('change', handleTabSizeChange);
    downloadZipBtn.addEventListener('click', downloadZip);
    editorFullscreenBtn.addEventListener('click', () => toggleFullscreen('editor'));
    previewFullscreenBtn.addEventListener('click', () => toggleFullscreen('preview'));
    responsiveControls.addEventListener('click', handleResponsiveClick);
    editorThemeBtn.addEventListener('click', toggleEditorTheme);
    editorCopyBtn.addEventListener('click', copyActiveEditorContent);
    editorClearBtn.addEventListener('click', clearActiveEditorContent);

    cssLibraryControls.addEventListener('click', (e) => {
        const btn = e.target.closest('.lib-btn');
        if (btn) {
            setCssLibrary(btn.dataset.lib);
        }
    });
    layoutToggleBtn.addEventListener('click', handleLayoutToggle);
    clearConsoleBtn.addEventListener('click', () => { consoleOutput.innerHTML = ''; });

    editorZoomInBtn.addEventListener('click', () => {
        editorFontSize++;
        updateEditorFontSize();
        savePrefsState();
    });

    editorZoomOutBtn.addEventListener('click', () => {
        if (editorFontSize > 8) {
            editorFontSize--;
            updateEditorFontSize();
            savePrefsState();
        }
    });

    window.addEventListener('resize', () => {
        // Do NOT reset forcedLayout, to preserve user's manual choice.
        updateLayout();
    });

    window.addEventListener('message', (event) => {
        if (event.source !== previewIframe.contentWindow) return;
        const { source, level, message } = event.data;
        if (source === 'iframe-console') {
            renderConsoleMessage(level, message);
        }
    });

    // --- 8. INITIAL SETUP CALLS ---

    initializeResizer();

    loadState();

    const debouncedSaveCode = debounce(saveCodeState, 300);
    const debouncedUpdate = debounce(updatePreview, 500);
    Object.values(editors).forEach(editor => {
        editor.session.on('change', () => {
            debouncedUpdate();
            debouncedSaveCode();
        });
    });

    updateLayout();
    updatePreview();
    document.querySelector('.responsive-btn[data-size="100%"]')?.classList.add('active');

    // Set initial state for copy/clear buttons
    handleTabClick({ target: document.querySelector('.tab-btn.active') });

    console.log("HTML Previewer Initialized Successfully.");
});

