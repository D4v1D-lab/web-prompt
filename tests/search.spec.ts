import { test, expect } from '@playwright/test';

// Selector reference (Anexo-C ranking):
//   input[name="search-term"] → semantic attribute (rank 3) — search field
//   .recent-post              → class (rank 4) — search result cards

test('search input filters recent posts', async ({ page }) => {
  await page.goto('/index.html');
  const search = page.locator('input[name="search-term"]');
  await expect(search).toBeVisible();
  await search.fill('becas');
  await page.waitForTimeout(500);
  const results = page.locator('.recent-post');
  const count = await results.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test('empty search shows all recent posts', async ({ page }) => {
  await page.goto('/index.html');
  const search = page.locator('input[name="search-term"]');
  await search.fill('');
  await page.waitForTimeout(500);
  const results = page.locator('.recent-post');
  await expect(results.first()).toBeVisible();
});
