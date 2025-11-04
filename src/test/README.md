# Testing Setup

This project uses Vitest for testing with the following configuration:

## Setup

- **Vitest**: Next-generation testing framework powered by Vite
- **jsdom**: DOM environment for testing React components
- **@testing-library/react**: React testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: User event simulation

## Available Scripts

- `pnpm test`: Run tests in watch mode
- `pnpm test:run`: Run tests once
- `pnpm test:ui`: Run tests with Vitest UI (requires @vitest/ui)

## Test Structure

```
src/test/
├── setup.ts              # Global test setup
├── example.test.ts       # Basic test examples
└── components/           # Component tests
    └── App.test.tsx     # App component tests
```

## Writing Tests

### Basic Test
```typescript
import { describe, it, expect } from 'vitest'

describe('Test Suite', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2)
  })
})
```

### React Component Test
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Configuration

The test configuration is in `vite.config.ts`:

```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
}
```

## Notes

- ResizeObserver is mocked for jsdom compatibility
- @testing-library/jest-dom matchers are available globally
- Tests automatically clean up after each test case 