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

	/**
	 * Adds a custom command to an editor instance to allow users to escape
	 * the editor's focus trap using the 'Esc' key. This is crucial for accessibility.
	 * When Esc is pressed, focus is moved to the corresponding editor tab button.
	 * @param {ace.Editor} editor - The ACE editor instance.
	 * @param {string} editorName - The name of the editor ('html', 'css', 'js').
	 */
	const addEscapeCommand = (editor, editorName) => {
		editor.commands.addCommand({
			name: "escape",
			bindKey: { win: "Esc", mac: "Esc" },
			exec: (editor) => {
				// Find the corresponding tab button in the DOM
				const tabButton = document.querySelector(
					`.tab-btn[data-editor="${editorName}"]`
				);
				if (tabButton) {
					// Move focus directly to the tab button
					tabButton.focus();
				} else {
					// Fallback in case the button isn't found
					editor.blur();
				}
			},
			readOnly: true, // The command can be executed in read-only mode
		});
	};

	// --- HTML Editor ---
	const htmlEditor = ace.edit("html-editor");
	htmlEditor.setOptions(commonOptions);
	htmlEditor.session.setMode("ace/mode/html");
	htmlEditor.setValue(defaultContent.html || "", -1); // -1 moves cursor to start
	addEscapeCommand(htmlEditor, "html");

	// --- CSS Editor ---
	const cssEditor = ace.edit("css-editor");
	cssEditor.setOptions(commonOptions);
	cssEditor.session.setMode("ace/mode/css");
	cssEditor.setValue(defaultContent.css || "", -1);
	addEscapeCommand(cssEditor, "css");

	// --- JavaScript Editor ---
	const jsEditor = ace.edit("js-editor");
	jsEditor.setOptions(commonOptions);
	jsEditor.session.setMode("ace/mode/javascript");
	jsEditor.setValue(defaultContent.js || "", -1);
	addEscapeCommand(jsEditor, "js");

	console.log("ACE Editors Initialized.");

	return { htmlEditor, cssEditor, jsEditor };
}
