import { Page } from '@playwright/test';

export class MemoryPage {
  constructor(private page: Page) {}

  get memoryGrid() {
    return this.page.locator('[data-testid="memory-grid"]');
  }

  memoryCell(address: number) {
    return this.page.locator(`[data-testid="memory-cell-${address}"]`);
  }

  editButton(address: number) {
    return this.page.locator(`[data-testid="edit-cell-${address}"]`);
  }

  async editMemoryCell(address: number, value: string) {
    await this.editButton(address).click();
    await this.page.fill('[data-testid="cell-input"]', value);
    await this.page.click('[data-testid="save-cell"]');
  }

  async getMemoryValue(address: number) {
    return await this.memoryCell(address).textContent() || '';
  }

  async scrollToAddress(address: number) {
    const cell = this.memoryCell(address);
    await cell.scrollIntoViewIfNeeded();
  }

  async isMemoryCellVisible(address: number) {
    return await this.memoryCell(address).isVisible();
  }
}