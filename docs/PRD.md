# Johnny2 CPU Simulator - Product Requirements Document (PRD)

## 1. Executive Summary

### 1.1 Product Overview
Johnny2 is an interactive, educational CPU simulator designed to teach computer architecture concepts through hands-on experience. The application provides a visual representation of a simplified CPU with memory, control unit, and arithmetic logic unit (ALU) components, allowing users to understand how instructions are fetched, decoded, and executed.

### 1.2 Target Audience
- **Primary**: Computer science students learning computer architecture
- **Secondary**: Educators teaching CPU concepts
- **Tertiary**: Programming enthusiasts interested in low-level computing

### 1.3 Value Proposition
- **Educational**: Provides hands-on learning experience for CPU concepts
- **Visual**: Real-time visualization of CPU state and data flow
- **Interactive**: Step-by-step execution with control over execution speed
- **Modern**: Built with React/TypeScript for a responsive, modern interface

## 2. Product Vision

### 2.1 Mission Statement
To create an accessible, interactive CPU simulator that demystifies computer architecture concepts through visual learning and hands-on experimentation.

### 2.2 Success Metrics
- **User Engagement**: Time spent interacting with the simulator
- **Learning Outcomes**: Understanding of CPU concepts demonstrated through usage
- **Accessibility**: Ease of use for students with varying technical backgrounds
- **Performance**: Smooth, responsive interface across different devices

## 3. Product Requirements

### 3.1 Core Features

#### 3.1.1 CPU Components
- **Memory Section**: 1000 RAM cells with visual representation
- **Control Unit**: Program counter, instruction register, microcode execution
- **ALU**: Accumulator with arithmetic operations
- **Data Buses**: Address bus and data bus with real-time values

#### 3.1.2 Execution Modes
- **Step-by-Step**: Execute one instruction at a time
- **Continuous**: Run at configurable speed (1x to 10x)
- **Pause/Resume**: Control execution flow
- **Reset**: Return to initial state

#### 3.1.3 Memory Management
- **Direct Editing**: Click-to-edit memory cells
- **Visual Feedback**: Highlighted active memory locations
- **Data Format**: 5-digit format (2-digit opcode + 3-digit data)
- **Auto-formatting**: Automatic comma insertion after 2 digits

#### 3.1.4 Instruction Set Architecture
- **Two Instruction Sets**: Normal mode (11 instructions) and Bonsai mode (6 instructions)
- **String-based Microcode**: Instructions and microcode defined via semicolon-separated strings
- **Microcode Structure**: Each macrocode has 10 microcodes, followed by instruction names
- **Dynamic Parsing**: Microcode strings are parsed at runtime to configure CPU behavior
- **Instruction Visualization**: Real-time display of current instruction and microcode state

#### 3.1.5 Microcode System
- **Normal Mode Instructions**: TAKE, ADD, SUB, SAVE, JMP, TST, INC, DEC, NULL, HLT (FETCH is internal)
- **Bonsai Mode Instructions**: INC, DEC, JMP, TST, HLT (FETCH is internal)
- **Internal FETCH**: Used internally for instruction fetching, not exposed in UI
- **UI Opcode Tables**: Start with user-facing instructions (TAKE/INC), not internal FETCH
- **ISA-Microcode Relationship**: Each ISA macro instruction can have up to 10 microcode instructions
- **Microcode Decoding**: Each microcode instruction is decoded as a number, where 0 means no microcode instruction
- **Microcode Parsing**: Automatic parsing of microcode strings with instruction count detection
- **Opcode Mapping**: Dynamic generation of opcode-to-instruction mappings

### 3.2 User Interface Requirements

#### 3.2.1 Layout
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Grid Layout**: 12-column grid for component organization
- **Color Coding**: 
  - Blue: Address bus
  - Green: Data bus
  - Gray: Background
  - White: Text and highlights

#### 3.2.2 Navigation
- **Start Screen**: 1.5-second splash screen
- **Main Interface**: Three-panel layout (Memory, Control, ALU)
- **Toolbar**: Execution controls and settings

#### 3.2.3 Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **High Contrast**: Clear visual hierarchy
- **Responsive**: Works on tablets and mobile devices

### 3.3 Technical Requirements

#### 3.3.1 Performance
- **60 FPS**: Smooth animations and transitions
- **< 100ms**: Response time for user interactions
- **Memory Efficient**: Optimized for large memory arrays
- **Progressive Loading**: Lazy loading of components

#### 3.3.2 Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Web App**: Offline capability and app-like experience

#### 3.3.3 Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Testing**: Unit tests with Vitest
- **Documentation**: JSDoc comments for all functions

## 4. Functional Requirements

### 4.1 Memory Operations
```
REQ-001: Users can view all 1000 RAM cells in a scrollable grid
REQ-002: Users can click to edit any memory cell directly
REQ-003: Memory cells display in 5-digit format (XX,XXX)
REQ-004: Active memory locations are highlighted during execution
REQ-005: Memory changes are reflected in real-time
```

### 4.2 Execution Control
```
REQ-006: Users can start/stop execution with a single button
REQ-007: Users can pause/resume execution at any time
REQ-008: Users can control execution speed (1x to 10x)
REQ-009: Users can step through execution one instruction at a time
REQ-010: Users can reset the CPU to initial state
```

### 4.3 Data Visualization
```
REQ-011: Address bus displays current memory address
REQ-012: Data bus displays current data value
REQ-013: Accumulator shows current ALU value
REQ-014: Program counter shows current instruction address
REQ-015: Instruction register shows current opcode and operand
```

### 4.4 Instruction Set Architecture
```
REQ-016: Support for two instruction sets (Normal and Bonsai modes)
REQ-017: Parse microcode strings with semicolon-separated values
REQ-018: Auto-detect instruction count from microcode string endings
REQ-019: Generate dynamic opcode-to-instruction mappings
REQ-020: Support Normal mode instructions: TAKE, ADD, SUB, SAVE, JMP, TST, INC, DEC, NULL, HLT (FETCH internal)
REQ-021: Support Bonsai mode instructions: INC, DEC, JMP, TST, HLT (FETCH internal)
REQ-022: Execute up to 10 microcode instructions per ISA macro instruction, where number 0 means no microcode instruction
REQ-023: Display current microcode state and instruction being executed
REQ-024: Allow runtime switching between instruction sets
REQ-025: Hide internal FETCH macrocode from UI opcode tables
REQ-026: Start UI opcode tables with user-facing instructions (TAKE for Normal, INC for Bonsai)
```

## 5. Non-Functional Requirements

### 5.1 Performance
```
NFR-001: Application loads in < 2 seconds on 3G connection
NFR-002: UI responds to user input in < 100ms
NFR-003: Memory updates render in < 16ms (60 FPS)
NFR-004: Application works smoothly with 1000+ memory cells
```

### 5.2 Security
```
NFR-005: No sensitive data is stored or transmitted
NFR-006: All user inputs are validated and sanitized
NFR-007: No external API calls or data transmission
```

### 5.3 Usability
```
NFR-008: New users can start using the simulator within 5 minutes
NFR-009: All controls are discoverable without documentation
NFR-010: Error states are clearly communicated to users
NFR-011: Application works without internet connection
```

### 5.4 Accessibility
```
NFR-012: WCAG 2.1 AA compliance
NFR-013: Full keyboard navigation support
NFR-014: Screen reader compatibility
NFR-015: High contrast mode support
```

## 6. User Stories

### 6.1 Student User Stories
```
As a computer science student,
I want to see how a CPU executes instructions step-by-step,
So that I can understand computer architecture concepts.

As a student,
I want to edit memory values directly,
So that I can experiment with different programs.

As a student,
I want to control the execution speed,
So that I can observe fast or slow execution as needed.
```

### 6.2 Educator User Stories
```
As an educator,
I want to demonstrate CPU concepts visually,
So that I can teach complex topics more effectively.

As an educator,
I want to pause execution at specific points,
So that I can explain what's happening at each step.

As an educator,
I want to reset the simulation quickly,
So that I can start fresh demonstrations.
```

## 7. Technical Architecture

### 7.1 Technology Stack
- **Frontend**: React 19.1.0 with TypeScript
- **State Management**: Zustand for global state
- **Styling**: Tailwind CSS 4.1.11 with Shadcn UI
- **Build Tool**: Vite 7.0.5
- **Testing**: Vitest with React Testing Library
- **Package Manager**: pnpm

### 7.2 Component Architecture
```
src/
├── components/
│   ├── Layout.tsx              # Main layout wrapper
│   ├── MainInterface.tsx       # Primary interface
│   ├── StartScreen.tsx         # Splash screen
│   ├── Toolbar.tsx            # Control buttons
│   └── sections/
│       ├── MemorySection.tsx   # RAM display
│       ├── ControlUnit.tsx     # CPU control logic
│       └── ALU.tsx            # Arithmetic operations
├── store/
│   └── useStore.ts            # Global state management
├── lib/
│   └── engine.ts              # CPU simulation logic with microcode parsing
└── types/
    └── index.ts               # TypeScript definitions
```

### 7.3 Microcode Architecture
```
Microcode Strings:
├── Normal Mode: "8;2;3;5;...;FETCH;TAKE;ADD;SUB;SAVE;JMP;TST;INC;DEC;NULL;HLT"
├── Bonsai Mode: "8;2;3;5;...;FETCH;INC;DEC;JMP;TST;HLT"
└── Parsing: Split by semicolon, extract instructions and operations

Instruction Sets:
├── Normal Mode (10 user instructions): TAKE, ADD, SUB, SAVE, JMP, TST, INC, DEC, NULL, HLT
├── Bonsai Mode (5 user instructions): INC, DEC, JMP, TST, HLT
└── Internal FETCH: Used for instruction fetching, not exposed in UI
```

### 7.4 Data Flow
1. **User Input** → **Store Actions** → **State Updates** → **UI Re-render**
2. **Execution Engine** → **CPU State Changes** → **Bus Updates** → **Visual Feedback**
3. **Memory Edits** → **RAM Updates** → **Validation** → **State Sync**
4. **Microcode Parsing** → **Instruction Mapping** → **Execution Configuration** → **CPU Behavior**

## 8. Implementation Phases

### 8.1 Phase 1: Core CPU Simulation (Current)
- ✅ Basic CPU components (Memory, Control, ALU)
- ✅ Execution engine with microcode support
- ✅ String-based microcode parsing system
- ✅ Two instruction sets (Normal and Bonsai modes)
- ✅ Dynamic opcode mapping generation
- ✅ Real-time state visualization
- ✅ Basic UI with responsive design

### 8.2 Phase 2: Enhanced Interactivity
- 🔄 Direct memory cell editing
- 🔄 Excel-style row manipulation
- 🔄 Auto-formatting for data input
- 🔄 Enhanced visual feedback

### 8.3 Phase 3: Advanced Features
- 📋 Program examples and tutorials
- 📋 Save/load program functionality
- 📋 Custom microcode string input
- 📋 Performance optimizations
- 📋 Microcode visualization and debugging

### 8.4 Phase 4: Educational Features
- 📋 Interactive tutorials
- 📋 Concept explanations
- 📋 Quiz/assessment mode
- 📋 Export capabilities

## 9. Success Criteria

### 9.1 Technical Success
- [ ] All functional requirements implemented
- [ ] Performance targets met
- [ ] Accessibility standards achieved
- [ ] Test coverage > 80%

### 9.2 User Success
- [ ] Users can complete basic CPU operations
- [ ] Interface is intuitive for target audience
- [ ] Educational value demonstrated
- [ ] Positive user feedback

### 9.3 Business Success
- [ ] Open source adoption
- [ ] Educational institution usage
- [ ] Community contributions
- [ ] Documentation completeness

## 10. Risk Assessment

### 10.1 Technical Risks
- **Performance**: Large memory arrays may cause lag
- **Browser Compatibility**: Modern features may not work in older browsers
- **State Management**: Complex state may become difficult to maintain

### 10.2 Mitigation Strategies
- **Performance**: Implement virtualization for memory display
- **Compatibility**: Use progressive enhancement and polyfills
- **State**: Maintain clear separation of concerns and documentation

## 11. Future Enhancements

### 11.1 Planned Features
- **Multiple CPU Architectures**: Support for different instruction sets
- **Visual Programming**: Drag-and-drop instruction creation
- **Network Simulation**: Multi-CPU communication
- **Mobile App**: Native mobile application

### 11.2 Research Areas
- **AI Integration**: Intelligent program suggestions
- **VR/AR**: Immersive CPU visualization
- **Collaboration**: Multi-user simulation sessions
- **Analytics**: Learning progress tracking

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-19  
**Next Review**: 2025-01-19 