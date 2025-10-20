/**
 * @file Main application logic for the HTML Previewer.
 * @description This script handles all user interactions, state management,
 * and the core functionality of the application, including editor tab management,
 * live preview updates, code formatting, file downloading, and UI resizing.
 * It ties together the ACE editors (editor.js) and the app configuration (config.js).
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. INITIALIZATION ---

    // Initialize Lucide icons as soon as the DOM is ready.
    lucide.createIcons();
    
    // --- 2. DOM ELEMENT REFERENCES ---
    
    // Cache all necessary DOM elements for quick and efficient access.
    const header = document.querySelector('header');
    const mainContent = document.querySelector('main');
    const footer = document.getElementById('app-footer');
    const editorTabs = document.getElementById('editor-tabs');
    const editorInstances = document.querySelectorAll('.editor-instance');
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
    const layoutToggleBtn = document.getElementById('layout-toggle-btn');
    const consoleOutput = document.getElementById('console-output');
    const clearConsoleBtn = document.getElementById('clear-console-btn');
    const appHeaderTitle = document.getElementById('app-header-title');

    // --- 3. STATE MANAGEMENT ---

    // A reference to all initialized ACE editor instances.
    let editors = {};
    // Tracks the current fullscreen state to manage toggling.
    let currentFullscreen = null; // Can be null, 'editor', or 'preview'.
    // Timer for debouncing the live preview update.
    let debounceTimer;
    // Holds the current font size for the editors.
    let editorFontSize = 14; // Default: 14px
    // Holds the current theme for the editors.
    let currentEditorTheme = 'dark'; // 'dark' or 'light'
    const editorThemes = {
        dark: "ace/theme/tomorrow_night_eighties",
        light: "ace/theme/chrome"
    };
    // Stores the user's manual layout choice ('vertical' or 'horizontal').
    // 'null' means the layout is automatic based on viewport width.
    let forcedLayout = null;
    
    // --- 4. UTILITY FUNCTIONS ---

    /**
     * A simple debounce function to limit the rate at which a function gets called.
     * This is crucial for the live preview to prevent updates on every single keystroke.
     * @param {Function} func The function to debounce.
     * @param {number} delay The debounce delay in milliseconds.
     * @returns {Function} The debounced function.
     */
    const debounce = (func, delay) => {
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };
    
    // --- 5. CORE FUNCTION DEFINITIONS ---

    /**
     * Populates the page's meta tags and main header from the APP_CONFIG object.
     * This is crucial for SEO and for keeping branding consistent.
     */
    function populateMetadataAndHeaders() {
        if (!APP_CONFIG || !APP_CONFIG.projectInfo) return;

        const { title, headerTitle, description, keywords, url, ogImage } = APP_CONFIG.projectInfo;
        const authorName = APP_CONFIG.author.name;

        // Update standard meta tags and title
        document.title = title;
        appHeaderTitle.textContent = headerTitle;
        document.getElementById('meta-description').setAttribute('content', description);
        document.getElementById('meta-keywords').setAttribute('content', keywords);
        document.getElementById('meta-author').setAttribute('content', authorName);
        document.getElementById('canonical-link').setAttribute('href', url);

        // Update Open Graph meta tags
        document.getElementById('og-url').setAttribute('content', url);
        document.getElementById('og-title').setAttribute('content', title);
        document.getElementById('og-description').setAttribute('content', description);
        document.getElementById('og-image').setAttribute('content', ogImage);

        // Update Twitter Card meta tags
        document.getElementById('twitter-url').setAttribute('content', url);
        document.getElementById('twitter-title').setAttribute('content', title);
        document.getElementById('twitter-description').setAttribute('content', description);
        document.getElementById('twitter-image').setAttribute('content', ogImage);
    }

    /**
     * Central function to manage the editor/preview layout.
     * It applies a vertical or horizontal layout based on the user's forced choice
     * or the viewport width. This is the single source of truth for the layout.
     */
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
        
        // Update the toggle button icon to reflect the active layout.
        layoutToggleBtn.innerHTML = (currentLayout === 'vertical')
            ? '<i data-lucide="columns-2" class="w-5 h-5"></i><span class="hidden md:inline">Layout</span>'
            : '<i data-lucide="rows-2" class="w-5 h-5"></i><span class="hidden md:inline">Layout</span>';
        lucide.createIcons();

        // Ensure ACE editors resize correctly after layout changes.
        setTimeout(() => Object.values(editors).forEach(e => e.resize()), 50);
    }

    /**
     * Handles clicks on the layout toggle button, cycling through manual layout choices.
     */
    function handleLayoutToggle() {
        const isCurrentlyVertical = mainContent.classList.contains('flex-col');
        forcedLayout = isCurrentlyVertical ? 'horizontal' : 'vertical';
        updateLayout();
    }


    /**
     * Updates the font size for all ACE editor instances.
     */
    function updateEditorFontSize() {
        Object.values(editors).forEach(editor => {
            editor.setFontSize(editorFontSize);
        });
    }

    /**
     * Toggles the editor theme between dark and light modes.
     */
    function toggleEditorTheme() {
        currentEditorTheme = (currentEditorTheme === 'dark') ? 'light' : 'dark';
        
        // Update icon
        editorThemeBtn.innerHTML = (currentEditorTheme === 'dark') 
            ? '<i data-lucide="sun" class="w-4 h-4"></i>' 
            : '<i data-lucide="moon" class="w-4 h-4"></i>';
        lucide.createIcons();
        
        // Apply theme to all editors
        const newTheme = editorThemes[currentEditorTheme];
        Object.values(editors).forEach(editor => {
            editor.setTheme(newTheme);
        });
    }

    /**
     * Populates the footer with author and repository information from APP_CONFIG.
     */
    function populateFooter() {
        if (!footer || !APP_CONFIG) return;
        const { author, repository } = APP_CONFIG;
        footer.innerHTML = `
            Developed by <a href="${author.url}" target="_blank" class="text-white bg-gray-900 hover:bg-gray-950 rounded-full px-2 py-1 border border-gray-700">${author.name}</a> • 
            View source code on <a href="${repository.url}" target="_blank" class="text-white bg-gray-900 hover:bg-gray-950 rounded-full px-2 py-1 border border-gray-700">GitHub</a>
        `;
    }
    
    /**
     * Handles tab switching in the editor pane. It updates the active styles
     * and shows/hides the corresponding editor instance or console panel.
     * @param {MouseEvent} e - The click event object.
     */
    function handleTabClick(e) {
        const target = e.target.closest('.tab-btn');
        if (!target) return;

        // Update active class on tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');

        const panelType = target.dataset.editor;
        
        const panelToShowId = (panelType === 'console') 
            ? 'console-panel'
            : `${panelType}-editor`;

        // The querySelectorAll includes the console panel now
        document.querySelectorAll('.editor-instance').forEach(instance => {
            instance.style.visibility = (instance.id === panelToShowId) ? 'visible' : 'hidden';
        });

        // Focus only if it's an actual editor
        if (panelType !== 'console') {
            editors[`${panelType}Editor`].focus();
        }
    }

    /**
     * Gathers code, injects a console interceptor, and updates the preview iframe.
     */
    function updatePreview() {
        // Before updating, clear the console for the new run.
        consoleOutput.innerHTML = '';
        
        const htmlCode = editors.htmlEditor.getValue();
        const cssCode = editors.cssEditor.getValue();
        const jsCode = editors.jsEditor.getValue();

        // This script will run inside the iframe, capture console calls, and send them to the parent window.
        const consoleInterceptor = `
            <script>
                const originalConsole = { ...window.console };
                const postLog = (level, args) => {
                    try {
                        const processedArgs = args.map(arg => {
                             if (arg instanceof Error) {
                                return { __error: true, message: arg.message, stack: arg.stack };
                            }
                            // A simple stringify works for most cases, but not circular refs. It's a safe starting point.
                            try { return JSON.parse(JSON.stringify(arg)); } catch (e) { return String(arg); }
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

        const combinedHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${consoleInterceptor}
                <style>${cssCode}</style>
            </head>
            <body>
                ${htmlCode}
                <script>
                    try {
                        ${jsCode}
                    } catch (e) {
                        console.error(e);
                    }
                </script>
            </body>
            </html>
        `;

        previewIframe.srcdoc = combinedHtml;
    }

    /**
     * Renders a single log message to the console output panel.
     * @param {string} level - The console level (e.g., 'log', 'error').
     * @param {Array} args - An array of arguments passed to the console method.
     */
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


    /**
     * Formats the code in the currently active editor using the Prettier library.
     */
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
    
    /**
      * Updates the tab size for all ACE editor instances when the dropdown changes.
    */
    function changeTabSize() {
        const size = parseInt(tabSizeSelector.value, 10);
        Object.values(editors).forEach(editor => {
            editor.session.setTabSize(size);
        });
    }

    /**
     * Uses JSZip to create a ZIP archive of the user's code (HTML, CSS, JS)
     * and triggers a browser download with a timestamped filename.
     */
    function downloadZip() {
        const zip = new JSZip();
        const htmlCode = editors.htmlEditor.getValue();
        const cssCode = editors.cssEditor.getValue();
        const jsCode = editors.jsEditor.getValue();

        const linkedHtml = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Code Project</title>
                                <link rel="stylesheet" href="style.css">
                            </head>
                            <body>
                                ${htmlCode}
                                <script src="script.js"></script>
                            </body>
                            </html>`;

        zip.file("index.html", linkedHtml);
        zip.file("style.css", cssCode);
        zip.file("script.js", jsCode);

        zip.generateAsync({ type: "blob" }).then(content => {
            // --- Create timestamp for the filename ---
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const timestamp = `${year}${month}${day}-${hours}${minutes}${seconds}`;
            const filename = `code-project-${timestamp}.zip`;

            // --- Trigger download ---
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = filename; // Use the new timestamped filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    /**
     * Toggles fullscreen mode for a specific pane ('editor' or 'preview').
     * @param {'editor' | 'preview'} pane - The pane to toggle fullscreen.
     */
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

    /**
     * Handles clicks on the responsive control buttons, resizing the preview iframe.
     */
    function handleResponsiveClick(e) {
        const target = e.target.closest('.responsive-btn');
        if (!target) return;

        document.querySelectorAll('.responsive-btn').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        previewIframe.style.width = target.dataset.size;
    }

    /**
     * Initializes the draggable resizer, adapting for both vertical and horizontal layouts.
     */
    function initializeResizer() {
        let isResizing = false;

        resizer.addEventListener('mousedown', (e) => { 
            isResizing = true; 
            const isVertical = mainContent.classList.contains('flex-col');
            document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
            document.body.style.userSelect = 'none'; 
        });

        document.addEventListener('mouseup', () => { 
            isResizing = false; 
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
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


    // --- 6. EVENT LISTENERS ---
    
    editorTabs.addEventListener('click', handleTabClick);
    runBtn.addEventListener('click', updatePreview);
    formatBtn.addEventListener('click', formatCode);
    tabSizeSelector.addEventListener('change', changeTabSize);
    downloadZipBtn.addEventListener('click', downloadZip);
    editorFullscreenBtn.addEventListener('click', () => toggleFullscreen('editor'));
    previewFullscreenBtn.addEventListener('click', () => toggleFullscreen('preview'));
    responsiveControls.addEventListener('click', handleResponsiveClick);
    editorThemeBtn.addEventListener('click', toggleEditorTheme);
    layoutToggleBtn.addEventListener('click', handleLayoutToggle);
    clearConsoleBtn.addEventListener('click', () => { consoleOutput.innerHTML = ''; });

    editorZoomInBtn.addEventListener('click', () => {
        editorFontSize++;
        updateEditorFontSize();
    });

    editorZoomOutBtn.addEventListener('click', () => {
        if (editorFontSize > 8) {
            editorFontSize--;
            updateEditorFontSize();
        }
    });
    
    window.addEventListener('resize', () => {
        forcedLayout = null; 
        updateLayout();
    });

    // Listen for console messages from the iframe
    window.addEventListener('message', (event) => {
        if (event.source !== previewIframe.contentWindow) return;
        const { source, level, message } = event.data;
        if (source === 'iframe-console') {
            renderConsoleMessage(level, message);
        }
    });


    // --- 7. INITIAL SETUP CALLS ---
    
    populateMetadataAndHeaders();
    populateFooter();
    initializeResizer();
    
    editors = initializeEditors(APP_CONFIG.defaultEditorContent);
    
    updateEditorFontSize();
    updateLayout();

    const debouncedUpdate = debounce(updatePreview, 500);
    Object.values(editors).forEach(editor => {
        editor.session.on('change', debouncedUpdate);
    });

    updatePreview();
    document.querySelector('.responsive-btn[data-size="100%"]')?.classList.add('active');
    
    console.log("HTML Previewer Initialized Successfully.");
});
