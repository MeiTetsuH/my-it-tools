import { expect, test } from '@playwright/test';

test('Rich text editing still updates HTML after the Tiptap security migration', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('html-wysiwyg-editor--html', '<p>Initial text</p>'));
  await page.goto('/html-wysiwyg-editor');
  const editor = page.locator('.tiptap');
  await editor.fill('Security regression check');
  await expect(page.locator('[data-test-id="area-content"]')).toContainText('<p>Security regression check</p>');
  await editor.press('ControlOrMeta+a');
  await editor.press('ControlOrMeta+b');
  await expect(page.locator('[data-test-id="area-content"]')).toContainText('<strong>Security regression check</strong>');
});

test('Docker conversion retains ports and volumes after transitive security updates', async ({ page }) => {
  await page.goto('/docker-run-to-docker-compose-converter');
  await page.getByPlaceholder('Your docker run command to convert...').fill('docker run --name web -p 8080:80 -v /tmp/data:/data nginx:alpine');
  const output = page.locator('[data-test-id="area-content"]');
  await expect(output).toContainText('nginx:alpine');
  await expect(output).toContainText('8080:80');
  await expect(output).toContainText('/tmp/data:/data');
});

test('UUID v1 generation accepts the updated binary node identifier', async ({ page }) => {
  await page.goto('/uuid-generator');
  await page.getByRole('button', { name: 'v1', exact: true }).click();
  await expect(page.getByPlaceholder('Your uuids')).toHaveValue(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('RSA key generation retains the browser worker and PEM output', async ({ page }) => {
  await page.goto('/rsa-key-pair-generator');
  await expect(page.locator('[data-test-id="area-content"]').first()).toContainText('BEGIN PUBLIC KEY', { timeout: 20000 });
  await expect(page.locator('[data-test-id="area-content"]').nth(1)).toContainText('BEGIN RSA PRIVATE KEY');
});
