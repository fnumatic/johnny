import { expect as playwrightExpect } from '@playwright/test';

export class CPUAssertions {
  static async expectCPUState(page: any, expectedState: {
    accumulator?: number;
    programCounter?: number;
    instructionRegister?: number;
  }) {
    if (expectedState.accumulator !== undefined) {
      const accValue = await page.locator('[data-testid="accumulator"]').textContent();
      playwrightExpect(parseInt(accValue || '0', 10)).toBe(expectedState.accumulator);
    }
    
    if (expectedState.programCounter !== undefined) {
      const pcValue = await page.locator('[data-testid="program-counter"]').textContent();
      playwrightExpect(parseInt(pcValue || '0', 10)).toBe(expectedState.programCounter);
    }

    if (expectedState.instructionRegister !== undefined) {
      const irValue = await page.locator('[data-testid="instruction-register"]').textContent();
      playwrightExpect(parseInt(irValue || '0', 10)).toBe(expectedState.instructionRegister);
    }
  }

  static async expectMemoryValue(page: any, address: number, expectedValue: string) {
    const memoryCell = page.locator(`[data-testid="memory-cell-${address}"]`);
    const actualValue = await memoryCell.textContent();
    playwrightExpect(actualValue?.trim()).toBe(expectedValue);
  }

  static async expectButtonEnabled(page: any, buttonTestId: string, enabled: boolean) {
    const button = page.locator(`[data-testid="${buttonTestId}"]`);
    if (enabled) {
      await playwrightExpect(button).toBeEnabled();
    } else {
      await playwrightExpect(button).toBeDisabled();
    }
  }

  static async expectElementVisible(page: any, testId: string, visible: boolean) {
    const element = page.locator(`[data-testid="${testId}"]`);
    if (visible) {
      await playwrightExpect(element).toBeVisible();
    } else {
      await playwrightExpect(element).toBeHidden();
    }
  }
}