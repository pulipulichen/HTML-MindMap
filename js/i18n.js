(function setupI18n() {
    const LANGUAGE_STORAGE_KEY = 'mindmap_language';
    const CONTENT_STORAGE_KEY = 'mindmap_content';
    const DEFAULT_LANGUAGE = 'en';
    const FALLBACK_LANGUAGE = 'en';

    const TRANSLATIONS = {
        en: window.MINDMAP_TRANSLATIONS_EN || {},
        'zh-TW': window.MINDMAP_TRANSLATIONS_ZH_TW || {}
    };

    const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);
    const LANGUAGE_ALIASES = {
        en: 'en',
        'en-us': 'en',
        'en-gb': 'en',
        zh: 'zh-TW',
        'zh-tw': 'zh-TW',
        'zh-hk': 'zh-TW'
    };

    let currentLanguage = DEFAULT_LANGUAGE;

    function normalizeLanguage(language) {
        if (!language || typeof language !== 'string') {
            return null;
        }

        const trimmed = language.trim();
        if (!trimmed) {
            return null;
        }

        if (SUPPORTED_LANGUAGES.includes(trimmed)) {
            return trimmed;
        }

        const lowerCaseLanguage = trimmed.toLowerCase();
        if (LANGUAGE_ALIASES[lowerCaseLanguage]) {
            return LANGUAGE_ALIASES[lowerCaseLanguage];
        }

        const primary = lowerCaseLanguage.split('-')[0];
        if (LANGUAGE_ALIASES[primary]) {
            return LANGUAGE_ALIASES[primary];
        }

        return null;
    }

    function resolvePath(source, path) {
        return path.split('.').reduce((acc, key) => {
            if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
                return acc[key];
            }
            return undefined;
        }, source);
    }

    function interpolate(text, params) {
        if (typeof text !== 'string') {
            return text;
        }

        return text.replace(/\{(\w+)\}/g, (match, key) => {
            if (params && Object.prototype.hasOwnProperty.call(params, key)) {
                return String(params[key]);
            }
            return match;
        });
    }

    function t(key, params) {
        const languagePack = TRANSLATIONS[currentLanguage] || {};
        const fallbackPack = TRANSLATIONS[FALLBACK_LANGUAGE] || {};
        const value = resolvePath(languagePack, key);
        const fallbackValue = resolvePath(fallbackPack, key);
        const resolved = value ?? fallbackValue ?? key;
        return interpolate(resolved, params);
    }

    function detectBrowserLanguage() {
        const candidates = [];
        if (Array.isArray(navigator.languages)) {
            candidates.push(...navigator.languages);
        }
        if (navigator.language) {
            candidates.push(navigator.language);
        }

        for (const candidate of candidates) {
            const normalized = normalizeLanguage(candidate);
            if (normalized) {
                return normalized;
            }
        }

        return DEFAULT_LANGUAGE;
    }

    function resolveInitialLanguage() {
        const storedLanguage = normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
        if (storedLanguage) {
            return storedLanguage;
        }
        return detectBrowserLanguage();
    }

    function setMetaDescription() {
        const metaDescription = document.getElementById('metaDescription');
        if (metaDescription) {
            metaDescription.setAttribute('content', t('app.description'));
        }
    }

    function setDefaultMindmapContentIfNeeded() {
        const textInput = document.getElementById('textInput');
        if (!textInput) {
            return;
        }

        const savedContent = localStorage.getItem(CONTENT_STORAGE_KEY);
        const hasDefaultFlag = Boolean(textInput.dataset.defaultContentLanguage);
        if (savedContent === null && (textInput.value.trim() === '' || hasDefaultFlag)) {
            textInput.value = t('content.defaultMindmap');
            textInput.dataset.defaultContentLanguage = currentLanguage;
        }
    }

    function applyTranslations() {
        document.documentElement.lang = currentLanguage;

        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.textContent = t('app.title');
        }

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            if (!key) {
                return;
            }
            element.textContent = t(key);
        });

        setMetaDescription();
        setDefaultMindmapContentIfNeeded();

        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = currentLanguage;
        }
    }

    function setLanguage(language, options = {}) {
        const { persist = true, silent = false } = options;
        const normalizedLanguage = normalizeLanguage(language) || DEFAULT_LANGUAGE;
        currentLanguage = normalizedLanguage;

        if (persist) {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
        }

        applyTranslations();

        if (!silent) {
            document.dispatchEvent(new CustomEvent('languagechange', {
                detail: { language: normalizedLanguage }
            }));
        }
    }

    function initLanguageSelector() {
        const languageSelect = document.getElementById('language-select');
        if (!languageSelect) {
            return;
        }

        languageSelect.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }

    function initI18n() {
        initLanguageSelector();
        setLanguage(resolveInitialLanguage(), { persist: false, silent: true });
    }

    window.i18n = {
        STORAGE_KEY: LANGUAGE_STORAGE_KEY,
        SUPPORTED_LANGUAGES,
        getCurrentLanguage: () => currentLanguage,
        setLanguage,
        t
    };

    window.t = t;
    document.addEventListener('DOMContentLoaded', initI18n);
})();
