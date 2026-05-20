(function registerEnglishTranslations() {
    window.MINDMAP_TRANSLATIONS_EN = {
        app: {
            title: "Vertical Mind Map Generator",
            description: "A simple and fast vertical mind map tool with multi-level structure and PNG export."
        },
        language: {
            label: "Language",
            option: {
                en: "English",
                "zh-TW": "Traditional Chinese"
            }
        },
        ui: {
            inputHint: "Please follow the format below (supports \\n line breaks):"
        },
        buttons: {
            loadExample: "Load Example",
            downloadPng: "Download PNG",
            copyImage: "Copy Image"
        },
        toast: {
            copySuccess: "Copied to clipboard!"
        },
        preview: {
            title: "Live Preview (Canvas)",
            generating: "Generating preview..."
        },
        dialogs: {
            loadExampleConfirm: "This will overwrite your current content. Continue loading the example?"
        },
        errors: {
            loadExampleFile: "Unable to read the example file.",
            loadExamplePrefix: "Failed to load example: {message}",
            browserClipboardLimit: "Browser limitation detected, please click 'Download PNG'.",
            copyFailed: "Failed to copy image",
            previewFailed: "Failed to generate preview"
        },
        export: {
            defaultFilename: "MindMap"
        },
        content: {
            defaultMindmap: "Interview Analysis\n- Implementation:\\nInterview Transcription\n  - Preparation\n  - Start Transcription\n  - Finish Transcription\n- Data Analysis\\nwith RAG\n  - Speech-to-text limitations\n  - Retrieval-Augmented Generation\n  - Google\\nNotebookLM\n- Implementation:\\nAnalyze Interviews with RAG\n  - Create notebook\n  - Prompt design\n  - Review analysis output"
        }
    };
})();
