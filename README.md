# **Live HTML Editor & Previewer**

A powerful, client-side web development tool that provides real-time previews for your HTML, CSS, and JavaScript code.
Built entirely with pure JavaScript, this live editor runs fully in the browser — no backend required.
It’s perfect for quick prototyping, learning, or quick checking web snippets, and can be hosted easily on any static hosting platform such as GitHub Pages.

---

## **Features**

Packed with features to offer a smooth, professional, and modern development experience:

* **Tri-Panel Code Editor:** Separate, tabbed editors for HTML, CSS, and JavaScript, powered by **ACE Editor** for syntax highlighting, autocompletion, and themes.
* **Real-Time Preview:** Instantly see your code come to life in the preview pane. Updates automatically as you type (with debounce) or manually using the **Run** button.
* **Console Output:** View JavaScript logs and errors directly within the built-in console panel.
* **Code Formatting:** Integrated **Prettier** for one-click code beautification of HTML, CSS, and JavaScript.
* **Theme Toggle:** Switch seamlessly between **dark (Tomorrow Night)** and **light (Chrome)** editor themes.
* **Zoom Controls:** Adjust font size easily with zoom-in and zoom-out controls for better readability.
* **Draggable Resizer:** Resize the editor and preview panes dynamically using the vertical resizer.
* **Adaptive Layout:**

  * On large screens, the editor and preview appear side-by-side.
  * On smaller screens, they stack vertically.
  * A **layout toggle** in the header lets you switch views manually at any time.
* **Responsive Design Testing:** Preview your project across multiple device sizes — from mobile to desktop — using the responsive control panel.
* **Immersive Fullscreen Modes:**

  * **Editor Fullscreen:** Focus solely on your code.
  * **Preview Fullscreen:** View your project distraction-free.
* **Editor Configuration:** Customize tab width (2 or 4 spaces) to match your coding style.
* **Export as ZIP:** Download your full project (HTML, CSS, and JS) bundled neatly into a single `.zip` file.

---

## **Tech Stack**

Built for speed, simplicity, and portability using modern client-side technologies:

* **Core:** HTML5, CSS3, JavaScript (ES6+)
* **Styling:** Tailwind CSS (via CDN) — utility-first and lightweight
* **Code Editor:** ACE Editor — for syntax highlighting, themes, and autocompletion
* **Formatter:** Prettier — for consistent and clean code formatting
* **File Packaging:** JSZip — for in-browser ZIP creation
* **Icons:** Lucide Icons — sleek and modern SVG icon set

---

## **How to Use**

1. **Clone** the repository or **download** the files.
2. **Open** `index.html` directly in your web browser — no build or server setup required.
3. **Start coding:**

   * Write markup in the **HTML** tab.
   * Add styles in the **CSS** tab.
   * Implement logic in the **JavaScript** tab.
4. **Preview:** See live updates as you type or click **Run** to refresh manually.
5. **Use the Controls:**

   * **Format** your code with one click.
   * **Test responsiveness** across devices.
   * **Toggle fullscreen** or **switch themes** as needed.
   * **Download** your complete project as a ZIP file.

---

## **Project Structure**

A simple and organized structure for easy navigation:

```.txt
.
├── index.html              # Main entry point (UI layout)
├── README.md               # Project documentation (you are here)
└── assets/
    ├── css/
    │   └── style.css       # Custom styles for layout and UI
    ├── img/                # Images and icons
    └── js/
        ├── config.js       # App configuration and metadata
        ├── editor.js       # ACE editor setup and event handling
        └── main.js         # Core logic and feature implementation
```

---

## **Author**

**[Forhad Khan](https://forhadakhan.com)**
GitHub: [@forhadakhan](https://github.com/forhadakhan)
