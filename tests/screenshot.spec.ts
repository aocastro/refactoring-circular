import { test } from '@playwright/test';

test('take screenshot of circular u-shar login', async ({ page }) => {
  await page.goto('https://circular.u-shar.com.br/login?lang=pt-BR');
  await page.waitForTimeout(5000); // wait for load
  await page.screenshot({ path: 'circular-login.png', fullPage: true });
});