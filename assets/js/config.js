// Application Configuration

const APP_CONFIG = {
    projectInfo: {
        title: "Live HTML Playground - Online HTML, CSS, & JS Editor",
        headerTitle: "HTML Editor & Live Preview",
        description: "A free, client-side, real-time HTML, CSS, and JavaScript code editor and live previewer. Perfect for web development practice, debugging, and sharing code snippets.",
        keywords: "html editor, css editor, js editor, live preview, code playground, web development tool, frontend, online editor",
        // Replace with your actual GitHub Pages URL
        url: "https://forhadakhan.github.io/live-html-playground/", 
        // Full URL to the OG image
        ogImage: "https://forhadakhan.github.io/live-html-playground/assets/img/og-1200x630.jpg"
    },
    author: {
        name: "Forhad Khan",
        url: "https://forhadakhan.com"
    },
    repository: {
        name: "live-html-playground",
        url: "https://github.com/forhadakhan/live-html-playground"
    },
    defaultEditorContent: {
        html: `<!-- Start editing your HTML below -->\n<h1>Welcome to the Live HTML Playground!</h1>\n<p>Type your HTML, CSS, or JavaScript code in the editor tabs. The preview updates automatically!</p>`,
        css: `/* Your CSS code goes here */\nbody {\n  font-family: sans-serif;\n  padding: 1rem;\n  color: #333;\n}`,
        js: `// Your JavaScript code goes here\nconsole.log("Welcome from the console!");\nconsole.log({ message: "You can log objects too." });`
    }
};

