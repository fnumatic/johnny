import { test, expect } from '@playwright/test';
import { AppPage } from '../page-objects/app.po';
import { TEST_DATA } from '../fixtures/test-data';

test.describe('Application Initialization', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    await appPage.navigate();
  });

  test('should display splash screen on load', async ({ page }) => {
    await expect(appPage.splashScreen).toBeVisible();
  });

  test('should hide splash screen and show main interface', async ({ page }) => {
    await appPage.waitForAppLoad();
    await expect(appPage.mainInterface).toBeVisible();
    await expect(appPage.splashScreen).toBeHidden();
  });

  test('should display all CPU components after loading', async ({ page }) => {
    await appPage.waitForAppLoad();
    
    await expect(appPage.memorySection).toBeVisible();
    await expect(appPage.controlUnit).toBeVisible();
    await expect(appPage.toolbar).toBeVisible();
  });

  test('should initialize CPU with correct default values', async ({ page }) => {
    await appPage.waitForAppLoad();
    
    const accumulator = page.locator('[data-testid="accumulator-value"]');
    const programCounter = page.locator('[data-testid="program-counter-value"]');
    const instructionRegister = page.locator('[data-testid="instruction-register-value"]');

    await expect(accumulator).toHaveText('00000');
    await expect(programCounter).toHaveText('00000');
    await expect(instructionRegister).toHaveText('00.000');
  });

  test('should load default test program automatically', async ({ page }) => {
    await appPage.waitForAppLoad();
    
    const firstMemoryCell = page.locator('[data-testid="memory-cell-0"]');
    await expect(firstMemoryCell).toBeVisible();
    
    const cellValue = await firstMemoryCell.textContent();
    expect(cellValue).not.toBe('');
  });

  test('should toggle dev mode with keyboard shortcut', async ({ page }) => {
    await appPage.waitForAppLoad();
    
    const initiallyHidden = await appPage.isDevModeVisible();
    expect(initiallyHidden).toBeFalsy();
    
    await appPage.toggleDevMode();
    
    const nowVisible = await appPage.isDevModeVisible();
    expect(nowVisible).toBeTruthy();
    
    await appPage.toggleDevMode();
    
    const hiddenAgain = await appPage.isDevModeVisible();
    expect(hiddenAgain).toBeFalsy();
  });

  test('should have correct page title', async ({ page }) => {
    await appPage.waitForAppLoad();
    await expect(page).toHaveTitle(/Johnny 3.0/);
  });

  test('should handle page refresh gracefully', async ({ page }) => {
    await appPage.waitForAppLoad();
    await expect(appPage.mainInterface).toBeVisible();
    
    await page.reload();
    await appPage.waitForAppLoad();
    await expect(appPage.mainInterface).toBeVisible();
  });

  test('should have memory grid with correct number of cells', async ({ page }) => {
    await appPage.waitForAppLoad();
    
    const memoryGrid = page.locator('[data-testid="memory-grid"]');
    await expect(memoryGrid).toBeVisible();
    
    const memoryCells = page.locator('[data-testid^="memory-cell-"]');
    const cellCount = await memoryCells.count();
    expect(cellCount).toBeGreaterThan(0);
  });

  test('should display address and data buses', async ({ page }) => {
    await appPage.waitForAppLoad();
    
    const addressBus = page.locator('[data-testid="address-bus"]');
    const dataBus = page.locator('[data-testid="data-bus"]');
    
    await expect(addressBus).toBeVisible();
    await expect(dataBus).toBeVisible();
  });
});