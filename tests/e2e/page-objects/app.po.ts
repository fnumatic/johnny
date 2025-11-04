import { Page } from '@playwright/test';

export class AppPage {
  constructor(private page: Page) {}

  get splashScreen() {
    return this.page.locator('[data-testid="splash-screen"]');
  }

  get mainInterface() {
    return this.page.locator('[data-testid="main-interface"]');
  }

  get memorySection() {
    return this.page.locator('[data-testid="memory-section"]');
  }

  get controlUnit() {
    return this.page.locator('[data-testid="control-unit"]');
  }

  get toolbar() {
    return this.page.locator('[data-testid="toolbar"]');
  }

  async waitForAppLoad() {
    await this.splashScreen.waitFor({ state: 'hidden' });
    await this.mainInterface.waitFor({ state: 'visible' });
  }

  async toggleDevMode() {
    await this.page.keyboard.press('Control+Shift+D');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async isDevModeVisible() {
    return await this.page.locator('[data-testid="dev-mode"]').isVisible();
  }
}