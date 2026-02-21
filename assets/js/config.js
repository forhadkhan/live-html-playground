// Application Configuration

const APP_CONFIG = {
	defaultEditorContent: {
		html: `  
<h2>Welcome to LiveMarkup 🚀</h2>
<p>Your instant frontend playground. Edit HTML, CSS, and JS on the editor and see the magic happen here.</p>
  
<div class="tip-box">
	<strong>Pro Tip:</strong> Open the CSS tab to instantly add Tailwind, Bootstrap, MUI, or Bulma.
</div>
				`,

		css: `/* Your CSS code goes here */
body {
	font-family: system-ui, -apple-system, sans-serif;
	padding: 1rem;
	line-height: 1.5;
}

.tip-box {
	background: #f0f4f8;
	border-left: 4px solid #3b82f6;
	padding: 1rem;
	border-radius: 4px;
	margin-top: 1.5rem;
	color: #222;
}

.tip-box strong {
	color: #333;
}

h1 {
	margin-bottom: 0.5rem;
}
				`,

		js: `// Your JavaScript code goes here
console.log("Welcome to LiveMarkup!");
console.log("Try adding a CSS library to see the UI transform instantly.");`,
	},
};