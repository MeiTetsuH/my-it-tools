import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

test.describe('Tool - Pdf signature checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pdf-signature-checker');
  });

  test('Always explains that certificate information is unverified', async ({ page }) => {
    await expect(page.getByText('Unverified: this tool only reads embedded certificate information.', { exact: false })).toBeVisible();
  });

  test('Reads real certificate metadata without a validity or trust verdict', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles(fileURLToPath(new URL('./fixtures/blank_signed.pdf', import.meta.url)));
    await expect(page.getByText('Signature 1 certificates :')).toBeVisible();
    await expect(page.getByText('Unverified:', { exact: false })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText(/^signature (is )?(valid|verified|trusted)$/i)).toHaveCount(0);
  });

  test('Handles an unreadable PDF without a false signature verdict', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles({ name: 'invalid.pdf', mimeType: 'application/pdf', buffer: Buffer.from('not a PDF') });
    await expect(page.getByText('Unable to read signature information from this file.', { exact: false })).toBeVisible();
    await expect(page.getByText('Unverified:', { exact: false })).toBeVisible();
    await expect(page.getByRole('table')).toHaveCount(0);
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('PDF signature checker - IT Tools');
  });
});
