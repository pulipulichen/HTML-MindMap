
async function downloadImage() {
    const area = document.getElementById('captureArea');
    // 為了確保完整捕捉，我們先滾動到最上方
    const canvas = await html2canvas(area, {
        backgroundColor: "rgba(255,255,255,0)",
        scale: 2,
        logging: false,
        useCORS: true
    });

    // 取得檔名：輸入文字第一行 + YYYYMMDD-HHmmSS
    const textInput = document.getElementById('textInput');
    let firstLine = '心智圖';
    if (textInput && textInput.value.trim()) {
        firstLine = textInput.value.trim().split('\n')[0].substring(0, 50).trim();
        // 過濾掉檔案系統不允許的字元
        firstLine = firstLine.replace(/[\\/:*?"<>|]/g, '_');
    }

    const now = new Date();
    const timestamp = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '-' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

    const link = document.createElement('a');
    link.download = `${firstLine}-${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

async function copyImageToClipboard() {
    try {
        const area = document.getElementById('captureArea');
        const canvas = await html2canvas(area, {
            // backgroundColor: '#000000',
            backgroundColor: "rgba(255,255,255,0)",
            scale: 2
        });
        
        canvas.toBlob(async (blob) => {
            try {
                const data = [new ClipboardItem({ 'image/png': blob })];
                await navigator.clipboard.write(data);
                showToast();
            } catch (err) {
                // 回退方案：提醒用戶手動下載
                const msg = document.createElement('div');
                msg.textContent = "瀏覽器限制，請點擊『下載 PNG』";
                msg.className = "bg-red-600 text-white p-2 rounded fixed bottom-4 left-4 z-50";
                document.body.appendChild(msg);
                setTimeout(() => msg.remove(), 2000);
            }
        });
    } catch (err) {
        console.error("複製失敗", err);
    }
}
