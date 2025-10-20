// ACE Editor Setup and Configuration

/**
 * Initializes the ACE editors for HTML, CSS, and JavaScript.
 * @param {object} defaultContent - An object with html, css, and js properties.
 * @returns {object} An object containing the three editor instances.
 */
function initializeEditors(defaultContent) {
    const commonOptions = {
        theme: "ace/theme/tomorrow_night_eighties",
        fontSize: 14,
        wrap: true,
        showPrintMargin: false,
        useSoftTabs: true,
        tabSize: 4, // Default tab size, can be changed later
    };

    // --- HTML Editor ---
    const htmlEditor = ace.edit("html-editor");
    htmlEditor.setOptions(commonOptions);
    htmlEditor.session.setMode("ace/mode/html");
    htmlEditor.setValue(defaultContent.html || '', -1); // -1 moves cursor to start

    // --- CSS Editor ---
    const cssEditor = ace.edit("css-editor");
    cssEditor.setOptions(commonOptions);
    cssEditor.session.setMode("ace/mode/css");
    cssEditor.setValue(defaultContent.css || '', -1);

    // --- JavaScript Editor ---
    const jsEditor = ace.edit("js-editor");
    jsEditor.setOptions(commonOptions);
    jsEditor.session.setMode("ace/mode/javascript");
    jsEditor.setValue(defaultContent.js || '', -1);

    console.log("ACE Editors Initialized.");

    return { htmlEditor, cssEditor, jsEditor };
}

