# Johnny2 CPU Simulator - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Interface Overview](#interface-overview)
3. [CPU Components](#cpu-components)
4. [Execution Controls](#execution-controls)
5. [Memory Operations](#memory-operations)
6. [Instruction Set](#instruction-set)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### First Launch
When you first open Johnny2, you'll see a splash screen for 1.5 seconds, then the main interface will appear.

### System Requirements
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Device**: Desktop, tablet, or mobile device
- **Connection**: Works offline after initial load

### Quick Start
1. **Load a Program**: Use the toolbar to load example programs
2. **Set Execution Speed**: Use the speed slider (1x to 10x)
3. **Start Execution**: Click the "Run" button
4. **Observe**: Watch the CPU components update in real-time

## Interface Overview

### Main Layout
The interface is divided into three main sections:

```
┌─────────────────────────────────────────────────────────────┐
│                    Toolbar                                 │
├─────────────────────────────────────────────────────────────┤
│                    Address Bus                             │
├─────────────┬─────────────┬───────────────────────────────┤
│   Memory    │   Control   │            ALU               │
│  Section    │    Unit     │                              │
├─────────────┴─────────────┴───────────────────────────────┤
│                    Data Bus                               │
└─────────────────────────────────────────────────────────────┘
```

### Color Coding
- **Blue**: Address bus and memory addresses
- **Green**: Data bus and data values
- **Gray**: Background and inactive elements
- **White**: Text and active highlights

## CPU Components

### Memory Section
The memory section displays 1000 RAM cells in a grid format.

#### Memory Cell Format
Each memory cell contains a 5-digit value in the format `XX,XXX`:
- **First 2 digits**: Opcode (instruction type)
- **Last 3 digits**: Data (address or value)

#### Memory Operations
- **View**: Scroll through memory cells
- **Edit**: Click on any cell to edit its value
- **Highlight**: Active memory locations are highlighted during execution

### Control Unit
The control unit manages CPU execution and instruction processing.

#### Components
- **Program Counter (PC)**: Shows current instruction address
- **Instruction Register (IR)**: Contains current opcode and operand
- **Control State**: FETCH → DECODE → EXECUTE → STORE
- **Clock Cycles**: Counts execution cycles

#### States
1. **FETCH**: Retrieves instruction from memory
2. **DECODE**: Interprets the instruction
3. **EXECUTE**: Performs the operation
4. **STORE**: Saves results if needed

### ALU (Arithmetic Logic Unit)
The ALU performs arithmetic operations and stores results.

#### Accumulator
- **Display**: Shows current value (5 digits)
- **Operations**: Add, subtract, increment, decrement
- **Transfers**: Move data to/from memory

#### Operations
- **Increment (+1)**: Add 1 to accumulator
- **Decrement (-1)**: Subtract 1 from accumulator
- **Add**: Add data bus value to accumulator
- **Subtract**: Subtract data bus value from accumulator

### Data Buses

#### Address Bus
- **Purpose**: Specifies which memory location to access
- **Format**: 3-digit hexadecimal value
- **Updates**: Changes with each memory access

#### Data Bus
- **Purpose**: Transfers data between components
- **Format**: 5-digit decimal value
- **Updates**: Changes with each data transfer

## Execution Controls

### Toolbar Buttons

#### Play/Pause
- **Play**: Start or resume execution
- **Pause**: Stop execution at current instruction
- **Reset**: Return to initial state

#### Speed Control
- **Slider**: Adjust execution speed from 1x to 10x
- **Step**: Execute one instruction at a time
- **Turbo**: Maximum speed execution

#### Mode Selection
- **Normal Mode**: Standard microcode set
- **Bonsai Mode**: Simplified microcode set

### Execution Modes

#### Continuous Execution
1. Set desired speed (1x to 10x)
2. Click "Run" button
3. Watch real-time execution
4. Click "Pause" to stop

#### Step-by-Step Execution
1. Click "Step" button
2. Observe each instruction execution
3. Use "Step" repeatedly for detailed analysis

#### Reset
- **Full Reset**: Returns CPU to initial state
- **Memory Reset**: Clears all memory cells to zero

## Memory Operations

### Editing Memory Cells

#### Direct Editing
1. **Click** on any memory cell
2. **Type** new value (5 digits)
3. **Press Enter** to save
4. **Press Escape** to cancel

#### Auto-formatting
- Values are automatically formatted as `XX,XXX`
- Invalid inputs are rejected
- Leading zeros are automatically added

#### Validation
- **Range**: 0 to 99999
- **Format**: Must be 5 digits
- **Opcode**: First 2 digits must be valid instruction

### Memory Navigation

#### Scrolling
- **Vertical**: Scroll through memory rows
- **Horizontal**: Scroll through memory columns
- **Keyboard**: Use arrow keys for navigation

#### Search
- **Find Address**: Jump to specific memory location
- **Find Value**: Search for specific data values

## Instruction Sets

The CPU supports two instruction sets that can be switched at runtime:

### Normal Mode (10 User Instructions)

#### Data Transfer
| Instruction | Opcode | Description | Example |
|-------------|--------|-------------|---------|
| TAKE | 01 | Load accumulator from memory | `01,020` loads value from address 20 |
| SAVE | 04 | Store accumulator to memory | `04,030` stores accumulator to address 30 |

#### Arithmetic
| Instruction | Opcode | Description | Example |
|-------------|--------|-------------|---------|
| ADD | 02 | Add memory value to accumulator | `02,025` adds value from address 25 |
| SUB | 03 | Subtract memory value from accumulator | `03,025` subtracts value from address 25 |
| INC | 07 | Increment accumulator by 1 | `07,000` adds 1 to accumulator |
| DEC | 08 | Decrement accumulator by 1 | `08,000` subtracts 1 from accumulator |

#### Control Flow
| Instruction | Opcode | Description | Example |
|-------------|--------|-------------|---------|
| JMP | 05 | Jump to address | `05,100` jumps to address 100 |
| TST | 06 | Test accumulator (skip if zero) | `06,000` skips next instruction if acc=0 |
| NULL | 09 | No operation | `09,000` does nothing |
| HLT | 10 | Halt execution | `10,000` stops CPU |

### Bonsai Mode (5 User Instructions)

#### Arithmetic
| Instruction | Opcode | Description | Example |
|-------------|--------|-------------|---------|
| INC | 01 | Increment accumulator by 1 | `01,000` adds 1 to accumulator |
| DEC | 02 | Decrement accumulator by 1 | `02,000` subtracts 1 from accumulator |

#### Control Flow
| Instruction | Opcode | Description | Example |
|-------------|--------|-------------|---------|
| JMP | 03 | Jump to address | `03,100` jumps to address 100 |
| TST | 04 | Test accumulator (skip if zero) | `04,000` skips next instruction if acc=0 |
| HLT | 05 | Halt execution | `05,000` stops CPU |

### Instruction Format
```
XX,XXX
│  └── Data (3 digits)
└── Opcode (2 digits)
```

### Microcode System
The CPU uses a string-based microcode system where each instruction is defined by a series of microcode operations:

#### Microcode Structure
- **String Format**: Semicolon-separated values (e.g., "8;2;3;5;...;FETCH;TAKE;ADD")
- **Instruction Count**: Auto-detected from string endings
- **ISA-Microcode Relationship**: Each ISA macro instruction can have up to 10 microcode instructions
- **Microcode Decoding**: Each microcode instruction is decoded as a number, where 0 means no microcode instruction
- **Dynamic Parsing**: Parsed at runtime to configure CPU behavior

#### Execution Process
1. **Fetch**: Get instruction from memory
2. **Decode**: Parse microcode for instruction type
3. **Execute**: Perform microcode operations
4. **Store**: Save results if needed

#### Mode Switching
- **Normal Mode**: 10 user instructions with full arithmetic support
- **Bonsai Mode**: 5 user instructions with simplified operations
- **Internal FETCH**: Used for instruction fetching, not exposed in UI
- **Runtime Switching**: Can switch modes during execution

## Examples

### Example 1: Simple Addition
Add two numbers and store the result.

```
Memory Setup:
Address 20: 00005  (First number)
Address 21: 00003  (Second number)
Address 22: 00000  (Result location)

Program:
Address 0: 01,020  (TAKE 20 - load first number)
Address 1: 02,021  (ADD 21 - add second number)
Address 2: 04,022  (SAVE 22 - store result)
Address 3: 09,000  (HLT - halt execution)
```

**Result**: Address 22 will contain 00008 (5 + 3 = 8)

### Example 2: Counter Loop
Create a counter that counts from 0 to 5.

```
Memory Setup:
Address 30: 00000  (Counter location)
Address 31: 00005  (Limit value)

Program:
Address 0: 01,030  (TAKE 30 - load counter)
Address 1: 07,000  (INC - increment counter)
Address 2: 04,030  (SAVE 30 - save counter)
Address 3: 02,031  (ADD 31 - add limit)
Address 4: 06,000  (TST - test if zero)
Address 5: 05,000  (JMP 0 - jump back to start)
Address 6: 09,000  (HLT - halt when done)
```

**Result**: Counter will increment until it reaches 5, then halt

### Example 3: Conditional Branching
Add numbers only if accumulator is not zero.

```
Memory Setup:
Address 40: 00010  (First number)
Address 41: 00020  (Second number)
Address 42: 00000  (Result location)

Program:
Address 0: 01,040  (TAKE 40 - load first number)
Address 1: 06,000  (TST - test if zero)
Address 2: 05,006  (JMP 6 - skip if zero)
Address 3: 02,041  (ADD 41 - add second number)
Address 4: 04,042  (SAVE 42 - store result)
Address 5: 09,000  (HLT - halt)
Address 6: 09,000  (HLT - halt if zero)
```

## Troubleshooting

### Common Issues

#### Program Not Running
- **Check**: All instructions have valid opcodes
- **Check**: Memory addresses are within range (0-999)
- **Check**: Program ends with HLT instruction

#### Unexpected Results
- **Check**: Memory values are correctly formatted
- **Check**: Instructions are in correct order
- **Check**: Address references are correct

#### Interface Not Responding
- **Refresh**: Reload the page
- **Reset**: Click reset button
- **Check**: Browser compatibility

#### Performance Issues
- **Reduce Speed**: Use slower execution speed
- **Close Tabs**: Free up browser memory
- **Update Browser**: Use latest browser version

### Error Messages

#### "Invalid Opcode"
- **Cause**: Opcode not in valid range (01-09)
- **Solution**: Check instruction format

#### "Address Out of Range"
- **Cause**: Memory address > 999
- **Solution**: Use addresses 0-999 only

#### "Invalid Format"
- **Cause**: Memory value not 5 digits
- **Solution**: Use format XX,XXX

### Getting Help

#### Documentation
- **API Reference**: Technical details
- **PRD**: Product requirements
- **Source Code**: GitHub repository

#### Support
- **Issues**: Report bugs on GitHub
- **Questions**: Ask in discussions
- **Contributions**: Submit pull requests

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-19  
**Next Review**: 2025-01-19 