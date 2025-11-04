import { Page } from '@playwright/test';

export class ControlUnitPage {
  constructor(private page: Page) {}

  get startButton() {
    return this.page.locator('[data-testid="start-button"]');
  }

  get stopButton() {
    return this.page.locator('[data-testid="stop-button"]');
  }

  get resetButton() {
    return this.page.locator('[data-testid="reset-button"]');
  }

  get stepButton() {
    return this.page.locator('[data-testid="step-button"]');
  }

  get speedSlider() {
    return this.page.locator('[data-testid="speed-slider"]');
  }

  get speedDisplay() {
    return this.page.locator('[data-testid="speed-display"]');
  }

  get accumulatorDisplay() {
    return this.page.locator('[data-testid="accumulator-value"]');
  }

  get programCounterDisplay() {
    return this.page.locator('[data-testid="program-counter-value"]');
  }

  get instructionRegisterDisplay() {
    return this.page.locator('[data-testid="instruction-register-value"]');
  }

  async start() {
    await this.startButton.click();
  }

  async stop() {
    await this.stopButton.click();
  }

  async reset() {
    await this.resetButton.click();
  }

  async step() {
    await this.stepButton.click();
  }

  async setSpeed(speed: number) {
    // For sliders, we need to click and drag or use keyboard navigation
    await this.speedSlider.focus();
    await this.speedSlider.press('Home'); // Go to minimum
    for (let i = 1; i < speed; i++) {
      await this.speedSlider.press('ArrowRight');
      await this.page.waitForTimeout(100); // Small delay between key presses
    }
    await this.page.waitForTimeout(500); // Wait for state to update
  }

  async getAccumulatorValue() {
    const text = await this.accumulatorDisplay.textContent();
    return +(text?.trim() || '0');
  }

  async getProgramCounterValue() {
    const text = await this.programCounterDisplay.textContent();
    return +(text?.trim() || '0');
  }

  async getInstructionRegisterValue() {
    const text = await this.instructionRegisterDisplay.textContent();
    // Handle format like "01.005" -> convert to 1005
    const clean = text?.trim().replace('.', '') || '0';
    return +clean;
  }

  async isStartButtonEnabled() {
    return await this.startButton.isEnabled();
  }

  async isStopButtonEnabled() {
    return await this.stopButton.isEnabled();
  }
}