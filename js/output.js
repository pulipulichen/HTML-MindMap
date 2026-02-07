
function trimCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const pixels = ctx.getImageData(0, 0, width, height);
    const data = pixels.data;
    let minX = width, minY = height, maxX = 0, maxY = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 0) {
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }
        }
    }

    if (maxX < minX || maxY < minY) {
        return canvas; // Empty canvas
    }

    const paddingX = 0;
    const paddingY = 0;

    minX = Math.max(0, minX - paddingX);
    minY = Math.max(0, minY - paddingY);
    maxX = Math.min(width, maxX + paddingX);
    maxY = Math.min(height, maxY + paddingY);


    const trimmedWidth = maxX - minX;
    const trimmedHeight = maxY - minY;

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;
    const trimmedCtx = trimmedCanvas.getContext('2d');
    trimmedCtx.drawImage(canvas, minX, minY, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);

    return trimmedCanvas;
}

async function downloadImage() {
    const area = document.getElementById('captureArea');
    // 為了確保完整捕捉，我們先滾動到最上方
    const canvas = await html2canvas(area, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
    });

    const trimmedCanvas = trimCanvas(canvas);

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
    link.href = trimmedCanvas.toDataURL('image/png');
    link.click();
}

async function copyImageToClipboard() {
    try {
        const area = document.getElementById('captureArea');
        const canvas = await html2canvas(area, {
            // backgroundColor: '#000000',
            backgroundColor: null,
            scale: 2
        });

        const trimmedCanvas = trimCanvas(canvas);

        trimmedCanvas.toBlob(async (blob) => {
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

// 即時預覽功能
let previewTimer = null;
async function updatePreview() {
    const previewStatus = document.getElementById('previewStatus');
    const previewOutput = document.getElementById('previewOutput');
    const previewContainer = document.getElementById('previewContainer');

    if (!previewStatus || !previewOutput || !previewContainer) return;

    // 顯示預覽區域
    previewContainer.classList.remove('opacity-0');
    previewContainer.classList.add('opacity-100');

    // Debounce: 避免頻繁渲染
    if (previewTimer) clearTimeout(previewTimer);

    previewTimer = setTimeout(async () => {
        try {
            previewStatus.classList.remove('bg-green-400');
            previewStatus.classList.add('bg-yellow-400');

            const area = document.getElementById('captureArea');
            const canvas = await html2canvas(area, {
                backgroundColor: null,
                scale: 1, // 預覽用 1 倍即可，兼顧效能
                logging: false,
                useCORS: true
            });

            const trimmedCanvas = trimCanvas(canvas);

            // 更新預覽顯示
            previewOutput.innerHTML = '';
            const img = new Image();
            img.src = trimmedCanvas.toDataURL('image/png');
            img.className = 'max-w-full max-h-[300px] object-contain shadow-sm';
            previewOutput.appendChild(img);

            previewStatus.classList.remove('bg-yellow-400');
            previewStatus.classList.add('bg-green-400');
        } catch (err) {
            console.error("預覽生成失敗", err);
            previewStatus.classList.remove('bg-yellow-400', 'bg-green-400');
            previewStatus.classList.add('bg-red-400');
        }
    }, 800); // 800ms 的延遲，確保用戶停止輸入後再渲染
}
