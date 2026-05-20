# HTML-MindMap

[English](./README.md) | [繁體中文](./README_zh_tw.md)

HTML-MindMap 是一個純前端的垂直心智圖工具，可將階層文字即時轉成可視化節點，並輸出為 PNG 圖片，適合用於簡報大綱與想法整理。

## 功能重點

- 垂直心智圖渲染：根節點、第一層分支與第二層子節點自動排版並繪製連線。
- 階層文字輸入：支援以 `-`（第一層）與「兩個空白 + `-`」（第二層）表示層級，並支援 `\n` 文字換行。
- 匯出與複製：可下載 PNG，或直接複製圖片到剪貼簿（依瀏覽器支援狀況）。
- 即時預覽：輸入內容後會更新右上角 Canvas 預覽縮圖。
- 多語系介面：支援 English / 繁體中文，語系設定會寫入 `localStorage` 並在重整後保留。
- 範例載入：依目前語系載入 `example.en.txt` 或 `example.txt`。

## 技術堆疊

- HTML + CSS（含 Tailwind CSS CDN）建構 UI 與版面。
- Vanilla JavaScript 實作文字解析、節點渲染、語系切換與儲存邏輯。
- `html2canvas` 產生心智圖圖片（下載、複製與即時預覽共用）。
- Playwright（Docker）做端對端測試。

## 專案結構

- `index.html`：主要頁面與 UI 結構。
- `js/mindmap.js`：文字解析、心智圖渲染、連線與內容儲存。
- `js/export.js`：下載 PNG、複製圖片、即時預覽邏輯。
- `js/i18n.js`：語系偵測、切換、翻譯與語系持久化。
- `js/modules/i18n/`：語系字典（`en.js`、`zh-TW.js`）。
- `e2e/basic.spec.js`：核心流程與 i18n 行為測試。

## 使用方式

### 1) 本機啟動

此專案為純前端靜態頁面，請使用本機 HTTP Server 啟動（避免 `file://` 造成 `fetch` 讀取範例檔失敗）：

```bash
python3 -m http.server 8080
```

啟動後開啟 `http://localhost:8080`。

### 2) 操作格式

輸入範例：

```text
主題
- 分支一
  - 子項目 A
  - 子項目 B
- 分支二
```

### 3) 匯出圖片

- 點擊 `Download PNG` 下載圖片。
- 點擊 `Copy Image` 複製圖片到剪貼簿（若瀏覽器限制，請改用下載）。

## 測試

專案提供 Docker 化 Playwright 測試流程：

```bash
npm run start
```

此指令會透過 `docker compose` 建置測試環境、啟動靜態伺服器並執行 `e2e/basic.spec.js`。
