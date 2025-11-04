import { Page } from '@playwright/test';

export class TestUtils {
  static async waitForCPUOperation(page: Page, timeout = 100) {
    await page.waitForTimeout(timeout);
  }

  static async loadProgram(page: Page, program: string) {
    await page.click('[data-testid="paste-program-button"]');
    await page.fill('[data-testid="program-input"]', program);
    await page.click('[data-testid="load-pasted-program-button"]');
  }

  static async resetCPU(page: Page) {
    await page.click('[data-testid="reset-button"]');
  }

  static async startExecution(page: Page) {
    await page.click('[data-testid="start-button"]');
  }

  static async stopExecution(page: Page) {
    await page.click('[data-testid="stop-button"]');
  }

  static async stepExecution(page: Page) {
    await page.click('[data-testid="step-button"]');
  }

  static async setExecutionSpeed(page: Page, speed: number) {
    await page.fill('[data-testid="speed-slider"]', speed.toString());
  }

  static async toggleDevMode(page: Page) {
    await page.keyboard.press('Control+Shift+D');
  }

  static async waitForElementToDisappear(page: Page, selector: string, timeout = 5000) {
    await page.waitForSelector(selector, { state: 'detached', timeout });
  }

  static async waitForElementToAppear(page: Page, selector: string, timeout = 5000) {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  static async getMemoryCellValue(page: Page, address: number) {
    const cell = page.locator(`[data-testid="memory-cell-${address}"]`);
    return await cell.textContent();
  }

  static async editMemoryCell(page: Page, address: number, value: string) {
    await page.click(`[data-testid="edit-cell-${address}"]`);
    await page.fill('[data-testid="cell-input"]', value);
    await page.click('[data-testid="save-cell"]');
  }

  static async isElementVisible(page: Page, selector: string) {
    return await page.locator(selector).isVisible();
  }

  static async isElementEnabled(page: Page, selector: string) {
    return await page.locator(selector).isEnabled();
  }
}