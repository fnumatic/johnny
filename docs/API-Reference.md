# Johnny2 CPU Simulator - API Reference

## Table of Contents
1. [Store API](#store-api)
2. [Engine API](#engine-api)
3. [Component API](#component-api)
4. [Types](#types)
5. [Constants](#constants)

## Store API

### useStore Hook

The main state management hook using Zustand.

```typescript
const {
  // State
  ram,
  addressBus,
  dataBus,
  accumulator,
  isRunning,
  isPaused,
  executionSpeed,
  selectedMemoryRow,
  showEditor,
  controlUnitState,
  clockCycle,
  programCounter,
  instructionRegister,
  microcode,
  
  // Actions
  setAddressBus,
  setDataBus,
  setAccumulator,
  toggleRunning,
  togglePause,
  setExecutionSpeed,
  setSelectedMemoryRow,
  toggleEditor,
  incrementAccumulator,
  decrementAccumulator,
  resetAccumulator,
  transferToAccumulator,
  transferFromAccumulator,
  addToAccumulator,
  subtractFromAccumulator,
  setControlUnitState,
  setControlSignals,
  incrementClockCycle,
  resetClockCycle,
  setProgramCounter,
  setInstructionRegister,
  incrementProgramCounter,
  updateRamRow,
} = useStore();
```

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `ram` | `Array<number>` | 1000-element array representing RAM |
| `addressBus` | `string` | Current address bus value (3 digits) |
| `dataBus` | `string` | Current data bus value (5 digits) |
| `accumulator` | `string` | Current accumulator value (5 digits) |
| `isRunning` | `boolean` | Whether CPU is executing |
| `isPaused` | `boolean` | Whether execution is paused |
| `executionSpeed` | `number` | Execution speed multiplier (1-10) |
| `selectedMemoryRow` | `number` | Currently selected memory row (-1 if none) |
| `showEditor` | `boolean` | Whether code editor is visible |
| `controlUnitState` | `'FETCH' \| 'DECODE' \| 'EXECUTE' \| 'STORE'` | Current control unit state |
| `clockCycle` | `number` | Current clock cycle count |
| `programCounter` | `string` | Program counter value (5 digits) |
| `instructionRegister` | `{opcode: string, operand: string}` | Current instruction |
| `microcode` | `Array<{address: string, instruction: string, description: string}>` | Microcode array |

### Actions

#### Memory Operations
```typescript
updateRamRow(index: number, value: number): void
```
Updates a specific RAM cell with a new value.

#### Bus Operations
```typescript
setAddressBus(value: string): void
setDataBus(value: string): void
```
Set address and data bus values.

#### Accumulator Operations
```typescript
setAccumulator(value: string): void
incrementAccumulator(): void
decrementAccumulator(): void
resetAccumulator(): void
transferToAccumulator(): void
transferFromAccumulator(): void
addToAccumulator(): void
subtractFromAccumulator(): void
```
Perform arithmetic and transfer operations on the accumulator.

#### Execution Control
```typescript
toggleRunning(): void
togglePause(): void
setExecutionSpeed(speed: number): void
```
Control CPU execution state and speed.

#### Control Unit Operations
```typescript
setControlUnitState(state: 'FETCH' | 'DECODE' | 'EXECUTE' | 'STORE'): void
setControlSignals(signals: string[]): void
incrementClockCycle(): void
resetClockCycle(): void
```
Manage control unit state and timing.

#### Program Counter Operations
```typescript
setProgramCounter(value: string): void
incrementProgramCounter(): void
setInstructionRegister(opcode: string, operand: string): void
```
Manage program flow and instruction decoding.

## Engine API

### Constants

```typescript
RAM_SIZE = 1000
RAM_CELL_OPCODE_DIGITS = 2
RAM_CELL_DATA_DIGITS = 3
RAM_CELL_TOTAL_DIGITS = 5
```

### Memory Cell Functions

```typescript
getOpcodeFromCell(cell: number): number
getDataFromCell(cell: number): number
createRamCell(opcode: number, data: number): number
```

Extract or create RAM cell components.

### Microcode Functions

```typescript
parseMicrocode(mcString: string, opcodeCount?: number): {
  instructions: number[],
  operations: string[]
}
generateOpcodeMapping(operations: string[]): { [key: string]: string }
```

Parse and manage microcode instructions from semicolon-separated strings.

### Microcode Strings

```typescript
bonsaiMC: string  // Bonsai mode microcode string (6 instructions)
normalMC: string  // Normal mode microcode string (11 instructions)
```

Each microcode string contains:
- **Instructions**: Numeric microcode values separated by semicolons
- **Operations**: Instruction names at the end (FETCH, TAKE, ADD, etc.)
- **ISA-Microcode Relationship**: Each ISA macro instruction can have up to 10 microcode instructions
- **Microcode Decoding**: Each microcode instruction is decoded as a number, where 0 means no microcode instruction

### CPU State Type

```typescript
type CPUState = {
  ram: number[],
  acc: number,
  pc: number,
  ir: number,
  db: number,
  ab: number,
  mcCounter: number,
  halted: boolean,
  microCode: number[],
};
```

### Execution Functions

```typescript
executeMicroStep(state: CPUState): CPUState
executeMacroStep(state: CPUState): CPUState
```

Execute single microstep or complete macrostep.

### Predefined Microcode

```typescript
bonsaiMC: string
normalMC: string
bonsaiMicrocode: {instructions: number[], operations: string[]}
normalMicrocode: {instructions: number[], operations: string[]}
```

## Component API

### Layout Component

```typescript
interface LayoutProps {
  // No props required
}

const Layout: React.FC<LayoutProps>
```

Main layout wrapper that manages start screen and main interface.

### MainInterface Component

```typescript
interface MainInterfaceProps {
  // No props required
}

const MainInterface: React.FC<MainInterfaceProps>
```

Primary interface containing CPU components and buses.

### MemorySection Component

```typescript
interface MemorySectionProps {
  // No props required
}

const MemorySection: React.FC<MemorySectionProps>
```

Displays and manages RAM memory grid.

### ControlUnit Component

```typescript
interface ControlUnitProps {
  // No props required
}

const ControlUnit: React.FC<ControlUnitProps>
```

Manages CPU control logic and microcode execution.

### ALU Component

```typescript
interface ALUProps {
  // No props required
}

const ALU: React.FC<ALUProps>
```

Handles arithmetic logic unit operations and accumulator.

### Toolbar Component

```typescript
interface ToolbarProps {
  // No props required
}

const Toolbar: React.FC<ToolbarProps>
```

Provides execution controls and settings.

## Types

### Core Types

```typescript
interface Store {
  ramHighlight: number;
  ramSelected: number;
  ram: number[];
  microCode: string[];
  mcHighlight: number;
  mcOpHighlight: boolean[];
  addressBus: number;
  dataBus: number;
  AddressBusInput: string;
  DataBusInput: string;
  ramInput: string;
  accumulator: number;
  executionSpeed: number;
  showDetailControl: boolean;
  showModal: boolean;
  mcCounter: number;
  instructionRegister: number;
  programmCounter: number;
  showStartScreen: boolean;
  commandSelection: number;
  recordNum: number;
  pause: boolean;
  halt: boolean;
  recording: boolean;
  recordingCounter: number;
  turboMode: boolean;
  bonsaiMode: boolean;
  showEditor: boolean;
  editorContent: string;
  loadMsg: string;
  setShowStartScreen: (value: boolean) => void;
}
```

### Instruction Types

```typescript
interface InstructionRegister {
  opcode: string;
  operand: string;
}

interface MicrocodeEntry {
  address: string;
  instruction: string;
  description: string;
}
```

## Constants

### RAM Configuration
```typescript
RAM_SIZE = 1000                    // Total RAM cells
RAM_CELL_OPCODE_DIGITS = 2         // Opcode digits per cell
RAM_CELL_DATA_DIGITS = 3           // Data digits per cell
RAM_CELL_TOTAL_DIGITS = 5          // Total digits per cell
```

### Execution Speeds
```typescript
MIN_EXECUTION_SPEED = 1            // Slowest execution
MAX_EXECUTION_SPEED = 10           // Fastest execution
DEFAULT_EXECUTION_SPEED = 1        // Default speed
```

### Display Formats
```typescript
ADDRESS_BUS_DIGITS = 3             // Address bus display digits
DATA_BUS_DIGITS = 5                // Data bus display digits
ACCUMULATOR_DIGITS = 5             // Accumulator display digits
PROGRAM_COUNTER_DIGITS = 5         // Program counter display digits
```

### Control Unit States
```typescript
type ControlUnitState = 'FETCH' | 'DECODE' | 'EXECUTE' | 'STORE';
```

### Instruction Sets

#### Normal Mode (10 user instructions)
```typescript
const NORMAL_INSTRUCTIONS = {
  TAKE: '01',    // Load accumulator
  ADD: '02',     // Add to accumulator
  SUB: '03',     // Subtract from accumulator
  SAVE: '04',    // Store accumulator
  JMP: '05',     // Jump to address
  TST: '06',     // Test accumulator
  INC: '07',     // Increment accumulator
  DEC: '08',     // Decrement accumulator
  NULL: '09',    // No operation
  HLT: '10',     // Halt execution
} as const;
```

#### Bonsai Mode (5 user instructions)
```typescript
const BONSAI_INSTRUCTIONS = {
  INC: '01',     // Increment accumulator
  DEC: '02',     // Decrement accumulator
  JMP: '03',     // Jump to address
  TST: '04',     // Test accumulator
  HLT: '05',     // Halt execution
} as const;
```

#### Internal FETCH
```typescript
// FETCH is used internally for instruction fetching
// It is not exposed in UI opcode tables
const INTERNAL_FETCH = '00';  // Internal use only
```

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-19  
**Next Review**: 2025-01-19 