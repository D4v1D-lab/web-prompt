import { test, expect } from '@playwright/test';

// Selector reference (Anexo-C ranking):
//   .footer               → class (rank 4) — footer section
//   a[href*="wa.me"]      → semantic attribute (rank 3) — WhatsApp link
//   input[name="subs-term"] → semantic attribute (rank 3) — newsletter input

test('footer contains contact info and quick links', async ({ page }) => {
  await page.goto('/index.html');
  const footer = page.locator('.footer');
  await expect(footer).toContainText('+593 989 448 049');
  await expect(footer).toContainText('centroderecursosloschillos@gmail.com');
  await expect(footer.getByRole('link', { name: 'Voluntariado' })).toBeVisible();
});

test('newsletter form submits correctly', async ({ page }) => {
  await page.goto('/index.html');
  const input = page.locator('input[name="subs-term"]');
  await input.fill('test@example.com');
  await page.locator('.section.contact .btn').click();
  await expect(page.locator('.section.contact .btn')).toContainText('Suscrito');
});
