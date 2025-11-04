# Johnny2 Project - Agent Guidelines

## Build & Test Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript check + Vite build)
- `pnpm lint` - Run ESLint
- `pnpm test` - Run all unit tests once (not E2E tests)
- `pnpm test:watch` - Run unit tests in watch mode
- `pnpm test:ui` - Run unit tests with Vitest UI
- `pnpm test <filename>` - Run single unit test file (e.g., `pnpm test engine.test.ts`)
- `pnpm test:e2e` - NEVER USE - E2E tests must be run directly from tests/e2e directory

- `cd tests/e2e && npx playwright test <spec-file>` - Run single E2E test spec (e.g., `npx playwright test specs/app.spec.ts`)
- **IMPORTANT**: Always run E2E tests with `cd tests/e2e && npx playwright test` - NEVER use watch mode or pnpm scripts
- `cd tests/e2e && npx playwright test --headed` - Run E2E tests with visible browser
- `cd tests/e2e && npx playwright test --project=chromium` - Run E2E tests on specific browser

## Code Style Guidelines
- Use TypeScript with strict mode enabled
- Import style: Remove unused React imports, use separate lines for named imports
- Path aliases: Use `@/` for src imports (configured in vite.config.ts)
- Component naming: PascalCase for components, camelCase for functions
- State management: Zustand store in `src/store/useStore.ts`
- UI framework: React + Tailwind CSS with shadcn/ui components
- Testing: Vitest + React Testing Library for unit tests, Playwright for E2E tests
- File structure: Components in `src/components/`, utilities in `src/lib/`, types in `src/types/`
- Error handling: Use try-catch blocks, provide meaningful error messages
- Comments: JSDoc format for functions, especially in engine.ts

## E2E Testing Guidelines
- ALWAYS run E2E tests in oneshot mode, NEVER use watch mode - tests will hang indefinitely
- Use `cd tests/e2e && npx playwright test` for direct test execution
- Use `--headed` flag for debugging tests with visible browser
- Use specific test file paths for running individual tests: `npx playwright test specs/app.spec.ts`
- E2E tests require `data-testid` attributes on interactive elements
- Test files are located in `tests/e2e/specs/`
- Page objects are in `tests/e2e/page-objects/`
- Test utilities are in `tests/e2e/helpers/`

## Critical Issues Found
- **Watch Mode Problem**: E2E tests hang indefinitely when run in watch mode due to web server configuration - ALWAYS use oneshot mode
- **Missing testids**: Many components lack proper `data-testid` attributes for E2E testing
- **Button State Issues**: Control tests expect separate start/stop buttons but implementation uses toggle button
- **Memory Display Format**: Tests expect raw numbers but UI shows formatted displays (padded, with microcode)
- **Program Execution**: Many tests expect program execution to change CPU state but it doesn't work
- **Dev Mode Tests**: All dev mode tests now pass after fixing missing testids and removing non-existent functionality

## E2E Test Status Summary
- **Dev Mode Tests**: ✅ ALL PASSING (11/11)
- **App Tests**: ✅ All passing
- **Basic Tests**: ✅ All passing  
- **Controls Tests**: ❌ Multiple failures (button states, execution not working)
- **Execution Tests**: ❌ Multiple failures (program loading, execution not working)
- **Memory Tests**: ❌ Multiple failures (display format, execution issues)