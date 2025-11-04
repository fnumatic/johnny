import { Page } from '@playwright/test';

export class ToolbarPage {
  constructor(private page: Page) {}

  get loadProgramButton() {
    return this.page.locator('[data-testid="load-program-button"]');
  }

  get clearMemoryButton() {
    return this.page.locator('[data-testid="clear-memory-button"]');
  }

  get saveStateButton() {
    return this.page.locator('[data-testid="save-state-button"]');
  }

  get loadStateButton() {
    return this.page.locator('[data-testid="load-state-button"]');
  }

  get helpButton() {
    return this.page.locator('[data-testid="help-button"]');
  }

  get programInput() {
    return this.page.locator('[data-testid="program-input"]');
  }

  get programDialog() {
    return this.page.locator('[data-testid="program-dialog"]');
  }

  get saveProgramButton() {
    return this.page.locator('[data-testid="save-program-button"]');
  }

  get cancelButton() {
    return this.page.locator('[data-testid="cancel-button"]');
  }

  async loadProgram(program: string) {
    await this.loadProgramButton.click();
    await this.programInput.fill(program);
    await this.saveProgramButton.click();
  }

  async clearMemory() {
    await this.clearMemoryButton.click();
  }

  async saveState() {
    await this.saveStateButton.click();
  }

  async loadState() {
    await this.loadStateButton.click();
  }

  async openHelp() {
    await this.helpButton.click();
  }

  async isProgramDialogVisible() {
    return await this.programDialog.isVisible();
  }

  async closeProgramDialog() {
    await this.cancelButton.click();
  }
}