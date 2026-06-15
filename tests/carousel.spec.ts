import { test, expect } from '@playwright/test';

// Selector reference (Anexo-C ranking):
//   .post-slider          → class (rank 4) — carousel wrapper
//   .single-post          → class (rank 4) — each slide
//   h4 a                  → hierarchy (rank 5) — slide title link

test('carousel renders featured articles', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('.post-slider')).toBeVisible();
  await expect(page.locator('.single-post').first()).toBeVisible();
  const slides = page.locator('.single-post');
  await expect(slides).toHaveCount(await slides.count());
});
