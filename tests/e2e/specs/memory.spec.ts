import { test, expect } from '@playwright/test';
import { AppPage } from '../page-objects/app.po';
import { MemoryPage } from '../page-objects/memory.po';
import { TestUtils } from '../helpers/test-utils';

test.describe('Memory Management', () => {
  let appPage: AppPage;
  let memoryPage: MemoryPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    memoryPage = new MemoryPage(page);
    await appPage.navigate();
    await appPage.waitForAppLoad();
  });

  test('should display memory grid with correct number of cells', async ({ page }) => {
    await expect(memoryPage.memoryGrid).toBeVisible();
    
    const memoryCells = page.locator('[data-testid^="memory-cell-"]');
    const cellCount = await memoryCells.count();
    expect(cellCount).toBeGreaterThan(0);
  });

  test('should show memory cell addresses correctly', async ({ page }) => {
    const firstCell = page.locator('[data-testid="memory-cell-0"]');
    await expect(firstCell).toBeVisible();
    
    const cellValue = await firstCell.textContent();
    expect(cellValue).not.toBe('');
  });

  test('should navigate to different memory addresses', async ({ page }) => {
    await memoryPage.scrollToAddress(50);
    await TestUtils.waitForCPUOperation(page, 500);
    
    const cell50 = page.locator('[data-testid="memory-cell-50"]');
    await expect(cell50).toBeVisible();
  });

  // test.skip('should edit memory cell with valid opcode', async ({ page }) => {
  //   const testAddress = 10;
  //   const testValue = '1005';
    
  //   await memoryPage.editMemoryCell(testAddress, testValue);
  //   await TestUtils.waitForCPUOperation(page, 200);
    
  //   const updatedValue = await memoryPage.getMemoryValue(testAddress);
  //   expect(updatedValue.trim()).toBe(testValue);
  // });

  // test.skip('should reject invalid memory input', async ({ page }) => {
  //   const testAddress = 15;
  //   const invalidValue = 'INVALID';
    
  //   await memoryPage.editButton(testAddress).click();
  //   await page.fill('[data-testid="cell-input"]', invalidValue);
    
  //   const saveButton = page.locator('[data-testid="save-cell"]');
  //   await expect(saveButton).toBeDisabled();
  // });

  // test.skip('should update memory display during program execution', async ({ page }) => {
  //   const program = '1005\n2006\n3007\n10000';
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   const initialValue = await memoryPage.getMemoryValue(0);
  //   expect(initialValue.trim()).toBe('1005');
    
  //   await TestUtils.startExecution(page);
  //   await TestUtils.waitForCPUOperation(page, 1000);
    
  //   const pcValue = page.locator('[data-testid="program-counter"]');
  //   const pcText = await pcValue.textContent();
  //   expect(parseInt(pcText || '0', 10)).toBeGreaterThan(0);
  // });

  test('should scroll memory grid smoothly', async ({ page }) => {
    await memoryPage.scrollToAddress(100);
    await TestUtils.waitForCPUOperation(page, 300);
    
    const cell100 = page.locator('[data-testid="memory-cell-100"]');
    await expect(cell100).toBeVisible();
    
    await memoryPage.scrollToAddress(0);
    await TestUtils.waitForCPUOperation(page, 300);
    
    const cell0 = page.locator('[data-testid="memory-cell-0"]');
    await expect(cell0).toBeVisible();
  });

  test('should highlight current instruction during execution', async ({ page }) => {
    const program = '1005\n2006\n10000';
    await TestUtils.loadProgram(page, program);
    await TestUtils.waitForCPUOperation(page, 500);
    
    await TestUtils.stepExecution(page);
    await TestUtils.waitForCPUOperation(page, 200);
    
    const currentCell = page.locator('[data-testid="memory-cell-1"]');
    const hasHighlight = await currentCell.evaluate(el => 
      window.getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)'
    );
    expect(hasHighlight).toBeTruthy();
  });

  test('should show address and data bus visualization', async ({ page }) => {
    const addressBus = page.locator('[data-testid="address-bus"]');
    const dataBus = page.locator('[data-testid="data-bus"]');
    
    await expect(addressBus).toBeVisible();
    await expect(dataBus).toBeVisible();
    
    await TestUtils.loadProgram(page, '1005\n10000');
    await TestUtils.startExecution(page);
    await TestUtils.waitForCPUOperation(page, 500);
    
    const addressBusActive = await addressBus.evaluate(el => 
      window.getComputedStyle(el).opacity !== '0.5'
    );
    expect(addressBusActive).toBeTruthy();
  });

  test('should handle memory overflow gracefully', async ({ page }) => {
    const lastAddress = 999;
    await memoryPage.scrollToAddress(lastAddress);
    await TestUtils.waitForCPUOperation(page, 500);
    
    const lastCell = page.locator('[data-testid="memory-cell-999"]');
    await expect(lastCell).toBeVisible();
  });

  // test.skip('should maintain memory state after reset', async ({ page }) => {
  //   const program = '1005\n2006\n3007\n10000';
  //   await TestUtils.loadProgram(page, program);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   const initialMemory = await memoryPage.getMemoryValue(0);
  //   expect(initialMemory.trim()).toBe('1005');
    
  //   await TestUtils.resetCPU(page);
  //   await TestUtils.waitForCPUOperation(page, 500);
    
  //   const resetMemory = await memoryPage.getMemoryValue(0);
  //   expect(resetMemory.trim()).toBe('1005');
  // });
});