import { test, expect } from '@playwright/test';

// Selector reference (Anexo-C ranking):
//   a:has-text("...")     → text content (rank 3) — nav links
//   .page-content h1      → hierarchy (rank 5) — page heading

test.describe('navigation', () => {
  test('nav link "Contactos" navigates to contactos page', async ({ page }) => {
    await page.goto('/index.html');
    await page.getByRole('link', { name: 'Contactos' }).click();
    await expect(page).toHaveURL(/contactos/);
    await expect(page.locator('.page-content')).toContainText('Contactos');
  });

  test('nav link "Eventos" navigates to eventos page', async ({ page }) => {
    await page.goto('/index.html');
    await page.getByRole('link', { name: 'Eventos' }).click();
    await expect(page).toHaveURL(/eventos/);
    await expect(page.locator('.page-content')).toContainText('Eventos');
  });

  test('Temas dropdown contains all section links', async ({ page }) => {
    await page.goto('/index.html');
    const temas = page.locator('header .nav li:has-text("Temas")');
    await temas.hover();
    await expect(page.locator('header .nav a:text("Educación")')).toBeVisible();
    await expect(page.locator('header .nav a:text("Empleo")')).toBeVisible();
    await expect(page.locator('header .nav a:text("Horarios")')).toBeVisible();
  });
});
