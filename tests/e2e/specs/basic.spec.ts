import { test, expect } from '@playwright/test';

test.describe('Basic E2E Test', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Check if the page title contains Johnny
    const title = await page.title();
    expect(title).toContain('Johnny');
  });

  test('should show main elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Look for any main content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});