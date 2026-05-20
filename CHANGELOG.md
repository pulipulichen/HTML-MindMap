# Changelog

## 0.0.1

### i18n Refactor Summary

- Added a localization foundation by introducing `js/i18n.js`, including language initialization priority (`localStorage` -> browser language -> default `en`), `t()` lookup, language switching, and `languagechange` notifications.
- Split locale dictionaries into `js/modules/i18n/en.js` and `js/modules/i18n/zh-TW.js` to centralize UI copy, error messages, dialog text, and default content.
- Updated UI text bindings in `index.html` with a language selector (`#language-select`) and `data-i18n` markers so titles, buttons, helper text, and preview labels update immediately when language changes.
- Refactored runtime messages and behavior in `js/example.js`, `js/export.js`, and `js/mindmap.js` to use translated strings and keep rendering plus default-example behavior consistent after switching languages.
- Added `example.en.txt` and language-aware example loading so sample content matches the active locale.
- Expanded E2E coverage in `e2e/basic.spec.js` for initial locale loading, manual switching, `localStorage` persistence, and core stability checks.

### README Documentation Summary

- Rewrote `README.md` with practical, project-accurate guidance, covering key features, tech stack, project structure, usage, and testing workflow.
- Added bilingual documentation by introducing `README_zh_tw.md` and keeping `README.md` as the English version.
- Synchronized bilingual navigation links between `README.md` and `README_zh_tw.md` while preserving aligned section structure and meaning.
