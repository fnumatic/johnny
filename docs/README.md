# Johnny2 CPU Simulator - Documentation

Welcome to the Johnny2 CPU Simulator documentation. This comprehensive guide will help you understand, use, and contribute to the project.

## 📚 Documentation Index

### Core Documents
- **[Product Requirements Document (PRD)](PRD.md)** - Complete product specification and requirements
- **[API Reference](API-Reference.md)** - Technical API documentation for developers
- **[User Guide](User-Guide.md)** - End-user documentation and tutorials

### Quick Links
- [Getting Started](#getting-started)
- [Architecture Overview](#architecture-overview)
- [Development Guide](#development-guide)
- [Contributing](#contributing)

## 🚀 Getting Started

### For Users
1. **Read the [User Guide](User-Guide.md)** - Learn how to use the simulator
2. **Try the Examples** - Follow step-by-step tutorials
3. **Experiment** - Create your own programs

### For Developers
1. **Review the [PRD](PRD.md)** - Understand product requirements
2. **Study the [API Reference](API-Reference.md)** - Learn the technical architecture
3. **Set up Development Environment** - Follow the development guide below

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 19.1.0 with TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4.1.11 with Shadcn UI
- **Build Tool**: Vite 7.0.5
- **Testing**: Vitest with React Testing Library
- **Package Manager**: pnpm

### Core Components
```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── MainInterface.tsx # Primary interface
│   └── sections/       # CPU component sections
├── store/              # State management
│   └── useStore.ts     # Zustand store
├── lib/                # Core logic
│   └── engine.ts       # CPU simulation engine
└── types/              # TypeScript definitions
```

### Key Features
- **1000 RAM Cells**: Visual memory grid
- **Real-time Execution**: Step-by-step or continuous
- **Multiple Microcode Sets**: Normal and Bonsai modes
- **Interactive UI**: Direct memory editing
- **Educational Focus**: Designed for learning

## 🛠️ Development Guide

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Modern browser for testing

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd johnny2

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Development Workflow
1. **Feature Development**
   - Create feature branch
   - Implement changes
   - Add tests
   - Update documentation

2. **Code Quality**
   - Run linter: `pnpm lint`
   - Run tests: `pnpm test`
   - Check types: `pnpm type-check`

3. **Documentation**
   - Update relevant docs
   - Add JSDoc comments
   - Update examples if needed

### Testing Strategy
- **Unit Tests**: Component and function testing
- **Integration Tests**: CPU simulation logic
- **E2E Tests**: User workflow testing
- **Performance Tests**: Memory and execution speed

## 📋 Project Status

### Current Phase: Phase 1 - Core CPU Simulation ✅
- ✅ Basic CPU components (Memory, Control, ALU)
- ✅ Execution engine with microcode support
- ✅ Real-time state visualization
- ✅ Basic UI with responsive design

### Next Phase: Phase 2 - Enhanced Interactivity 🔄
- 🔄 Direct memory cell editing
- 🔄 Excel-style row manipulation
- 🔄 Auto-formatting for data input
- 🔄 Enhanced visual feedback

### Future Phases
- 📋 Phase 3: Advanced Features (Program examples, Save/load)
- 📋 Phase 4: Educational Features (Tutorials, Assessments)

## 🎯 Key Metrics

### Performance Targets
- **Load Time**: < 2 seconds on 3G
- **Response Time**: < 100ms for user interactions
- **Frame Rate**: 60 FPS for animations
- **Memory Usage**: Efficient handling of 1000+ cells

### Quality Standards
- **Test Coverage**: > 80%
- **TypeScript**: Strict mode enabled
- **Accessibility**: WCAG 2.1 AA compliance
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+


---

**Document Version**: 1.0  
**Last Updated**: 2024-12-19  
**Next Review**: 2025-01-19

For the latest updates, check the [GitHub repository](https://github.com/your-username/johnny2). 