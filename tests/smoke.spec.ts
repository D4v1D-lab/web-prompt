import { test, expect } from '@playwright/test';

// Selector reference (Anexo-C ranking):
//   .text-logo            → class (rank 4) — specific to branding header
//   a:has-text("...")     → text content (rank 3) — nav link labels
//   .footer               → class (rank 4) — single footer element

test('page loads with header, nav and footer', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('header .text-logo')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Página principal' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Noticias' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contactos' })).toBeVisible();
  await expect(page.locator('.footer')).toBeVisible();
});
