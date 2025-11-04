import { test, expect } from '@playwright/test';
import { AppPage } from '../page-objects/app.po';
import { ControlUnitPage } from '../page-objects/control-unit.po';
import { TestUtils } from '../helpers/test-utils';

test.describe('Control Interface', () => {
  let appPage: AppPage;
  let controlUnitPage: ControlUnitPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    controlUnitPage = new ControlUnitPage(page);
    await appPage.navigate();
    await appPage.waitForAppLoad();
  });

  test('should enable start button initially', async () => {
    await expect(controlUnitPage.startButton).toBeEnabled();
    await expect(controlUnitPage.stopButton).toBeDisabled();
    await expect(controlUnitPage.stepButton).toBeEnabled();
    await expect(controlUnitPage.resetButton).toBeEnabled();
  });

  test('should start execution when start button clicked', async ({ page }) => {
    const program = '1005\n2006\n3007\n10000\n23\n3\n10';
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.start();
    await TestUtils.waitForCPUOperation(page, 1000);
    
    await expect(controlUnitPage.startButton).toBeDisabled();
    await expect(controlUnitPage.stopButton).toBeEnabled();
  });

  test('should stop execution when stop button clicked', async ({ page }) => {
    const program = '1005\n2006\n3007\n10000\n23\n3\n10';
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.start();
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.stop();
    await TestUtils.waitForCPUOperation(page, 200);
    
    await expect(controlUnitPage.startButton).toBeEnabled();
    await expect(controlUnitPage.stopButton).toBeDisabled();
  });

  // test.skip('should execute single step when step button clicked', async ({ page }) => {
  //   const program = '1005\n2006\n3007\n10000\n23\n3\n10';
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   const initialPC = await controlUnitPage.getProgramCounterValue();
  //   expect(initialPC).toBe(0);
    
  //   await controlUnitPage.step();
  //   await TestUtils.waitForCPUOperation(page, 200);
    
  //   const nextPC = await controlUnitPage.getProgramCounterValue();
  //   expect(nextPC).toBe(1);
    
  //   const acc = await controlUnitPage.getAccumulatorValue();
  //   expect(acc).toBe(23); // TAKE 5 loads RAM[5] which contains 23
  // });

  // test.skip('should adjust execution speed with slider', async ({ page }) => {
  //   const program = '1005\n2006\n3007\n10000\n23\n3\n10';
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   await controlUnitPage.setSpeed(3);
  //   await TestUtils.waitForCPUOperation(page, 200);
    
  //   const speedValue = await controlUnitPage.speedDisplay.textContent();
  //   expect(speedValue).toBe('3x');
  // });

  test('should update program counter display', async ({ page }) => {
    const program = '1005\n2006\n3007\n10000\n23\n3\n10';
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.step();
    await TestUtils.waitForCPUOperation(page, 200);
    
    await expect(controlUnitPage.programCounterDisplay).toHaveText('00001');
  });

  // test.skip('should update accumulator display', async ({ page }) => {
  //   const program = '1005\n2006\n3007\n10000\n23\n3\n10';
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   await expect(controlUnitPage.accumulatorDisplay).toHaveText('00000');
    
  //   await controlUnitPage.step();
  //   await TestUtils.waitForCPUOperation(page, 200);
    
  //   await expect(controlUnitPage.accumulatorDisplay).toHaveText('00023');
  // });

  test('should display instruction register', async ({ page }) => {
    const program = '1005\n2006\n3007\n10000\n23\n3\n10';
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.step();
    await TestUtils.waitForCPUOperation(page, 200);
    
    await expect(controlUnitPage.instructionRegisterDisplay).toHaveText('01.005');
  });

  test('should disable start button during execution', async ({ page }) => {
    const program = '1005\n2006\n3007\n10000\n23\n3\n10';
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.start();
    await TestUtils.waitForCPUOperation(page, 500);
    
    const isStartDisabled = await controlUnitPage.isStartButtonEnabled();
    expect(isStartDisabled).toBeFalsy();
    
    const isStopEnabled = await controlUnitPage.isStopButtonEnabled();
    expect(isStopEnabled).toBeTruthy();
  });

  test('should enable all buttons after halt', async ({ page }) => {
    const program = '1005\n2006\n3007\n10000\n23\n3\n10';
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.start();
    await TestUtils.waitForCPUOperation(page, 2000); // Wait for program to complete
    
    await expect(controlUnitPage.startButton).toBeEnabled();
    await expect(controlUnitPage.stopButton).toBeDisabled();
    await expect(controlUnitPage.stepButton).toBeEnabled();
    await expect(controlUnitPage.resetButton).toBeEnabled();
  });

  test('should handle rapid button clicks gracefully', async ({ page }) => {
    const program = '1005\n2006\n10000';
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await controlUnitPage.step();
    await controlUnitPage.step();
    await TestUtils.waitForCPUOperation(page, 400);
    
    const pc = await controlUnitPage.getProgramCounterValue();
    expect(pc).toBe(2);
  });
});