import { Page } from '@playwright/test';

export class DevModePage {
  constructor(public page: Page) {}

  get devModePanel() {
    return this.page.locator('[data-testid="dev-mode"]');
  }

  get statisticsTab() {
    return this.page.locator('[data-testid="statistics-tab"]');
  }

  get systemInfoTab() {
    return this.page.locator('[data-testid="system-info-tab"]');
  }

  get testProgramsTab() {
    return this.page.locator('[data-testid="test-programs-tab"]');
  }

  get debugToolsTab() {
    return this.page.locator('[data-testid="debug-tools-tab"]');
  }

  get executionCount() {
    return this.page.locator('[data-testid="execution-count"]');
  }

  get cyclesCount() {
    return this.page.locator('[data-testid="cycles-count"]');
  }

  get errorsCount() {
    return this.page.locator('[data-testid="errors-count"]');
  }

  get loadTestProgramButton() {
    return this.page.locator('[data-testid="load-test-program-button"]');
  }

  get executionTrace() {
    return this.page.locator('[data-testid="execution-trace"]');
  }

  async selectTab(tabName: string) {
    switch (tabName) {
      case 'statistics':
        await this.statisticsTab.click();
        break;
      case 'system-info':
        await this.systemInfoTab.click();
        break;
      case 'test-programs':
        await this.testProgramsTab.click();
        break;
      case 'debug-tools':
        await this.debugToolsTab.click();
        break;
    }
  }

  async getExecutionCount() {
    const text = await this.executionCount.textContent();
    return +(text || '0');
  }

  async getCyclesCount() {
    const text = await this.cyclesCount.textContent();
    return +(text || '0');
  }

  async getErrorsCount() {
    const text = await this.errorsCount.textContent();
    return +(text || '0');
  }



  async loadTestProgram() {
    await this.loadTestProgramButton.click();
  }

  async getExecutionTraceContent() {
    return await this.executionTrace.textContent();
  }

  async isDevModePanelVisible() {
    return await this.devModePanel.isVisible();
  }
}