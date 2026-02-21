# Contributing to LiveMarkup

First off, thank you for considering contributing to LiveMarkup! 

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please create an issue on GitHub. Include:
* A clear and descriptive title.
* Steps to reproduce the bug.
* What you expected to happen vs. what actually happened.
* Your browser and OS version.

### Suggesting Enhancements
Have an idea for a new feature? We'd love to hear it!
* Check if the feature has already been suggested.
* Create a new issue and describe the feature in detail.
* Explain why this feature would be useful to other users.

### Pull Requests
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes (see [Developer Setup](#developer-setup) below).
4. Commit your changes with clear, descriptive messages.
5. Push to your fork and submit a pull request.

---

## Developer Setup

LiveMarkup is designed to be extremely lightweight and requires no build tools.

### Getting Started
1. **Clone the repository:**
   ```bash
   git clone https://github.com/forhadkhan/livemarkup.git
   ```
2. **Launch:** Open `index.html` in your favorite web browser.
   * *Tip: Using a local server (like the VS Code "Live Server" extension) is recommended for the best experience.*

### Project Architecture
* **`index.html`**: The main UI structure using Tailwind CSS (CDN) and Lucide Icons.
* **`assets/js/config.js`**: Central configuration for app metadata, library CDNs, and SRI hashes.
* **`assets/js/editor.js`**: Handles initialization and configuration of the ACE Editor instances.
* **`assets/js/main.js`**: The heart of the application. Contains logic for:
    * Live rendering and resizing.
    * Event listeners for UI controls.
    * ZIP generation (via JSZip).
    * LocalStorage persistence.

---

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
