import { test, expect } from '@playwright/test';

// Selector reference (Anexo-C ranking):
//   .share-section        → class (rank 4) — share container
//   .share-btn.whatsapp   → class + modifier (rank 4) — WhatsApp button
//   .share-btn.facebook   → class + modifier (rank 4) — Facebook button
//   .share-btn.link       → class + modifier (rank 4) — copy link button

test('share buttons render on article page', async ({ page }) => {
  await page.goto('/single.html?id=1');
  await expect(page.locator('.share-section')).toBeVisible();
  await expect(page.locator('.share-btn.whatsapp')).toBeVisible();
  await expect(page.locator('.share-btn.facebook')).toBeVisible();
  await expect(page.locator('.share-btn.link')).toBeVisible();
});

test('share buttons render on homepage recent posts', async ({ page }) => {
  await page.goto('/index.html');
  const firstPost = page.locator('.recent-post').first();
  await expect(firstPost.locator('.share-section')).toBeVisible();
});
