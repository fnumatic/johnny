# Johnny2 Program Formats Documentation

This document describes all supported program formats for Johnny2 computer simulator using a unified 3-dimensional framework.

## Table of Contents

1. [Overview](#overview)
2. [Format Matrix Framework](#format-matrix-framework)
3. [Format Reference](#format-reference)
4. [Format Detection](#format-detection)
5. [Conversion Guide](#conversion-guide)
6. [Implementation Details](#implementation-details)
7. [Examples & Use Cases](#examples--use-cases)
8. [Migration Guide](#migration-guide)
9. [Appendix](#appendix)

## Overview

The Johnny2 simulator supports multiple program formats organized in a unified version-based framework with standardized headers.

### Unified Header Format
All formats use the consolidated header structure:
```
type:description:version:isa
```

**Components:**
- **type**: `RAM` (current), future: `ISA` for microcode definitions
- **description**: Optional human-readable description in `{}` braces
- **version**: `V1,V2,V3,V4` - determines datachunk structure
- **isa**: `normal,bonsai` - instruction set architecture

### Version → Datachunk Mapping
- **V1**: `integer_code` (raw integer values)
- **V2**: `op.data` (explicit opcode.data format)
- **V3**: `line:integer_code` (addressed with integer encoding)
- **V4**: `line:op.data` (addressed with explicit format)

### ISA Options
- **normal**: Full 11-instruction set (FETCH, TAKE, ADD, SUB, SAVE, JMP, TST, INC, DEC, NULL, HLT)
- **bonsai**: Simplified 6-instruction set (FETCH, INC, DEC, JMP, TST, HLT)

### Unified Architecture
All formats convert to the same internal RAM representation: a 1000-cell array where each cell contains a 5-digit value (2-digit opcode + 3-digit data).

## Format Matrix Framework

### Version-Based Format Organization

| Version | Line Format | Header | Data Chunks | ISA Options | Format Name | Status |
|---------|-------------|---------|-------------|-------------|-------------|---------|
| **V1** | single_line | headerless | integer_code | normal,bonsai | V1 Semicolon | ✅ Implemented |
| **V1** | single_line | header | integer_code | normal,bonsai | V1 Semicolon with Header | 🚧 Planned |
| **V1** | multi_line | headerless | integer_code | normal,bonsai | V1 Flat RAM | ✅ Implemented |
| **V1** | multi_line | header | integer_code | normal,bonsai | V1 Flat RAM with Header | 🚧 Planned |
| **V2** | single_line | header | op.data | normal,bonsai | V2 Semicolon | 🚧 Planned |
| **V2** | multi_line | header | op.data | normal,bonsai | V2 Format | ✅ Implemented |
| **V3** | single_line | header | line:integer_code | normal,bonsai | V3 Semicolon | 🚧 Planned |
| **V3** | multi_line | header | line:integer_code | normal,bonsai | V3 Format | ✅ Implemented |
| **V4** | single_line | header | line:op.data | normal,bonsai | V4 Semicolon | 🚧 Planned |
| **V4** | multi_line | header | line:op.data | normal,bonsai | V4 Format | 🚧 Planned |

### Header Requirements
- **V1**: Header optional (both single_line and multi_line)
- **V2/V3/V4**: Header required `type:description:version:isa`

### Data Chunk Types Explained

#### 1. integer_code (V1) - Raw Integer Values
**Definition**: Raw integer values representing encoded RAM cells (5-digit total: 2-digit opcode + 3-digit data)

**Complete Range Examples**:
- **Minimum values**: `0`, `00`, `000`, `0000`, `00000` (all = 00000)
- **Single digit opcodes**: `1000`, `2000`, `3000`, `4000`, `5000`, `6000`, `7000`, `8000`, `9000`, `10000`
- **Two digit opcodes**: `11000`, `12000`, `13000`, `14000`, `15000`, `16000`, `17000`, `18000`, `19000`, `20000`
- **Data variations**: `1001`, `1002`, `1003`, ..., `1099`, `10100`, `10200`, ..., `10999`
- **Maximum values**: `99999`, `9999`, `999`, `99`, `9` (all valid within range)

**Structure Variations**:
```
0        → 00000 (opcode 00, data 000)
10       → 00010 (opcode 00, data 010) 
100      → 00100 (opcode 00, data 100)
1000     → 01000 (opcode 01, data 000)
10000    → 10000 (opcode 10, data 000)
99999    → 99999 (opcode 99, data 999)
```

**Real Instruction Examples**:
```
1005     → opcode 01, data 005
8002     → opcode 08, data 002
13000    → opcode 13, data 000
1005     → opcode 01, data 005
2006     → opcode 02, data 006
3007     → opcode 03, data 007
```

#### 2. op.data (V2) - Explicit Opcode.Data Format
**Definition**: Explicit opcode.data format with dot separator

**Complete Range Examples**:
- **Zero variations**: `0.0`, `00.0`, `0.00`, `00.00`, `0.000`, `00.000`, `0.0000`, `00.0000` (all = 00000)
- **Single digit opcodes**: `1.0`, `2.0`, `3.0`, `4.0`, `5.0`, `6.0`, `7.0`, `8.0`, `9.0`, `10.0`
- **Two digit opcodes**: `11.0`, `12.0`, `13.0`, `14.0`, `15.0`, `16.0`, `17.0`, `18.0`, `19.0`, `20.0`
- **Data variations**: `1.1`, `1.2`, `1.3`, ..., `1.99`, `1.100`, `1.200`, ..., `1.999`
- **Maximum values**: `99.999`, `99.99`, `99.9` (all valid within range)

**Padding Variations**:
```
1.5      → 01.005 (opcode 01, data 005)
01.5     → 01.005 (opcode 01, data 005)
1.05     → 01.005 (opcode 01, data 005)
01.05    → 01.005 (opcode 01, data 005)
1.005    → 01.005 (opcode 01, data 005)
01.005   → 01.005 (opcode 01, data 005)
```

**Real Instruction Examples**:
```
1.005    → opcode 01, data 005
8.002    → opcode 08, data 002
13.000   → opcode 13, data 000
10.000   → opcode 10, data 000
0.000    → opcode 00, data 000
```

#### 3. line:integer_code (V3) - Addressed with Integer Encoding
**Definition**: Address prefix with colon separator + integer_code encoding

**Complete Address Range Examples**:
- **Minimum addresses**: `0:0`, `00:0`, `000:0`, `0:00`, `00:00`, `000:00` (all = address 0, value 00000)
- **Single digit addresses**: `1:1000`, `2:2000`, `3:3000`, `4:4000`, `5:5000`, `6:6000`, `7:7000`, `8:8000`, `9:9000`
- **Two digit addresses**: `10:10000`, `11:11000`, `12:12000`, ..., `99:99000`
- **Three digit addresses**: `100:100000`, `500:500000`, `999:999999`
- **Maximum address**: `999:99999` (address 999, max value)

**Address Padding Variations**:
```
1:1005   → 001:01005 (address 001, value 01005)
01:1005  → 001:01005 (address 001, value 01005)
001:1005 → 001:01005 (address 001, value 01005)
```

**Non-Sequential Addressing**:
```
10:1005  (address 10)
50:2006  (address 50)
99:3007  (address 99)
100:4008 (address 100)
500:5009 (address 500)
```

**Real Instruction Examples**:
```
01:1005  → address 01, opcode 01, data 005
02:8002  → address 02, opcode 08, data 002
03:13000 → address 03, opcode 13, data 000
10:10000 → address 10, opcode 10, data 000
99:0     → address 99, opcode 00, data 000
```

#### 4. line:op.data (V4) - Addressed with Explicit Format
**Definition**: Address prefix with colon separator + explicit opcode.data format

**Complete Address Range Examples**:
- **Minimum addresses**: `0:0.0`, `00:0.0`, `000:0.0`, `0:0.00`, `00:0.00`, `000:0.00`
- **Single digit addresses**: `1:1.0`, `2:2.0`, `3:3.0`, `4:4.0`, `5:5.0`, `6:6.0`, `7:7.0`, `8:8.0`, `9:9.0`, `10:10.0`
- **Two digit addresses**: `10:1.0`, `11:2.0`, `12:3.0`, ..., `99:10.0`
- **Three digit addresses**: `100:1.0`, `500:2.0`, `999:3.0`
- **Maximum address**: `999:99.999` (address 999, max value)

**Address and Data Padding Variations**:
```
1:1.5     → 001:01.005 (address 001, opcode 01, data 005)
01:1.5    → 001:01.005 (address 001, opcode 01, data 005)
001:1.5   → 001:01.005 (address 001, opcode 01, data 005)
1:01.5    → 001:01.005 (address 001, opcode 01, data 005)
01:01.5   → 001:01.005 (address 001, opcode 01, data 005)
001:01.5  → 001:01.005 (address 001, opcode 01, data 005)
1:1.05    → 001:01.005 (address 001, opcode 01, data 005)
1:1.005   → 001:01.005 (address 001, opcode 01, data 005)
```

**Non-Sequential Addressing**:
```
10:1.005  (address 10)
50:2.006  (address 50)
99:3.007  (address 99)
100:4.008 (address 100)
500:5.009 (address 500)
```

**Real Instruction Examples**:
```
01:1.005  → address 01, opcode 01, data 005
02:8.002  → address 02, opcode 08, data 002
03:13.000 → address 03, opcode 13, data 000
10:10.000 → address 10, opcode 10, data 000
99:0.000  → address 99, opcode 00, data 000
```

#### Cross-Format Equivalence Table
| integer_code | op.data | line:integer_code | line:op.data | Internal |
|-------------|---------|-------------------|--------------|----------|
| 0 | 0.0 | 01:0 | 01:0.0 | 00000 |
| 10 | 0.010 | 01:10 | 01:0.010 | 00010 |
| 100 | 0.100 | 01:100 | 01:0.100 | 00100 |
| 1000 | 1.000 | 01:1000 | 01:1.000 | 01000 |
| 1005 | 1.005 | 01:1005 | 01:1.005 | 01005 |
| 8002 | 8.002 | 01:8002 | 01:8.002 | 08002 |
| 10000 | 10.000 | 01:10000 | 01:10.000 | 10000 |
| 99999 | 99.999 | 01:99999 | 01:99.999 | 99999 |

#### Structure Validation Rules
- **Opcode range**: 0-99 (2 digits max)
- **Data range**: 0-999 (3 digits max)
- **Address range**: 0-999 (3 digits max)
- **Total cell value**: 0-99999 (5 digits max)
- **Padding**: Leading zeros optional but normalized internally

### Format Detection Priority
1. **Header detection** → Parse `type:description:version:isa` format
2. **Version mapping** → Determine datachunk structure from version
3. **Line format detection** → `single_line` vs `multi_line` from separators
4. **ISA validation** → Verify `normal` or `bonsai` instruction set
5. **Content validation** → Apply version-specific rules

## Format Reference

### Format Definitions

#### 1. Single Line, Headerless, Integer Code
**Format Name**: V1 Semicolon Format  
**Location**: `loadProgram()` in `src/lib/engine.ts:409`

**Structure**:
```
integer_code;integer_code;integer_code;...
```

**Example**:
```
1005;2006;3007;10000
```

**Use Cases**: Compact program storage, simple data exchange

---

#### 2. Single Line, Header, Op.Data
**Format Name**: V2 Semicolon Format  
**Location**: `loadProgram()` in `src/lib/engine.ts:392`

**Structure**:
```
type:{description}:V2:isa;opcode.data;opcode.data;...
```

**Examples**:
```
RAM:{add two numbers}:V2:normal;1.005;2.006;3.007;10.000
RAM::{simple program}:V2:bonsai;1.005;2.006;3.007
```

**Use Cases**: Program libraries, categorized examples, compact storage

---

#### 3. Multi Line, Headerless, Integer Code
**Format Name**: V1 Flat RAM  
**Location**: `str2ram()` in `src/lib/engine.ts:293`

**Structure**:
```
integer_code
integer_code
integer_code
...
```

**Example**:
```
1005
2006
3007
10000
```

**Rules**:
- One integer per line
- Empty lines and lines starting with `;` are ignored
- Sequential addressing from 0

**Use Cases**: Quick testing, educational examples

---

#### 4. Multi Line, Header, Op.Data
**Format Name**: V2 Format  
**Location**: `deserializeRamData()` in `src/lib/programLoader.ts:54`

**Structure**:
```
RAM:{description}:V2:isa
opcode.data
opcode.data
...
```

**Encoding Rules**:
- Opcode: 0-99 (padded to 2 digits internally)
- Data: 0-999 (padded to 3 digits internally)
- Internal Conversion: `opcode * 1000 + data`

**Example**:
```
RAM:{addition program}:V2:normal
; Example addition program
1.005
2.006
0.000    ; Empty RAM cell at address 2
13.000
10.000
```

**Use Cases**: Human-readable programs, educational purposes

---

#### 5. Multi Line, Header, Line:Integer Code
**Format Name**: V3 Format  
**Location**: `deserializeRamData()` in `src/lib/programLoader.ts:60`

**Structure**:
```
RAM:{description}:V3:isa
address:integer_code
address:integer_code
...
```

**V3 Encoding Scheme**:
- 1-6 digits total
- First 1-2 digits = instruction opcode (0-99)
- Remaining digits = data/operand (padded to 3 digits)

**Encoding Examples**:
| Integer Code | Decoded Format | Opcode | Data |
|-------------|---------------|--------|------|
| 8002 | 8.002 | 8 | 002 |
| 08002 | 8.002 | 8 | 002 |
| 10001 | 10.001 | 10 | 001 |
| 100 | 0.100 | 0 | 100 |
| 10 | 0.010 | 0 | 010 |

**Example**:
```
RAM:{addition program}:V3:normal
; Example addition program
01:8002
02:1005
03:0     ; Empty RAM cell at address 3
04:2006
05:1300
06:10000
```

**Use Cases**: Traditional Johnny2 programs, backward compatibility

#### 6. Single Line, Header, Integer Code
**Format Name**: V1 Semicolon with Header

**Structure**:
```
type:{description}:V1:isa;integer_code;integer_code;...
```

**Example**:
```
RAM:{add two numbers}:V1:normal;1005;2006;3007;10000
```

**Use Cases**: Categorized programs with metadata

---

#### 7. Multi Line, Header, Integer Code
**Format Name**: V1 Flat RAM with Header

**Structure**:
```
type:{description}:V1:isa
integer_code
integer_code
...
```

**Example**:
```
RAM:{addition program}:V1:normal
; Add two numbers from addresses 50 and 51
8002
1005
0       ; Empty RAM cell
2006
1300
10000
```

**Use Cases**: Categorized flat programs with metadata

---

#### 8. Single Line, Header, Line:Integer Code
**Format Name**: V3 Semicolon Format

**Structure**:
```
type:{description}:V3:isa;address:integer_code;address:integer_code;...
```

**Example**:
```
RAM:{add two numbers}:V3:normal;01:1005;02:2006;03:3007;05:10000
```

**Use Cases**: Categorized addressed programs, explicit memory placement

---

#### 9. Single Line, Header, Line:Op.Data
**Format Name**: V4 Semicolon Format

**Structure**:
```
type:{description}:V4:isa;address:opcode.data;address:opcode.data;...
```

**Example**:
```
RAM:{add two numbers}:V4:normal;01:1.005;02:2.006;03:3.007;05:10.000
```

**Use Cases**: Categorized addressed human-readable programs, best readability

---

#### 10. Multi Line, Header, Line:Op.Data
**Format Name**: V4 Format

**Structure**:
```
RAM:{description}:V4:isa
address:opcode.data
address:opcode.data
...
```

**Example**:
```
RAM:{addition program}:V4:normal
; Add two numbers from addresses 50 and 51
01:1.005
02:2.006
03:0.000  ; Empty RAM cell at address 3
04:3.007
05:13.000
06:10.000
```

**Use Cases**: Most readable format, explicit addressing, educational content

### ❌ Invalid Format Combinations

The following combinations are **invalid** under the unified version-based system:



#### V2/V3 without Header
**Reason**: V2 and V3 require headers for version and ISA specification

#### V4 without Header
**Reason**: V4 requires header for version and ISA specification

#### Invalid ISA Values
**Reason**: Only `normal` and `bonsai` are supported

#### Invalid Version Values
**Reason**: Only V1, V2, V3, V4 are defined

#### Mixed Version Datachunks
**Reason**: Each version has specific datachunk structure that cannot be mixed

## Format Detection

### Detection Algorithm
```typescript
function detectFormat(content: string): FormatDescriptor {
  // 1. Check for unified header format
  const header = parseUnifiedHeader(content);
  
  // 2. Determine line format from separators
  const hasSemicolons = content.includes(';');
  const lineFormat = hasSemicolons ? 'single_line' : 'multi_line';
  
  // 3. Map version to datachunk structure
  const dataChunks = getVersionDataChunks(header.version);
  
  // 4. Validate version-line format compatibility
  if (!isValidVersionFormat(header.version, lineFormat)) {
    throw new Error(`Invalid version-line format combination: ${header.version} with ${lineFormat}`);
  }
  
  // 5. Validate ISA
  if (!isValidISA(header.isa)) {
    throw new Error(`Invalid ISA: ${header.isa}. Supported: normal, bonsai`);
  }
  
  return { header, lineFormat, dataChunks };
}

function parseUnifiedHeader(content: string): HeaderInfo {
  // Handle V1 headerless case
  if (!content.includes(':') || content.trim().split('\n')[0].match(/^\d+$/)) {
    return { type: 'RAM', description: '', version: 'V1', isa: 'normal' };
  }
  
  // Parse unified header: type:description:version:isa
  const firstLine = content.trim().split('\n')[0];
  const parts = firstLine.split(':');
  
  if (parts.length < 4) {
    throw new Error(`Invalid header format: ${firstLine}. Expected: type:description:version:isa`);
  }
  
  return {
    type: parts[0],
    description: parts[1].replace(/^\{|\}$/g, ''),
    version: parts[2],
    isa: parts[3]
  };
}

function getVersionDataChunks(version: string): string {
  switch (version) {
    case 'V1': return 'integer_code';
    case 'V2': return 'op.data';
    case 'V3': return 'line:integer_code';
    case 'V4': return 'line:op.data';
    default: throw new Error(`Unsupported version: ${version}`);
  }
}
```

### Header Detection Rules
- **V1**: No header or simple integers (legacy compatibility)
- **V2/V3/V4**: Unified header `type:description:version:isa` on first line

### Version → Line Format Mapping
- **V1**: `single_line` (headerless) or `multi_line` (headerless)
- **V2**: `single_line` (with header) or `multi_line` (with header)
- **V3**: `single_line` (with header) or `multi_line` (with header)
- **V4**: `single_line` (with header) or `multi_line` (with header)

### ISA Validation
- **normal**: Full 11-instruction set
- **bonsai**: Simplified 6-instruction set

### Comment Handling Rules
- **Multi-line formats**: Lines starting with `;` are treated as comments and ignored during parsing
- **Single-line formats**: Comments not supported (entire line treated as data)
- **Header lines**: Comments not supported in headers (headers must be valid format specifications)

### Empty Line Handling
- **Multi-line formats**: Empty lines are ignored during parsing
- **Single-line formats**: Empty lines not applicable (single line format)
- **Empty RAM cells**: 
  - **Non-addressed formats** (`integer_code`, `op.data`): Must be explicitly denoted with zeros:
    - `integer_code`: `0`, `00`, `000` (all convert to `00000`)
    - `op.data`: `0.0`, `00.000`, `0.000` (all convert to `00000`)
  - **Addressed formats** (`line:integer_code`, `line:op.data`): Can be written as sparse RAM:
    - **Sparse RAM**: Only specify addresses that contain data, unspecified addresses remain empty
    - **Explicit zeros**: `01:0`, `02:00`, `03:000` (if you want to be explicit)
    - **Implicit empty**: Addresses not mentioned in the file remain empty (default behavior)

**Comment and Empty Line Examples**:
```
RAM:{example program}:V3:normal
; This is a comment line
01:1005

; Empty line above is ignored
02:0     ; Explicit empty RAM cell
03:2006
04:000    ; Another explicit empty cell
```

### Conversion Matrix

| From | To | Method | Valid? |
|------|----|--------|---------|
| integer_code | op.data | Parse integer → extract opcode/data → format | ✅ |
| op.data | integer_code | Parse opcode.data → encodeRam(opcode, data) | ✅ |
| plain | addressed | Add sequential addresses | ✅ |
| addressed | plain | Remove addresses, sort by address | ✅ |
| single_line | multi_line | Split separators → join with newlines | ✅ |
| multi_line | single_line | Split lines → join with semicolons | ✅ |
| headerless | header | Add appropriate metadata prefix/header | ✅ |
| header | headerless | Remove metadata prefix/header | ✅ |

### Conversion Examples

#### Integer Code ↔ Op.Data
```
8002 ↔ 8.002
1005 ↔ 1.005
100 ↔ 0.100
10 ↔ 0.010
0 ↔ 0.000
99999 ↔ 99.999
```

#### Plain ↔ Addressed
```
1005;2006;3007 ↔ 01:1005;02:2006;03:3007

1005 ↔ 01:1005
2006 ↔ 02:2006
3007 ↔ 03:3007
0 ↔ 01:0
99999 ↔ 01:99999
```

#### Single Line ↔ Multi Line
```
1005;2006;3007 ↔ 1005
                    2006
                    3007

01:1005;02:2006 ↔ 01:1005
                   02:2006

; With empty RAM cells
1005;0;2006 ↔ 1005

0              ; Empty line ignored
2006
```

#### Header ↔ Headerless
```
RAM:{program}:V2:normal;1.005;2.006 ↔ 1.005;2.006
RAM:{program}:V3:normal          01:1005
; Example comment                 02:2006
01:1005                          03:3007
02:2006
03:3007

; With empty RAM cells and comments
RAM:{program}:V4:normal;01:1.005;02:0.000;03:2.006 ↔ 01:1.005
; Program description                    02:0.000
01:1.005                              03:2.006
02:0.000
03:2.006
```

## Implementation Details

### Unified Parser Architecture

**Main Entry Point**:
```typescript
function parseProgram(content: string): ParsedProgram {
  const format = detectFormat(content);
  return parseByFormat(content, format);
}
```

**Format-Specific Parsers**:
```typescript
// 8 total parsers for valid combinations only
parseSingleLineHeaderlessInteger(content: string)
parseSingleLineHeaderInteger(content: string)
parseSingleLineHeaderOpData(content: string)
parseSingleLineHeaderLineInteger(content: string)
parseSingleLineHeaderLineOpData(content: string)
parseMultiLineHeaderlessInteger(content: string)
parseMultiLineHeaderInteger(content: string)
parseMultiLineHeaderOpData(content: string)
parseMultiLineHeaderLineInteger(content: string)
parseMultiLineHeaderLineOpData(content: string)
```

### Current Implementation Locations

| Function | Location | Formats Supported |
|----------|----------|-------------------|
| `str2ram()` | `engine.ts:293` | multi_line, headerless, integer_code |
| `loadProgram()` | `engine.ts:381` | single_line, header/headerless, integer_code |
| `deserializeRamData()` | `programLoader.ts:18` | multi_line, header, line:integer_code/line:op.data |
| `readRamFile()` | `programLoader.ts:80` | File wrapper for .ram files |

### RAM Cell Structure
All formats convert to the same internal representation:

```
RAM Cell: OODDD (5 digits total)
- OO: Opcode (2 digits, 00-99)
- DDD: Data (3 digits, 000-999)
```

### Error Handling
- Invalid formats throw descriptive errors
- Invalid version-line format combinations are rejected
- Invalid ISA values are rejected (only normal, bonsai supported)
- Invalid integers are skipped with warnings
- Address validation (0-999 range)
- Version validation (V1, V2, V3, V4 only)
- Unified header validation for V2/V3/V4 formats
- Legacy V1 headerless validation

## Examples & Use Cases

### Complete Program Examples

#### Same Program in All Valid Formats

**Program Logic**: Add two numbers from addresses 50 and 51

1. **V1 Flat RAM** (multi_line, headerless, integer_code):
```
; Add two numbers from addresses 50 and 51
8002
1005
0       ; Empty RAM cell
2006
1300
10000
```

2. **V1 Semicolon Format** (single_line, headerless, integer_code):
```
8002;1005;0;2006;1300;10000
```

3. **V2 Semicolon Format** (single_line, header, op.data):
```
RAM:{add two numbers}:V2:normal;8.002;1.005;2.006;13.000;10.000
```

4. **V2 Format** (multi_line, header, op.data):
```
RAM:{addition program}:V2:normal
; Add two numbers from addresses 50 and 51
8.002
1.005
0.000    ; Empty RAM cell
2.006
13.000
10.000
```

5. **V3 Format** (multi_line, header, line:integer_code):
```
RAM:{addition program}:V3:normal
; Add two numbers from addresses 50 and 51
01:8002
02:1005
03:0     ; Empty RAM cell at address 3
04:2006
05:1300
06:10000
```

6. **Planned: V3 Semicolon Format** (single_line, header, line:integer_code):
```
RAM:{add two numbers}:V3:normal;01:8002;02:1005;03:2006;04:1300;05:10000
```

7. **Planned: V4 Semicolon Format** (single_line, header, line:op.data):
```
RAM:{add two numbers}:V4:normal;01:8.002;02:1.005;03:2.006;04:13.000;05:10.000
```

8. **Planned: V4 Format** (multi_line, header, line:op.data):
```
RAM:{addition program}:V4:normal
; Add two numbers from addresses 50 and 51
01:8.002
02:1.005
03:0.000  ; Empty RAM cell at address 3
04:2.006
05:13.000
06:10.000
```

### Sparse RAM Examples

#### V3 Format with Sparse RAM
```
RAM:{sparse program}:V3:normal
; Only specify addresses that contain data
10:8002   ; First instruction at address 10
25:1005   ; Jump to address 25
50:2006   ; Data operation at address 50
99:10000  ; Halt at address 99
; Addresses 0-9, 11-24, 26-49, 51-98 remain empty (default 00000)
```

#### V4 Format with Sparse RAM
```
RAM:{sparse program}:V4:normal
; Sparse RAM with explicit op.data format
10:8.002  ; FETCH 002 at address 10
25:1.005  ; TAKE 005 at address 25  
50:2.006  ; ADD 006 at address 50
99:10.000 ; HLT at address 99
; Unspecified addresses remain empty by default
```

### Best Practices by Use Case

| Use Case | Recommended Format | Reason |
|----------|-------------------|---------|
| **Quick Testing** | V1 Flat RAM | Fastest to write, no overhead |
| **Program Libraries** | V2 Semicolon Format | Categorization and versioning |
| **Educational Content** | V3 Format | Most readable, explicit addressing |
| **Legacy Compatibility** | V2 Format | Traditional Johnny2 format |
| **Compact Storage** | V1 Semicolon Format | Minimal overhead |
| **Human-Readable Exchange** | V2 Semicolon Format | Compact yet readable |
| **Addressed Sequential** | V3 Semicolon Format | Clear addressing, readable |
| **New Development** | V3 Format | Modern standard, best tooling |

## Migration Guide

### For Developers

#### Current → Unified Parser
```typescript
// Old way
const ram1 = str2ram(content);
const result1 = loadProgram(content);
const result2 = deserializeRamData(content);

// New way (after consolidation)
const result = parseProgram(content); // Handles all valid formats
```

#### Adding New Formats
1. Identify format combination in matrix
2. Check if combination is valid per format rules
3. Implement corresponding parser function
4. Add detection logic
5. Update format matrix documentation

### For Users

#### Converting Existing Programs
```typescript
// Convert V2 to V3
const v3Content = convertFormat(v2Content, {
  from: { version: 'V2', isa: 'normal' },
  to: { version: 'V3', isa: 'normal' }
});

// Convert legacy V1 to V4
const v4Content = convertFormat(v1Content, {
  from: { version: 'V1', isa: 'normal' },
  to: { version: 'V4', isa: 'normal', dataChunks: 'op.data' }
});
```

#### Choosing Formats
- Use **V3** for new programs (most readable, explicit addressing)
- Use **V2 Semicolon** for program libraries (compact with metadata)
- Use **V1 Flat RAM** for quick experiments (no overhead)
- Use **V2** for human-readable programs
- Use **V3 Semicolon** for addressed compact storage
- Use **V3 Format** for educational content
- Use **V1 Semicolon** for minimal overhead storage

## Appendix

### Constants
```typescript
RAM_SIZE = 1000
RAM_CELL_OPCODE_DIGITS = 2
RAM_CELL_DATA_DIGITS = 3
RAM_CELL_TOTAL_DIGITS = 5
```

### Opcode Mappings

#### Normal Mode
- 00: FETCH
- 01: TAKE
- 02: ADD
- 03: SUB
- 04: SAVE
- 05: JMP
- 06: TST
- 07: INC
- 08: DEC
- 09: NULL
- 10: HLT

#### Bonsai Mode
- 00: FETCH
- 01: INC
- 02: DEC
- 03: JMP
- 04: TST
- 05: HLT

### File Extensions
- `.ram` - Standard format (V2/V3/V4 with headers)
- `.txt` - Simple formats (V1 flat RAM, V1 semicolon formats)

### Microcode Integration
All formats integrate with the microcode system through:
- `extractOpcode(cell)` - Get instruction number
- `extractData(cell)` - Get operand
- `encodeRam(opcode, data)` - Create RAM cell value
- `decodeRam(cell, microcode)` - Parse to human-readable format

### Format Development Roadmap

**Phase 1: Consolidation** (Current)
- ✅ Document existing formats in version-based framework
- ✅ Define unified header structure `type:description:version:isa`
- ✅ Consolidate format validation rules
- 🔄 Implement unified parser architecture
- 🔄 Add version-based format detection logic

**Phase 2: Completion** (Next)
- 🚧 Implement missing format combinations (V2/V3 single_line, V4 formats)
- 🚧 Add version-based conversion utilities
- 🚧 Comprehensive testing across all versions
- 🚧 Update existing parsers to use unified headers

**Phase 3: Optimization** (Future)
- 📋 Performance optimization for version detection
- 📋 Advanced conversion features (ISA switching)
- 📋 Legacy V1 deprecation planning
- 📋 ISA type definitions (future ISA type)
