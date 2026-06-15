import { test, expect } from '@playwright/test';

// Selector reference (Anexo-C ranking):
//   .main .recent         → class hierarchy (rank 5) — recent posts container
//   .recent-post          → class (rank 4) — each post card
//   .btn:has-text("...")  → class + text (rank 4+3) — action buttons

test('recent posts section displays articles', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('.main .recent')).toBeVisible();
  const posts = page.locator('.recent-post');
  await expect(posts.first()).toBeVisible();
  await expect(posts.first().locator('.btn')).toBeVisible();
});

test('clicking "Leer mas" navigates to article page', async ({ page }) => {
  await page.goto('/index.html');
  const firstPost = page.locator('.recent-post').first();
  await firstPost.locator('.btn').click();
  await expect(page).toHaveURL(/single\.html\?id=/);
});
