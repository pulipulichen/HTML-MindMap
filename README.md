# HTML-MindMap

[English](./README.md) | [繁體中文](./README_zh_tw.md)

HTML-MindMap is a frontend-only vertical mind map tool that turns hierarchical text into visual nodes in real time and exports the result as a PNG image. It is suitable for presentation outlining and idea structuring.

## Key Features

- Vertical mind map rendering with automatic layout and connectors for root, level-1, and level-2 nodes.
- Hierarchical text input using `-` (level 1) and two leading spaces plus `-` (level 2), with support for `\n` text line breaks.
- Export options for both PNG download and clipboard image copy (depending on browser support).
- Live Canvas preview shown in the top-right area while editing.
- Bilingual interface (English / Traditional Chinese) with language preference persisted in `localStorage`.
- Language-aware example loading from `example.en.txt` or `example.txt`.

## Tech Stack

- HTML + CSS (with Tailwind CSS CDN) for UI and layout.
- Vanilla JavaScript for parsing, rendering, localization, and persistence logic.
- `html2canvas` for image generation (download, copy, and preview).
- Playwright (Docker-based) for end-to-end testing.

## Project Structure

- `index.html`: Main page and UI structure.
- `js/mindmap.js`: Text parsing, map rendering, connectors, and content persistence.
- `js/export.js`: PNG download, clipboard copy, and live preview logic.
- `js/i18n.js`: Language detection, switching, translation, and preference persistence.
- `js/modules/i18n/`: Locale dictionaries (`en.js`, `zh-TW.js`).
- `e2e/basic.spec.js`: Core flow and i18n behavior tests.

## Usage

### 1) Run Locally

This project is a static frontend app. Start it with a local HTTP server (to avoid `file://` issues when fetching example files):

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

### 2) Input Format

Example:

```text
Topic
- Branch One
  - Sub Item A
  - Sub Item B
- Branch Two
```

### 3) Export Image

- Click `Download PNG` to save the image.
- Click `Copy Image` to copy to clipboard (if blocked by browser limitations, use download instead).

## Testing

The project includes a Dockerized Playwright test workflow:

```bash
npm run start
```

This command uses `docker compose` to build the test environment, start a static server, and run `e2e/basic.spec.js`.
