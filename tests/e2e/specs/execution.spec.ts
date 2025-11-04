import { test, expect } from '@playwright/test';
import { AppPage } from '../page-objects/app.po';
import { ControlUnitPage } from '../page-objects/control-unit.po';
import { TestUtils } from '../helpers/test-utils';
import { TEST_PROGRAMS } from '../fixtures/programs';

test.describe('Program Execution', () => {
  let appPage: AppPage;
  let controlUnitPage: ControlUnitPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    controlUnitPage = new ControlUnitPage(page);
    await appPage.navigate();
    await appPage.waitForAppLoad();
  });

  // test.skip('should load multiline program format', async ({ page }) => {
  //   const program = TEST_PROGRAMS.simple.program;
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   const memoryCell0 = page.locator('[data-testid="memory-cell-0"]');
  //   const value = await memoryCell0.textContent();
  //   expect(value?.trim()).toBe('1005');
  // });

  // test.skip('should load semicolon-separated format', async ({ page }) => {
  //   const program = TEST_PROGRAMS.semicolon.program;
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   const memoryCell0 = page.locator('[data-testid="memory-cell-0"]');
  //   const value = await memoryCell0.textContent();
  //   expect(value?.trim()).toBe('1005');
  // });

  // test.skip('should reject invalid program format', async ({ page }) => {
  //   const program = TEST_PROGRAMS.invalid.program;
    
  //   await page.click('[data-testid="load-program-button"]');
  //   await page.fill('[data-testid="program-input"]', program);
    
  //   const saveButton = page.locator('[data-testid="save-program-button"]');
  //   await expect(saveButton).toBeDisabled();
  // });

  test('should execute step-by-step correctly', async ({ page }) => {
    const program = TEST_PROGRAMS.simple.program;
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    const initialPC = await controlUnitPage.getProgramCounterValue();
    expect(initialPC).toBe(0);
    
    await controlUnitPage.step();
    await TestUtils.waitForCPUOperation(page, 200);
    
    const nextPC = await controlUnitPage.getProgramCounterValue();
    expect(nextPC).toBe(1);
  });

  // test.skip('should run continuous execution', async ({ page }) => {
  //   const program = TEST_PROGRAMS.simple.program;
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   await controlUnitPage.start();
  //   await TestUtils.waitForCPUOperation(page, 2000);
    
  //   const finalACC = await controlUnitPage.getAccumulatorValue();
  //   expect(finalACC).toBe(TEST_PROGRAMS.simple.expected.accumulator);
  // });

  // test.skip('should handle pause and resume functionality', async ({ page }) => {
  //   const program = TEST_PROGRAMS.complex.program;
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   await controlUnitPage.start();
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   await controlUnitPage.stop();
  //   const pausedPC = await controlUnitPage.getProgramCounterValue();
  //   expect(pausedPC).toBeGreaterThan(0);
    
  //   await controlUnitPage.start();
  //   await TestUtils.waitForCPUOperation(page, 1000);
    
  //   const resumedPC = await controlUnitPage.getProgramCounterValue();
  //   expect(resumedPC).toBeGreaterThan(pausedPC);
  // });

  // test.skip('should adjust execution speed', async ({ page }) => {
  //   const program = TEST_PROGRAMS.simple.program;
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   await controlUnitPage.setSpeed(5);
  //   await TestUtils.waitForCPUOperation(page, 100);
    
  //   const speedValue = await page.locator('[data-testid="speed-slider"]').inputValue();
  //   expect(speedValue).toBe('5');
  // });

  test('should reset CPU state correctly', async ({ page }) => {
    const program = TEST_PROGRAMS.simple.program;
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.step();
    await TestUtils.waitForCPUOperation(page, 200);
    
    const steppedPC = await controlUnitPage.getProgramCounterValue();
    expect(steppedPC).toBe(1);
    
    await controlUnitPage.reset();
    await TestUtils.waitForCPUOperation(page, 200);
    
    const resetPC = await controlUnitPage.getProgramCounterValue();
    const resetACC = await controlUnitPage.getAccumulatorValue();
    
    expect(resetPC).toBe(0);
    expect(resetACC).toBe(0);
  });

  // test.skip('should handle halt instruction', async ({ page }) => {
  //   const program = TEST_PROGRAMS.simple.program;
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   await controlUnitPage.start();
  //   await TestUtils.waitForCPUOperation(page, 2000);
    
  //   const finalACC = await controlUnitPage.getAccumulatorValue();
    
  //   expect(finalACC).toBe(TEST_PROGRAMS.simple.expected.accumulator);
    
  //   const isStartEnabled = await controlUnitPage.isStartButtonEnabled();
  //   expect(isStartEnabled).toBeTruthy();
  // });

  test('should update program counter correctly', async ({ page }) => {
    const program = TEST_PROGRAMS.multiline.program;
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    for (let i = 0; i < 3; i++) {
      await controlUnitPage.step();
      await TestUtils.waitForCPUOperation(page, 200);
      
      const pc = await controlUnitPage.getProgramCounterValue();
      expect(pc).toBe(i + 1);
    }
  });

  test('should display instruction register', async ({ page }) => {
    const program = TEST_PROGRAMS.simple.program;
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.step();
    await TestUtils.waitForCPUOperation(page, 200);
    
    const ir = await controlUnitPage.getInstructionRegisterValue();
    expect(ir).toBe(1005);
  });

  test('should handle complex loop program', async ({ page }) => {
    const program = TEST_PROGRAMS.complex.program;
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.start();
    await TestUtils.waitForCPUOperation(page, 3000);
    
    const finalACC = await controlUnitPage.getAccumulatorValue();
    expect(finalACC).toBe(TEST_PROGRAMS.complex.expected.accumulator);
  });
});