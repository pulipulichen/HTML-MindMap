
async function loadExample() {
    if (textInput.value.trim() !== "") {
        if (!window.confirm("這將會覆蓋您目前的內容，確定要載入範例嗎？")) {
            return;
        }
    }

    try {
        const response = await fetch('example.txt');
        if (!response.ok) {
            throw new Error('無法讀取範例檔案');
        }
        const text = await response.text();
        textInput.value = text;
        renderMindMap();
    } catch (err) {
        console.error("載入範例失敗", err);
        alert("載入範例失敗：" + err.message);
    }
}
