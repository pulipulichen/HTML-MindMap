import { test, expect } from '@playwright/test';

test('應該能正常載入頁面並顯示心智圖', async ({ page }) => {
  await page.goto('http://localhost:8080');

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('cdn.tailwindcss.com')) {
        consoleErrors.push(text);
      }
    }
  });

  await expect(page).toHaveTitle(/Vertical Mind Map Generator|垂直心智圖產生器/);
  await expect(page.locator('#textInput')).toBeVisible();
  await expect(page.locator('#renderRoot')).toBeVisible();

  const textarea = page.locator('#textInput');
  await textarea.fill('Test Node\n- Child 1\n- Child 2');

  await page.waitForTimeout(500);

  const nodes = page.locator('.node');
  const count = await nodes.count();
  expect(count).toBeGreaterThan(0);

  await page.waitForLoadState('networkidle');
  expect(consoleErrors).toEqual([]);
});

test('頁面載入時應優先套用 localStorage 語系', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('mindmap_language', 'zh-TW');
    localStorage.removeItem('mindmap_content');
  });

  await page.goto('http://localhost:8080');

  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.locator('#language-select')).toHaveValue('zh-TW');
  await expect(page.locator('h1')).toContainText('垂直心智圖產生器');
});

test('應可手動切換語系並即時更新文案', async ({ page }) => {
  await page.goto('http://localhost:8080');

  await page.selectOption('#language-select', 'en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toContainText('Vertical Mind Map Generator');
  await expect(page.locator('button:has-text("Download PNG")')).toBeVisible();
});

test('語系切換後應寫入 localStorage 並在重整後維持', async ({ page }) => {
  await page.goto('http://localhost:8080');

  await page.selectOption('#language-select', 'zh-TW');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');

  const storedLanguage = await page.evaluate(() => localStorage.getItem('mindmap_language'));
  expect(storedLanguage).toBe('zh-TW');

  await page.reload();
  await expect(page.locator('#language-select')).toHaveValue('zh-TW');
  const downloadBtn = page.locator('button:has-text("下載 PNG")');
  await expect(downloadBtn).toBeVisible();
});
