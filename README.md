<h1 style="text-align: center;">
<svg style="width: 28px; height: 28px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
</svg>
    LiveMarkup
</h1>
<p style="text-align: center;">
<a href="https://livemarkup.web.app">Live Demo</a> | <a href="https://github.com/forhadkhan/livemarkup/issues">Report Bug</a>
</p>

---

**LiveMarkup** is a fast, browser-based playground for frontend developers. Write HTML, CSS, and JS with instant live previews and one-click integration for popular CSS frameworks like Tailwind CSS, Bootstrap, MUI and Bulma.

Built entirely with pure JavaScript, this live editor runs fully in the browser — no backend required. It’s perfect for quick prototyping, learning, or checking web snippets.

---

## **Key Features**

#### 🛠️ **Professional Editor**
* **Tri-Panel Setup:** Separate editors for HTML, CSS, and JavaScript.
* **Code Formatting:** One-click beautification powered by **Prettier**.
* **Zoom & Themes:** Adjust font size and switch between **Dark** and **Light** modes.
* **ACE Editor:** Syntax highlighting, autocompletion, and themes.
* **Accessibility:** Enhanced keyboard navigation and high-visibility focus.

#### 📺 **Interactive Preview**
* **Real-time Updates:** See changes instantly as you type (with smart debounce).
* **Responsive Testing:** Built-in device presets (Mobile, Tablet, Desktop) to test layouts.
* **Console Panel:** Integrated log viewer for JavaScript debugging.
* **Fullscreen Modes:** Focused coding or distraction-free previewing.

#### 📦 **Integration & Export**
* **One-Click Frameworks:** Instant injection of **Tailwind CSS**, **Bootstrap**, **MUI**, or **Bulma**.
* **Zero Configuration:** No build tools or servers needed.
* **Export to ZIP:** Download your project as a clean, production-ready bundle.

#### ⚡ **Performance & UX**
* **Session Persistence:** State is automatically saved in your browser's `localStorage`.
* **Flexible Layout:** Responsive UI with draggable resizers and layout toggles.
* **Security First:** Subresource Integrity (SRI) for all external dependencies.
* **Ultra-Lightweight:** Fast, minimal footprint, and hostable anywhere.

---

## **Tech Stack**

* **Core:** HTML5, CSS3, JavaScript (ES6+)
* **Styling:** Tailwind CSS (via CDN)
* **Code Editor:** ACE Editor
* **Formatter:** Prettier
* **File Packaging:** JSZip
* **Icons:** Lucide Icons
* **Persistence:** browser `localStorage` API

---

## **Project Structure**

```.txt
livemarkup/
├── index.html              # Main UI and layout
├── README.md               # Documentation
├── terms.html              # Terms of Use
├── LICENSE                 # MIT License
└── assets/
    ├── css/
    │   └── style.css       # Core UI styles
    ├── img/                # Visual assets
    └── js/
        ├── config.js       # App configuration
        ├── editor.js       # Editor setup
        └── main.js         # Application logic
```

---

## **Contributing**

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to report bugs, suggest features, or get started with development.

---

## **License & Terms**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
By using this tool, you agree to our [Terms of Use](terms.html).

---

## **Author**

**[Forhad Khan](https://forhadkhan.com)** | [@forhadkhan](https://github.com/forhadkhan)
