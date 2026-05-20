
async function loadExample() {
    if (textInput.value.trim() !== "") {
        let confirmMessage = 'This will overwrite your current content. Continue loading the example?';
        if (typeof window.t === 'function') {
            confirmMessage = window.t('dialogs.loadExampleConfirm');
        }
        if (!window.confirm(confirmMessage)) {
            return;
        }
    }

    try {
        let language = 'en';
        if (window.i18n && typeof window.i18n.getCurrentLanguage === 'function') {
            language = window.i18n.getCurrentLanguage();
        }
        const exampleFile = language === 'zh-TW' ? 'example.txt' : 'example.en.txt';
        const response = await fetch(exampleFile);
        if (!response.ok) {
            let message = 'Unable to read the example file.';
            if (typeof window.t === 'function') {
                message = window.t('errors.loadExampleFile');
            }
            throw new Error(message);
        }
        const text = await response.text();
        textInput.value = text;
        renderMindMap();
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage();
        }
    } catch (err) {
        let prefix = `Failed to load example: ${err.message}`;
        if (typeof window.t === 'function') {
            prefix = window.t('errors.loadExamplePrefix', { message: err.message });
        }
        console.error(prefix, err);
        alert(prefix);
    }
}
