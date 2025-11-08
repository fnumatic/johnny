import { assocMut } from "./utils";

// RAM size constant
export const RAM_SIZE = 1000;

// RAM cell structure constants
export const RAM_CELL_OPCODE_DIGITS = 2;
export const RAM_CELL_DATA_DIGITS = 3;
export const RAM_CELL_TOTAL_DIGITS = RAM_CELL_OPCODE_DIGITS + RAM_CELL_DATA_DIGITS;

// Helper functions for RAM cell structure
export const extractOpcode = (cell: number): number => {
  return Math.floor(cell / 1000);
};

export const extractData = (cell: number): number => {
  return cell % 1000;
};
interface OPData {
  opcode: string;
  data: number;
}

/**
 * Parse a RAM cell and return the opcode as an operation name and data as a number.
 * 
 * @param cell - The RAM cell value (e.g., 1020 for opcode 1, data 20)
 * @param microcode - The microcode object containing operations array
 * @returns Object with opcode (operation name) and data (number)
 * 
 * @example
 * // Using normal microcode
 * const normalMC = parseMicrocode(normalMC, 11);
 * const result = parseOPData(1020, normalMC);
 * // Returns: { opcode: 'TAKE', data: 20 }
 * 
 * @example
 * // Using bonsai microcode  
 * const bonsaiMC = parseMicrocode(bonsaiMC, 6);
 * const result = parseOPData(1020, bonsaiMC);
 * // Returns: { opcode: 'INC', data: 20 }
 */
export const decodeRam = (cell: number, microcode: Microcode): OPData => {
  const opcodeNumber = extractOpcode(cell);
  const data = extractData(cell);
  
  // Convert opcode number to operation name using microcode
  const opcodeMapping = generateOpcodeMapping(microcode.operations);
  const opcode = opcodeMapping[opcodeNumber.toString().padStart(2, '0')] || '';
  
  return {opcode, data};
};

/**
 * Convert parseOPData result to vector format for easier testing.
 * 
 * @param opData - The result from parseOPData function
 * @returns Array with [opcode, data] where opcode is in original case
 * 
 * @example
 * const result = parseOPData(1020, microcode);
 * expect(toVec(result)).toStrictEqual(['TAKE', 20]);
 */
export const toVec = (opData: OPData): [string, number] => {
  return [opData.opcode, opData.data];
};

/**
 * Create a RAM cell from opcode and data.
 * 
 * Format: ODDD (single digit opcode + 3-digit data) or OODDD (two digit opcode + 3-digit data)
 * 
 * @param opcode - The opcode number (0-99)
 * @param data - The data value (0-999, will be truncated to fit)
 * @returns RAM cell value
 * 
 * @example
 * createRamCell(1, 20) // Returns: 1020 (opcode 1, data 20)
 * createRamCell(12, 345) // Returns: 12345 (opcode 12, data 345)
 */
export const encodeRam = (opcode: number, data: number): number => {
  return opcode * 1000 + (data % 1000);
};

export const bonsaiMC = "8;2;3;5;0;0;0;0;0;0;4;2;18;16;15;1;9;7;0;0;4;2;18;17;15;1;9;7;0;0;11;7;0;0;0;0;0;0;0;0;4;2;18;10;9;7;0;0;0;0;19;7;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;FETCH;INC;DEC;JMP;TST;HLT";

export const normalMC = "8;2;3;5;0;0;0;0;0;0;12;4;2;13;9;7;0;0;0;0;4;2;13;9;7;0;0;0;0;0;4;2;14;9;7;0;0;0;0;0;4;15;1;9;7;0;0;0;0;0;11;7;0;0;0;0;0;0;0;0;4;2;18;10;9;7;0;0;0;0;12;4;2;13;16;15;1;9;7;0;12;4;2;13;17;15;1;9;7;0;4;12;15;1;9;7;0;0;0;0;19;7;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;FETCH;TAKE;ADD;SUB;SAVE;JMP;TST;INC;DEC;NULL;HLT";

// Default microcode modes
export const DEFAULT_MODES = {
  "bonsai": bonsaiMC,
  "normal": normalMC
} as const;

export type MicrocodeMode = keyof typeof DEFAULT_MODES;

/**
 * Get the current microcode from store state
 * 
 * @param currentMode - The current mode name
 * @param availableModes - The available modes object
 * @returns Parsed microcode object
 * 
 * @example
 * const currentMicrocode = getCurrentMicrocode(currentMode, availableModes);
 */
export const getCurrentMicrocode = (currentMode: MicrocodeMode, availableModes: typeof DEFAULT_MODES) => {
  const microcodeString = availableModes[currentMode];
  return parseMicrocode(microcodeString);
};

// Microcode type
export type Microcode = {
  instructions: number[][],
  operations: string[]
}

// Parse microcode strings into usable data structures
export const parseMicrocode = (mcString: string, opcodeCount?: number): Microcode => {
  const parts = mcString.split(';');
  
  // Default opcode counts: normalMC=11, bonsaiMC=6
  let count = opcodeCount;
  if (count === undefined) {
    // Try to auto-detect based on known endings
    if (mcString === bonsaiMC) count = 6;
    else if (mcString === normalMC) count = 11;
    else count = 11; // fallback
  }
  
  // Handle the case where count is 0 (no operations)
  const microcodeNumbers = count === 0 ? parts.map(Number) : parts.slice(0, -count).map(Number);
  const operations = count === 0 ? [] : parts.slice(-count); // Include FETCH - it's the first macro instruction
  
  // Only use the first count*10 numbers for the macro instructions
  // The rest are padding/unused
  const usedMicrocodeNumbers = microcodeNumbers.slice(0, count * 10);
  
  // Group microcode numbers into sets of 10 per macro instruction
  const instructions: number[][] = [];
  for (let i = 0; i < usedMicrocodeNumbers.length; i += 10) {
    const macroInstruction = usedMicrocodeNumbers.slice(i, i + 10);
    // Pad with zeros if less than 10 numbers
    while (macroInstruction.length < 10) {
      macroInstruction.push(0);
    }
    instructions.push(macroInstruction);
  }
  
  return {
    instructions,
    operations
  };
};

const idxToOpcode = (idx: number) => idx.toString().padStart(2, '0');

// Generate opcode mapping from operations array
export const generateOpcodeMapping = (operations: string[]) => {
  return operations.reduce(
    (mapping, operation, index) => assocMut(mapping, idxToOpcode(index), operation), 
    {} as { [key: string]: string });
};

 

// Flatten microcode for CPU simulation (converts array of arrays to flat array)
export const flattenMicrocode = (microCode: Microcode): number[] => {
  
  return microCode.instructions.flat();
};

// Export flattened microcode for CPU simulation



// const maxRecursion=15;
// const executionSpeed=1000;

// CPU Simulation Demo (funktional, ohne Seiteneffekte)

// Typdefinitionen
export type CPUState = {
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

type MicroOp = (s: CPUState) => CPUState;
type Action = "inc" | "assign";
type MicroOpTable = Record<number, [MicroOp, Action]>;

// Hilfsfunktionen
const assoc = (s: Array<number>, index: number, value: number): Array<number> => [...s.map((cell, i) => i === index ? value : cell)];

// Mikrooperationen
const PcToAb: MicroOp = (s) => ({ ...s, ab: s.pc });
const RamToDb: MicroOp = (s) => ({ ...s, db: s.ram[s.ab] });
const DbToIr: MicroOp = (s) => ({ ...s, ir: s.db });
const InsToMc: MicroOp = (s) => ({ ...s, mcCounter: extractOpcode(s.ir) * 10 });
const InsToAb: MicroOp = (s) => ({ ...s, ab: extractData(s.ir) });
// const AbToDb: MicroOp = (s) => ({ ...s, db: s.ram[s.ab] });
const DbToAcc: MicroOp = (s) => ({ ...s, acc: s.db });
const AddAcc: MicroOp = (s) => ({ ...s, acc: Math.min(s.acc + s.db, 999) });
const SubAcc: MicroOp = (s) => ({ ...s, acc: Math.max(s.acc - s.db, 0) });
const AccToDb: MicroOp = (s) => ({ ...s, db: s.acc });
const DbToRam: MicroOp = (s) => ({ ...s, ram: assoc(s.ram, s.ab, s.db) });
const IncPc: MicroOp = (s) => ({ ...s, pc: s.pc + 1 });
const InsToPc: MicroOp = (s) => ({ ...s, pc: extractData(s.ir) });
const TestZero: MicroOp = (s) => (s.acc === 0 ? { ...s, pc: s.pc + 1 } : { ...s });
const Halt: MicroOp = (s) => ({ ...s, halted: true });
const NullMc: MicroOp = (s) => ({ ...s, mcCounter: 0 });
const AccZero: MicroOp = (s) => ({ ...s, acc: 0 });
const AccInc: MicroOp = (s) => ({ ...s, acc: Math.min(s.acc + 1, 999) });
const AccDec: MicroOp = (s) => ({ ...s, acc: Math.max(s.acc - 1, 0) });

// Mikrocode-Tabelle
const opTbl: MicroOpTable = {
  1: [DbToRam, "inc"], //databus to ram (write)
  2: [RamToDb, "inc"], //ram to databus (read)
  3: [DbToIr, "inc"], //databus to instruction register (read)
  4: [InsToAb, "inc"], //instruction register to address bus (read)
  5: [InsToMc, "assign"], //instruction register to microcode counter (write)
  7: [NullMc, "assign"], //null microcode counter (write)
  8: [PcToAb, "inc"], //program counter to address bus (read)
  9: [IncPc, "inc"], //program counter increment (write)
  10: [TestZero, "inc"], //test zero accumulator (read)
  11: [InsToPc, "inc"], //instruction register to program counter (write)
  12: [AccZero , "inc"], //accumulator to zero (write)
  13: [AddAcc, "inc"], //accumulator add (write)
  14: [SubAcc, "inc"], //accumulator subtract (write)   
  15: [AccToDb, "inc"], //accumulator to databus (write)
  16: [AccInc, "inc"], //accumulator increment (write)
  17: [AccDec, "inc"], //accumulator decrement (write)
  18: [DbToAcc, "inc"], //databus to accumulator (write)
  19: [Halt, "inc"], //halt (write)
};

// Mikrostep
export function executeMicroStep(state: CPUState): CPUState {
  const mcInstr = state.microCode[state.mcCounter];
  const entry = opTbl[mcInstr];
  if (!entry) return { ...state, halted: true };
  const [fn, action] = entry;
  const next = fn(state);
  return {
    ...next,
    mcCounter: action === "inc" ? state.mcCounter + 1 : next.mcCounter,
  };
}


// Execute a complete instruction (fetch + execute)
export function executeInstruction(state: CPUState): CPUState {
  // If mcCounter is 0, we need to start the fetch cycle
  if (state.mcCounter === 0) {
    // The fetch cycle is defined in the microcode at positions 0-3
    // Execute the fetch cycle using the microcode system
    state = executeMicroStep(state); // Start fetch cycle (mcCounter becomes 1)
  }
  
  // Execute the complete instruction using the microcode system
  // This will handle both the remaining fetch steps and the instruction execution
  while (state.mcCounter !== 0 && !state.halted) {
    state = executeMicroStep(state);
  }
  
  return state;
}

/**
 * Predefined lookup table for microcode operation descriptions
 * Maps microcode operation numbers to their human-readable descriptions
 */
export const MICROCODE_OPERATION_DESCRIPTIONS: Record<number, string> = {
  1: 'pc 🡒 ab',
  2: 'ram 🡒 db', 
  3: 'db 🡒 ir',
  4: 'ir 🡒 ab',
  5: 'ir 🡒 mc',
  6: 'db 🡒 acc',
  7: 'acc + db 🡒 acc',
  8: 'acc - db 🡒 acc',
  9: 'acc 🡒 db',
  10: 'db 🡒 ram',
  11: 'pc + 1 🡒 pc',
  12: 'ir 🡒 pc',
  13: 'if acc=0 then pc+1',
  14: 'halt',
  15: 'mc := 0',
  16: 'acc := 0',
  17: 'acc + 1 🡒 acc',
  18: 'acc - 1 🡒 acc',
  19: 'null'
};

/**
 * Get microcode operation description from lookup table
 * 
 * @param operationNumber - The microcode operation number
 * @returns The human-readable description or the number as string if not found
 * 
 * @example
 * getMicrocodeDescription(1) // Returns: 'pc 🡒 ab'
 * getMicrocodeDescription(99) // Returns: '99'
 */
export const getMicrocodeDescription = (operationNumber: number): string => {
  return MICROCODE_OPERATION_DESCRIPTIONS[operationNumber] || String(operationNumber);
};

/**
 * Clean CPU state constant - can be overridden as needed
 */
export const CLEAN_CPU_STATE: CPUState = {
  ram: Array(RAM_SIZE).fill(0),
  acc: 0,
  pc: 0,
  ir: 0,
  db: 0,
  ab: 0,
  mcCounter: 0,
  halted: false,
  microCode: flattenMicrocode(parseMicrocode(normalMC, 11)),
};








