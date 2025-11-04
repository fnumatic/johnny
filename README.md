# Johnny2

A CPU simulation project built with React, TypeScript, and modern web technologies.

## Features

- **CPU Simulation**: Interactive CPU simulation with microcode execution
- **Memory Management**: Visual memory interface with real-time updates
- **Control Unit**: Step-by-step execution with control signals
- **Program Loading**: Support for loading programs via multiline string format
- **Test Programs**: Built-in test programs to demonstrate CPU operations

## Program Format

Programs can be loaded using a multiline string format where each line represents a RAM cell:

```
1005
2006
3007
10000
23
3
10
```

### Format Explanation

Each line contains a number in the format `opcode + data`:
- `1005` = opcode 1 (TAKE), data 5
- `2006` = opcode 2 (ADD), data 6  
- `3007` = opcode 3 (SUB), data 7
- `10000` = opcode 10 (HLT), data 0
- `23`, `3`, `10` = data values at addresses 5, 6, 7

### Test Program

The application loads with a default test program that demonstrates basic CPU operations:

1. **TAKE 5** - Load value from address 5 (23) into accumulator
2. **ADD 6** - Add value from address 6 (3) to accumulator  
3. **SUB 7** - Subtract value from address 7 (10) from accumulator
4. **HLT** - Halt the program

Expected execution: `acc = 23 + 3 - 10 = 16`

## Development

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build

### Testing

- `pnpm test` - Run tests once and exit (default behavior)
- `pnpm test:watch` - Run tests in watch mode (for development)
- `pnpm test:ui` - Run tests with Vitest UI

**Note**: The default `test` script runs tests once and exits immediately. Use `test:watch` if you want continuous testing during development.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Dev Mode

Dev Mode is a feature that allows you to debug the CPU simulator. It is enabled by default when the application is loaded.

To enable Dev Mode, you can press Ctrl+Shift+D on your keyboard.

Dev Mode has a few sub-panels that you can use to debug the CPU simulator.

- Test Programs
- Statistics
- Debug Tools
- System Info