# Live HTML Editor & Previewer

A powerful, client-side web development tool that provides a real-time preview for your HTML, CSS, and JavaScript code. This live editor is built with pure JavaScript, runs entirely in the browser, and is perfect for quick prototyping, learning, and sharing web snippets. It's designed to be hosted on any static hosting service like GitHub Pages.

## Features

This project is packed with features to provide a smooth and professional development experience:

- **Tri-Panel Code Editor:** Separate, tabbed editors for HTML, CSS, and JavaScript powered by ACE Editor for a superior coding experience.
- **Real-Time Preview:** Instantly see your code come to life in the preview pane. Updates automatically as you type (with debounce) or manually with a "Run" button.
- **Code Formatting:** Integrated Prettier to automatically format and beautify your HTML, CSS, and JS code with a single click.
- **Dual-Theme Editor:** Toggle the code editor between a comfortable dark (Tomorrow Night) and light (Chrome) theme to suit your preference.
- **Editor Zoom:** Easily zoom in and out of the code editor to adjust the font size for better readability.
- **Draggable Resizer:** A flexible layout with a draggable vertical resizer to adjust the size of the editor and preview panes.
- **Layout Shifting:** In large and higher screens, editor and preview pane are shown side by side. In smaller screens, editor shown above the preview pane. There is a layout switch button available on the header too.
- **Responsive Design Testing:** A dedicated control panel to test your creation across various device sizes, from small mobile phones to large desktops.
- **Immersive Fullscreen Modes:**
  - Editor Fullscreen: Expand the code editor to fill the entire screen for focused coding.
  - Preview Fullscreen: Expand the preview pane to fill the screen, hiding all UI elements for a true, immersive preview of your work.
- **Editor Configuration:**
  - Customize the tab size (2 or 4 spaces) to match your coding style.
- **Download as ZIP:** Package your entire project—HTML, CSS, and JS—into a clean, downloadable .zip file with a single click.

## Tech Stack

This project is built with a focus on client-side performance and simplicity, using modern and reliable open-source libraries.

- Core: HTML5, CSS3, JavaScript (ES6+)
- Styling: Tailwind CSS (via CDN) for a utility-first design approach.
- Code Editor: ACE Editor for syntax highlighting, autocompletion, and themes.
- Code Formatting: Prettier for consistent and clean code.
- File Packaging: JSZip for creating .zip files in the browser.
- Icons: Lucide Icons for a clean and modern set of SVG icons.

## How to Use

1. Clone the repository or download the files.
2. Open index.html in your web browser. No server or build step is required.
3. Start Coding:
   - Write your markup in the HTML tab.
   - Add your styles in the CSS tab.
   - Implement your logic in the JavaScript tab.
4. Preview: Watch the preview pane update automatically as you code.
5. Use the Controls:
   - Click Format to clean up your code.
   - Use the Responsive Controls to check your layout on different screen sizes.
   - Toggle Fullscreen or Editor Theme as needed.
   - Click Download to save your work as a complete project.

## Project Structure

The project is organized into a clean and understandable structure:

```.txt
.
├── index.html              # The main HTML file containing the UI structure.
├── README.md               # You are here!
└── assets/
    ├── css/
    │   └── style.css       # Custom CSS for UI enhancements.
    ├── img/*
    └── js/
        ├── config.js       # Configuration file for metadata (author, repo, default code).
        ├── editor.js       # Handles the initialization and setup of ACE editors.
        └── main.js         # Core application logic, event listeners, and feature implementation.
```

## Author

[Forhad Khan](https://forhadakhan.com) [GitHub: @forhadakhan]

