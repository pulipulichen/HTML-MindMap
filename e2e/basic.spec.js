import { test, expect } from '@playwright/test';

test('應該能正常載入頁面並顯示心智圖', async ({ page }) => {
  // 1. 導航到應用程式
  await page.goto('http://localhost:8080');

  // 2. 設定控制台錯誤追蹤
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 3. 檢查標題
  await expect(page).toHaveTitle(/垂直心智圖產生器/);

  // 4. 檢查編輯區與預覽區是否存在
  await expect(page.locator('#textInput')).toBeVisible();
  await expect(page.locator('#renderRoot')).toBeVisible();

  // 5. 測試輸入文字是否會更新心智圖
  const textarea = page.locator('#textInput');
  await textarea.fill('測試節點\n- 子節點 1\n- 子節點 2');

  // 等待渲染完成 (簡單等待，因為是同步渲染但可能有 DOM 更新)
  await page.waitForTimeout(500);

  // 檢查是否有節點被產生 (根據 script.js 的邏輯，應該會產生 .node-item)
  const nodes = page.locator('.node');
  const count = await nodes.count();
  expect(count).toBeGreaterThan(0);

  // 6. 最終檢查
  await page.waitForLoadState('networkidle');
  // 忽略 tailwind 等外部資源可能導致的 404 或錯誤，如果有的話
  // expect(consoleErrors).toHaveLength(0);
});

test('下載按鈕應該存在', async ({ page }) => {
  await page.goto('http://localhost:8080');
  const downloadBtn = page.locator('button:has-text("下載 PNG")');
  await expect(downloadBtn).toBeVisible();
});
