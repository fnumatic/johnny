# Johnny2 E2E Testing Plan with Playwright

## Overview

This document outlines the end-to-end testing strategy for Johnny2 CPU Simulator using Playwright with Chromium-only testing. The plan focuses on comprehensive user journey testing while maintaining a lightweight setup.

## Technology Stack

- **Test Framework**: Playwright
- **Browser**: Chromium (pre-installed)
- **Language**: TypeScript
- **Test Runner**: Playwright Test Runner
- **Reporting**: HTML reports with screenshots

## Project Structure

```
tests/
├── e2e/
│   ├── fixtures/
│   │   ├── programs.ts          # Test CPU programs
│   │   └── test-data.ts        # Test data and constants
│   ├── page-objects/
│   │   ├── app.po.ts           # Main application page
│   │   ├── memory.po.ts         # Memory section page object
│   │   ├── control-unit.po.ts   # Control unit page object
│   │   ├── toolbar.po.ts       # Toolbar page object
│   │   └── dev-mode.po.ts      # Dev mode page object
│   ├── helpers/
│   │   ├── test-utils.ts       # Common test utilities
│   │   └── assertions.ts      # Custom assertions
│   └── specs/
│       ├── app.spec.ts          # Application initialization
│       ├── memory.spec.ts       # Memory management tests
│       ├── execution.spec.ts    # Program execution tests
│       ├── controls.spec.ts      # Control interface tests
│       └── dev-mode.spec.ts    # Dev mode functionality
├── playwright.config.ts         # Playwright configuration
└── package.json               # Updated with E2E scripts
```

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm add -D @playwright/test playwright
```

### 2. Configure Playwright

Create `tests/e2e/playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. Update Package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:codegen": "playwright codegen http://localhost:5173"
  }
}
```

## Test Scenarios

### 1. Application Initialization Tests (`app.spec.ts`)

**Objective**: Verify proper application startup and initial state

**Test Cases**:
- Splash screen displays for 1.5 seconds
- Main interface loads after splash screen
- All CPU components render (Memory, Control Unit, ALU, Address Bus, Data Bus)
- Default test program loads automatically
- CPU state initializes correctly (PC=0, ACC=0, etc.)
- Keyboard shortcut Ctrl+Shift+D toggles dev mode

### 2. Memory Management Tests (`memory.spec.ts`)

**Objective**: Verify memory operations and display

**Test Cases**:
- Memory grid displays correct number of cells (1000)
- Memory cells show correct initial values
- Navigate to different memory addresses
- Edit memory cells with valid opcodes
- Memory updates reflect during program execution
- Address/Data bus visualization updates correctly
- Memory scroll functionality works
- Format validation for memory input

### 3. Program Execution Tests (`execution.spec.ts`)

**Objective**: Verify program loading and execution

**Test Cases**:
- Load multiline program format
- Load semicolon-separated format
- Invalid program format rejection
- Step-by-step execution
- Continuous run mode
- Pause/resume functionality
- Speed control (1x to 10x)
- Reset CPU state
- Halt instruction processing
- Program counter updates correctly

### 4. Control Interface Tests (`controls.spec.ts`)

**Objective**: Verify control buttons and displays

**Test Cases**:
- Start button initiates execution
- Stop button halts execution
- Reset button clears CPU state
- Speed slider adjusts execution speed
- Program counter display updates
- Accumulator display shows correct value
- Instruction register displays current instruction
- Control buttons enable/disable appropriately

### 5. Dev Mode Tests (`dev-mode.spec.ts`)

**Objective**: Verify development mode features

**Test Cases**:
- Dev mode toggle functionality
- Statistics tab displays execution metrics
- System information shows correct details
- Test programs tab loads built-in programs
- Custom program input works
- Execution trace displays correctly
- Microcode visualization updates

## Page Objects Implementation

### App Page Object (`app.po.ts`)

```typescript
import { Page, Locator } from '@playwright/test';

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
    await this.splashScreen().waitFor({ state: 'hidden' });
    await this.mainInterface().waitFor({ state: 'visible' });
  }

  async toggleDevMode() {
    await this.page.keyboard.press('Control+Shift+D');
  }
}
```

### Memory Page Object (`memory.po.ts`)

```typescript
import { Page, Locator } from '@playwright/test';

export class MemoryPage {
  constructor(private page: Page) {}

  get memoryGrid() {
    return this.page.locator('[data-testid="memory-grid"]');
  }

  get memoryCell(address: number) {
    return this.page.locator(`[data-testid="memory-cell-${address}"]`);
  }

  get editButton(address: number) {
    return this.page.locator(`[data-testid="edit-cell-${address}"]`);
  }

  async editMemoryCell(address: number, value: string) {
    await this.editButton(address).click();
    await this.page.fill('[data-testid="cell-input"]', value);
    await this.page.click('[data-testid="save-cell"]');
  }

  async getMemoryValue(address: number): Promise<string> {
    return await this.memoryCell(address).textContent() || '';
  }
}
```

## Test Data Fixtures

### Test Programs (`fixtures/programs.ts`)

```typescript
export const TEST_PROGRAMS = {
  simple: {
    name: 'Simple Addition',
    program: `1005
2006
3007
10000`,
    description: 'TAKE 5, ADD 6, SUB 7, HALT',
    expected: { accumulator: 16 }
  },
  
  complex: {
    name: 'Complex Loop',
    program: `1000
2001
3002
4001
5003
10000`,
    description: 'Loop program with conditional jump',
    expected: { accumulator: 0, iterations: 3 }
  },

  invalid: {
    name: 'Invalid Format',
    program: `invalid
abc123
1005`,
    description: 'Should be rejected',
    expected: { error: true }
  }
};
```

## Custom Assertions

### CPU State Assertions (`helpers/assertions.ts`)

```typescript
import { expect } from '@playwright/test';

export class CPUAssertions {
  static async expectCPUState(page: Page, expectedState: {
    accumulator?: number;
    programCounter?: number;
    instructionRegister?: number;
  }) {
    if (expectedState.accumulator !== undefined) {
      const accValue = await page.locator('[data-testid="accumulator"]').textContent();
      expect(parseInt(accValue || '0')).toBe(expectedState.accumulator);
    }
    
    if (expectedState.programCounter !== undefined) {
      const pcValue = await page.locator('[data-testid="program-counter"]').textContent();
      expect(parseInt(pcValue || '0')).toBe(expectedState.programCounter);
    }
  }
}
```

## Execution Strategy

### Local Development
```bash
# Run all E2E tests
pnpm test:e2e

# Run with UI for debugging
pnpm test:e2e:ui

# Debug specific test
pnpm test:e2e:debug --grep "Program Loading"
```

### CI/CD Pipeline
```bash
# Run in headless mode for CI
CI=true pnpm test:e2e

# Generate HTML report
pnpm test:e2e --reporter=html
```

## Best Practices

### 1. Test Organization
- Use descriptive test names
- Group related tests with `describe`
- Use `beforeEach`/`afterEach` for cleanup
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Selectors
- Prefer `data-testid` attributes over CSS selectors
- Use semantic selectors when appropriate
- Avoid brittle selectors dependent on DOM structure

### 3. Waits and Timeouts
- Use Playwright's auto-waiting features
- Set appropriate timeouts for CPU operations
- Avoid fixed `sleep()` calls

### 4. Error Handling
- Test error scenarios and edge cases
- Verify error messages are user-friendly
- Test recovery from error states

### 5. Performance
- Monitor test execution time
- Use parallel execution where possible
- Optimize test data size

## Maintenance

### Regular Updates
- Update test data when CPU instruction set changes
- Add new test cases for new features
- Review and update flaky tests
- Maintain page objects with UI changes

### Test Coverage Goals
- **User Workflows**: 100% coverage of main user paths
- **UI Components**: 90% coverage of interactive elements
- **Error Scenarios**: 80% coverage of error conditions
- **Cross-browser**: Chromium compatibility (primary target)

## Success Metrics

### Pass Criteria
- All critical user journeys pass
- No flaky tests in CI
- Test execution time < 5 minutes
- 95%+ test coverage of user-facing features

### Quality Gates
- No failing tests in main branch
- Performance regression tests pass
- Accessibility tests meet WCAG 2.1 AA standards
- Visual regression tests pass

## Implementation Timeline

### Phase 1: Foundation (Week 1)
- Set up Playwright configuration
- Create basic page objects
- Implement app initialization tests

### Phase 2: Core Features (Week 2)
- Memory management tests
- Program execution tests
- Control interface tests

### Phase 3: Advanced Features (Week 3)
- Dev mode functionality tests
- Error handling and edge cases
- Performance and visual tests

### Phase 4: Integration (Week 4)
- CI/CD pipeline setup
- Test reporting and documentation
- Test maintenance procedures

This plan provides a comprehensive E2E testing strategy for Johnny2 using Playwright with Chromium, ensuring reliable testing of the CPU simulator's core functionality while maintaining a lightweight, efficient setup.