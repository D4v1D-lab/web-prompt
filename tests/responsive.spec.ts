import { test, expect } from '@playwright/test';

// Selector reference (Anexo-C ranking):
//   .main                 → class (rank 4) — main content wrapper
//   .footer-content       → class (rank 4) — footer grid
// Viewport-based layout verification

test('desktop layout — main and sidebar side by side', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/index.html');
  const mainRect = await page.locator('.main').boundingBox();
  const sidebarRect = await page.locator('.side-bar').boundingBox();
  expect(mainRect).not.toBeNull();
  expect(sidebarRect).not.toBeNull();
  expect(sidebarRect!.x).toBeGreaterThan(mainRect!.x);
});

test('tablet layout — 2 columns', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 800 });
  await page.goto('/index.html');
  const mainRect = await page.locator('.main').boundingBox();
  const sidebarRect = await page.locator('.side-bar').boundingBox();
  expect(mainRect).not.toBeNull();
  expect(sidebarRect).not.toBeNull();
  expect(sidebarRect!.x).toBeGreaterThan(mainRect!.x);
});

test('mobile layout — single column', async ({ page }) => {
  await page.setViewportSize({ width: 670, height: 900 });
  await page.goto('/index.html');
  const recentRect = await page.locator('.main .recent').boundingBox();
  const sidebarRect = await page.locator('.side-bar').boundingBox();
  expect(recentRect).not.toBeNull();
  expect(sidebarRect).not.toBeNull();
  expect(sidebarRect!.x).toBe(recentRect!.x);
});
