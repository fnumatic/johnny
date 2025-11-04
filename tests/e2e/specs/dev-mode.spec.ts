import { test, expect } from '@playwright/test';
import { AppPage } from '../page-objects/app.po';
import { DevModePage } from '../page-objects/dev-mode.po';
import { ControlUnitPage } from '../page-objects/control-unit.po';
import { TestUtils } from '../helpers/test-utils';

test.describe('Dev Mode Functionality', () => {
  let appPage: AppPage;
  let devModePage: DevModePage;
  let controlUnitPage: ControlUnitPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    devModePage = new DevModePage(page);
    controlUnitPage = new ControlUnitPage(page);
    await appPage.navigate();
    await appPage.waitForAppLoad();
    await appPage.toggleDevMode();
    await TestUtils.waitForCPUOperation(page, 500);
  });

  test('should show dev mode panel when toggled', async () => {
    const isVisible = await devModePage.isDevModePanelVisible();
    expect(isVisible).toBeTruthy();
  });

  test('should display test programs tab by default', async () => {
    await expect(devModePage.testProgramsTab).toBeVisible();
    await expect(devModePage.loadTestProgramButton).toBeVisible();
  });

  test('should switch between tabs correctly', async () => {
    await devModePage.selectTab('system-info');
    await expect(devModePage.systemInfoTab).toBeVisible();
    
    await devModePage.selectTab('statistics');
    await expect(devModePage.statisticsTab).toBeVisible();
    
    await devModePage.selectTab('debug-tools');
    await expect(devModePage.debugToolsTab).toBeVisible();
  });

  test('should display statistics in statistics tab', async () => {
    await devModePage.selectTab('statistics');
    
    await expect(devModePage.executionCount).toBeVisible();
    await expect(devModePage.cyclesCount).toBeVisible();
    await expect(devModePage.errorsCount).toBeVisible();
    
    const initialCount = await devModePage.getExecutionCount();
    expect(initialCount).toBe(0);
  });

  test('should display system information', async () => {
    await devModePage.selectTab('system-info');
    
    const systemInfo = devModePage.page.locator('[data-testid="system-info-content"]');
    await expect(systemInfo).toBeVisible();
    
    const infoText = await systemInfo.textContent();
    expect(infoText).toContain('Johnny');
  });

  test('should load test programs from buttons', async () => {
    await devModePage.selectTab('test-programs');
    
    await expect(devModePage.loadTestProgramButton).toBeVisible();
    
    await devModePage.loadTestProgram();
    
    await TestUtils.waitForCPUOperation(devModePage.page, 500);
    
    const pc = await controlUnitPage.getProgramCounterValue();
    expect(pc).toBe(0);
  });

  test('should update execution statistics during program run', async () => {
    await devModePage.selectTab('statistics');
    
    const initialCount = await devModePage.getExecutionCount();
    expect(initialCount).toBe(0);
    
    await controlUnitPage.start();
    await TestUtils.waitForCPUOperation(devModePage.page, 1000);
    await controlUnitPage.stop();
    
    const finalCount = await devModePage.getExecutionCount();
    expect(finalCount).toBeGreaterThan(initialCount);
  });

  test('should update cycles counter during execution', async () => {
    await devModePage.selectTab('statistics');
    
    const initialCycles = await devModePage.getCyclesCount();
    expect(initialCycles).toBe(0);
    
    await devModePage.page.click('[data-testid="step-button"]');
    await TestUtils.waitForCPUOperation(devModePage.page, 200);
    
    const updatedCycles = await devModePage.getCyclesCount();
    expect(updatedCycles).toBeGreaterThan(0);
  });

  test('should display debug tools content', async () => {
    await devModePage.selectTab('debug-tools');
    
    // Check for execution trace section (target the card title specifically)
    const executionTrace = devModePage.page.locator('[data-testid="dev-mode"] .text-white:has-text("Execution Trace")');
    await expect(executionTrace).toBeVisible();
    
    // Check for breakpoints section
    const breakpoints = devModePage.page.locator('[data-testid="dev-mode"] .text-white:has-text("Breakpoints")');
    await expect(breakpoints).toBeVisible();
    
    // Check for memory watches section
    const memoryWatches = devModePage.page.locator('[data-testid="dev-mode"] .text-white:has-text("Memory Watches")');
    await expect(memoryWatches).toBeVisible();
    
    // Check for register dump section
    const registerDump = devModePage.page.locator('[data-testid="dev-mode"] .text-white:has-text("Register Dump")');
    await expect(registerDump).toBeVisible();
  });

  test('should hide dev mode when toggled off', async () => {
    const isVisible = await devModePage.isDevModePanelVisible();
    expect(isVisible).toBeTruthy();
    
    await appPage.toggleDevMode();
    await TestUtils.waitForCPUOperation(devModePage.page, 500);
    
    const isHidden = await devModePage.isDevModePanelVisible();
    expect(isHidden).toBeFalsy();
  });

  test('should reset dev mode state during page navigation', async () => {
    const isVisible = await devModePage.isDevModePanelVisible();
    expect(isVisible).toBeTruthy();
    
    await devModePage.page.reload();
    await appPage.waitForAppLoad();
    await TestUtils.waitForCPUOperation(devModePage.page, 500);
    
    const isHidden = await devModePage.isDevModePanelVisible();
    expect(isHidden).toBeFalsy();
  });
});