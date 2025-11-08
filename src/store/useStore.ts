import { create } from 'zustand'
import { DEFAULT_MODES, MicrocodeMode, executeInstruction, executeMicroStep, getCurrentMicrocode, flattenMicrocode, Microcode, CLEAN_CPU_STATE, CPUState, parseMicrocode, getMicrocodeDescription } from '../lib/engine'
import { parseProgram, UnifiedMetadata } from '../lib/unifiedParse'

interface ExecutionTraceEntry {
  timestamp: number;
  instruction: string;
  address: number;
  result: string;
}

interface State {
  // CPU State
  cpuState: CPUState;
  
  // Control flags
  isRunning: boolean;
  isPaused: boolean;
  executionSpeed: number;
  autoRunInterval: NodeJS.Timeout | null;
  
  // Microcode mode
  currentMode: MicrocodeMode;
  availableModes: typeof DEFAULT_MODES;
  
  // UI state
  selectedMemoryRow: number;
  showEditor: boolean;
  showControlUnit: boolean;
  isControlUnit: boolean;
  showStartScreen: boolean;
  showProgramEditor: boolean;
  programEditorText: string;
  controlUnitState: 'FETCH' | 'DECODE' | 'EXECUTE' | 'STORE';
  controlSignals: string[];
  instructionRegister: {
    opcode: string;
    operand: string;
  };
  microcode: {
    address: string;
    instruction: string;
    description: string;
  }[];
  rawMicrocode: Microcode;
  loadMsg: string;
  
  // Microcode edit dialog state
  selectedInstruction: string;
  
  // Dev Mode state
  isDevMode: boolean;
  showMaschinenraum: boolean;
  executionStats: {
    instructionsExecuted: number;
    clockCycles: number;
    startTime: number | null;
    executionTime: number;
  };
  breakpoints: Set<number>;
  watchedAddresses: Set<number>;
  executionTrace: ExecutionTraceEntry[];
  currentProgramMetadata: UnifiedMetadata | null;
}

interface Actions {
  setAddressBus: (value: string) => void;
  setDataBus: (value: string) => void;
  setAccumulator: (value: string) => void;
  toggleRunning: () => void;
  togglePause: () => void;
  setExecutionSpeed: (speed: number) => void;
  setSelectedMemoryRow: (row: number) => void;
  toggleEditor: () => void;
  incrementAccumulator: () => void;
  decrementAccumulator: () => void;
  resetAccumulator: () => void;
  transferToAccumulator: () => void;
  transferFromAccumulator: () => void;
  addToAccumulator: () => void;
  subtractFromAccumulator: () => void;
  toggleControlUnit: () => void;
  setControlUnitState: (state: 'FETCH' | 'DECODE' | 'EXECUTE' | 'STORE') => void;
  setControlSignals: (signals: string[]) => void;
  incrementClockCycle: () => void;
  resetClockCycle: () => void;
  setProgramCounter: (value: number) => void;
  setInstructionRegister: (opcode: string, operand: string) => void;
  incrementProgramCounter: () => void;
  updateRamRow: (index: number, value: number) => void;
  setCurrentMode: (mode: MicrocodeMode) => void;
  addCustomMode: (name: string, microcode: string) => void;
  stepForward: () => void;
  stepMicrocode: () => void;
  setShowStartScreen: (show: boolean) => void;
  resetProgramCounter: () => void;
  loadTestProgram: () => void;
  loadProgramFromString: (programString: string) => void;
  loadProgramFromFile: (file: File) => Promise<void>;
  openProgramEditor: () => void;
  hideProgramEditor: () => void;
  setProgramEditorText: (text: string) => void;
  runUntilHalt: () => void;
  stopAutoRun: () => void;
  resetMicrocode: () => void;
  saveMicrocodeToFile: () => void;
  loadMicrocodeFromFile: (file: File) => void;
  updateMicrocodeRow: (rowIndex: number, instruction: string) => void;
  
  // Microcode edit dialog actions
  setSelectedInstruction: (instruction: string) => void;
  clearSelectedInstruction: () => void;
  
  // Dev Mode actions
  toggleDevMode: () => void;
  toggleMaschinenraum: () => void;
  resetExecutionStats: () => void;
  addBreakpoint: (address: number) => void;
  removeBreakpoint: (address: number) => void;
  addWatchAddress: (address: number) => void;
  removeWatchAddress: (address: number) => void;
  addExecutionTrace: (entry: ExecutionTraceEntry) => void;
  clearExecutionTrace: () => void;
}

// Function to load the test program
const loadTestProgram = () => {
  // Test Program in multiline string format
  // Each line represents: opcode + data (e.g., 1005 = opcode 1, data 5)
  const testProgram = `1005
2006
3007
4008
10000
23
3
10`;

  const { ram } = parseProgram(testProgram);
  return ram;
};

// Function to generate UI-friendly microcode descriptions
const generateMicrocodeUI = (microcode: Microcode) => {
  const flattenedMicrocode = flattenMicrocode(microcode);
  
  const result = flattenedMicrocode.map((instruction, index) => {
    // Check if this is a macro operation row (every 10th position: 0, 10, 20, etc.)
    const macroIndex = Math.floor(index / 10);
    const isMacroOperation = index % 10 === 0 && macroIndex < microcode.operations.length;
    
    const instructionName = isMacroOperation ? `${microcode.operations[macroIndex]}:` : '';
    const description = getMicrocodeDescription(instruction);
    
    const row = {
      address: index.toString().padStart(3, '0'),
      instruction: instructionName,
      description: description
    };
    
    return row;
  });
  
  return result;
};

export const useStore = create<State & Actions>((set, get) => ({
  // Initial state with test program loaded
  cpuState: {
    ...CLEAN_CPU_STATE,
    ram: loadTestProgram(),
    microCode: flattenMicrocode(getCurrentMicrocode('normal', DEFAULT_MODES)),
  },
  isRunning: false,
  isPaused: false,
  executionSpeed: 1,
  autoRunInterval: null,
  currentMode: 'normal',
  availableModes: DEFAULT_MODES,
  selectedMemoryRow: -1,
  showEditor: false,
  showControlUnit: false,
  isControlUnit: true,
  showStartScreen: true,
  showProgramEditor: false,
  programEditorText: '',
  controlUnitState: 'FETCH',
  controlSignals: [],
  instructionRegister: {
    opcode: '00',
    operand: '000'
  },
  microcode: (() => {
    const microcode = getCurrentMicrocode('normal', DEFAULT_MODES);
    return generateMicrocodeUI(microcode);
  })(),
  rawMicrocode: getCurrentMicrocode('normal', DEFAULT_MODES),
  loadMsg: '',
  
  // Microcode edit dialog state
  selectedInstruction: '',
  
  // Dev Mode initial state
  isDevMode: false,
  showMaschinenraum: false,
  executionStats: {
    instructionsExecuted: 0,
    clockCycles: 0,
    startTime: null,
    executionTime: 0,
  },
  breakpoints: new Set<number>(),
  watchedAddresses: new Set<number>(),
  executionTrace: [],
  currentProgramMetadata: null,

  // Actions
  setAddressBus: (value) => set((state) => ({ 
    cpuState: { ...state.cpuState, ab: parseInt(value) }
  })),
  setDataBus: (value) => set((state) => ({ 
    cpuState: { ...state.cpuState, db: parseInt(value) }
  })),
  setAccumulator: (value) => set((state) => ({ 
    cpuState: { ...state.cpuState, acc: parseInt(value) }
  })),
  toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setExecutionSpeed: (speed) => set({ executionSpeed: speed }),
  setSelectedMemoryRow: (row) => set({ selectedMemoryRow: row }),
  toggleEditor: () => set((state) => ({ showEditor: !state.showEditor })),
  incrementAccumulator: () => set((state) => ({ 
    cpuState: { ...state.cpuState, acc: state.cpuState.acc + 1 }
  })),
  decrementAccumulator: () => set((state) => ({ 
    cpuState: { ...state.cpuState, acc: state.cpuState.acc - 1 }
  })),
  resetAccumulator: () => set((state) => ({ 
    cpuState: { ...state.cpuState, acc: 0 }
  })),
  transferToAccumulator: () => set((state) => ({ 
    cpuState: { ...state.cpuState, acc: state.cpuState.db }
  })),
  transferFromAccumulator: () => set((state) => ({ 
    cpuState: { ...state.cpuState, db: state.cpuState.acc }
  })),
  addToAccumulator: () => set((state) => ({ 
    cpuState: { ...state.cpuState, acc: state.cpuState.acc + state.cpuState.db }
  })),
  subtractFromAccumulator: () => set((state) => ({ 
    cpuState: { ...state.cpuState, acc: state.cpuState.acc - state.cpuState.db }
  })),
  toggleControlUnit: () => set((state) => ({ isControlUnit: !state.isControlUnit })),
  setControlUnitState: (state) => set({ controlUnitState: state }),
  setControlSignals: (signals) => set({ controlSignals: signals }),
  incrementClockCycle: () => set((state) => ({ 
    cpuState: { ...state.cpuState, mcCounter: state.cpuState.mcCounter + 1 }
  })),
  resetClockCycle: () => set((state) => ({ 
    cpuState: { ...state.cpuState, mcCounter: 0 }
  })),
  setProgramCounter: (value) => set((state) => ({ 
    cpuState: { ...state.cpuState, pc: value }
  })),
  setInstructionRegister: (opcode, operand) => 
    set({ instructionRegister: { opcode, operand } }),
  incrementProgramCounter: () => set((state) => ({
    cpuState: { ...state.cpuState, pc: state.cpuState.pc + 1 }
  })),
  updateRamRow: (index: number, value: number) => set((state) => ({
    cpuState: { 
      ...state.cpuState, 
      ram: state.cpuState.ram.map((val, i) => 
        i === index ? value : val
      )
    }
  })),
  setCurrentMode: (mode) => set((state) => {
    const microcode = getCurrentMicrocode(mode, state.availableModes);
    const flattenedMicrocode = flattenMicrocode(microcode);
    
    return {
      currentMode: mode,
      rawMicrocode: microcode,
      microcode: generateMicrocodeUI(microcode),
      cpuState: {
        ...state.cpuState,
        microCode: flattenedMicrocode,
      }
    };
  }),
  addCustomMode: (name, microcode) => set((state) => ({
    availableModes: {
      ...state.availableModes,
      [name]: microcode
    }
  })),
  setShowStartScreen: (show) => set({ showStartScreen: show }),
   openProgramEditor: () => set({ showProgramEditor: true }),
  hideProgramEditor: () => set({ showProgramEditor: false, programEditorText: '' }),
  setProgramEditorText: (text) => set({ programEditorText: text }),
  resetProgramCounter: () => set((state) => ({
    cpuState: {
      ...CLEAN_CPU_STATE,
      ram: state.cpuState.ram, // Preserve RAM
      microCode: state.cpuState.microCode, // Preserve microcode
    },
    isRunning: false,
  })),
  loadTestProgram: () => set((state) => ({
    cpuState: {
      ...CLEAN_CPU_STATE,
      ram: loadTestProgram(),
      microCode: state.cpuState.microCode, // Preserve microcode
    },
    isRunning: false,
  })),
  stepForward: () => set((state) => {
    // Execute one instruction (macro step) using existing microcode in CPU state
    const newCpuState = executeInstruction(state.cpuState);
    
    // Update execution statistics
    const updatedStats = {
      ...state.executionStats,
      instructionsExecuted: state.executionStats.instructionsExecuted + 1,
      clockCycles: state.executionStats.clockCycles + 1,
      startTime: state.executionStats.startTime || Date.now(),
      executionTime: state.executionStats.startTime ? Date.now() - state.executionStats.startTime : 0,
    };
    
    // Add execution trace if dev mode is enabled
    const newTrace = state.isDevMode ? [...state.executionTrace, {
      timestamp: Date.now(),
      instruction: `PC:${state.cpuState.pc.toString().padStart(3, '0')} IR:${newCpuState.ir.toString().padStart(5, '0')}`,
      address: state.cpuState.pc,
      result: `ACC:${newCpuState.acc.toString().padStart(5, '0')} ${newCpuState.halted ? 'HALT' : 'OK'}`,
    }] : state.executionTrace;
    
    // Keep only the last 100 entries to prevent memory issues
    if (newTrace.length > 100) {
      newTrace.splice(0, newTrace.length - 100);
    }
    
    // Update store with new CPU state
    return {
      cpuState: newCpuState,
      isRunning: newCpuState.halted ? false : state.isRunning,
      executionStats: updatedStats,
      executionTrace: newTrace,
    };
  }),
  stepMicrocode: () => set((state) => {
    // Execute one microcode step
    const newCpuState = executeMicroStep(state.cpuState);
    
    // Update execution statistics for microcode steps
    const updatedStats = {
      ...state.executionStats,
      clockCycles: state.executionStats.clockCycles + 1,
      startTime: state.executionStats.startTime || Date.now(),
      executionTime: state.executionStats.startTime ? Date.now() - state.executionStats.startTime : 0,
    };
    
    return {
      cpuState: newCpuState,
      isRunning: newCpuState.halted ? false : state.isRunning,
      executionStats: updatedStats,
    };
  }),
  loadProgramFromString: (programString) => {
    const { ram, metadata } = parseProgram(programString);

    set((state) => ({
      cpuState: {
        ...CLEAN_CPU_STATE,
        ram: ram,
        microCode: state.cpuState.microCode, // Preserve microcode
      },
      isRunning: false,
      currentProgramMetadata: metadata,
    }));
  },
loadProgramFromFile: async (file) => {
    try {
      const content = await file.text();
      const parsedProgram = parseProgram(content);
      
      set((state) => ({
        cpuState: {
          ...CLEAN_CPU_STATE,
          ram: parsedProgram.ram,
          microCode: state.cpuState.microCode, // Preserve microcode
        },
        currentMode: parsedProgram.metadata?.isa || 'normal',
        isRunning: false,
        currentProgramMetadata: parsedProgram.metadata ? {
          type: parsedProgram.metadata.type,
          description: parsedProgram.metadata.description,
          version: parsedProgram.metadata.version,
          isa: parsedProgram.metadata.isa
        } : null,
      }));
    } catch (error) {
      console.error('Error loading program from file:', error);
    }
  },
  runUntilHalt: () => {
    const state = get();
    
    // Only start if not already running
    if (state.isRunning) {
      return;
    }
    
    // Clear any existing interval
    if (state.autoRunInterval) {
      clearInterval(state.autoRunInterval);
    }
    
    // Reset program state before starting
    set((state) => ({
      cpuState: {
        ...CLEAN_CPU_STATE,
        ram: state.cpuState.ram, // Preserve RAM
        microCode: state.cpuState.microCode, // Preserve microcode
      },
      isRunning: true,
      executionStats: {
        ...state.executionStats,
        startTime: Date.now(),
      }
    }));
    
    // Create interval to execute instructions
    const interval = setInterval(() => {
      const currentState = get();
      
      // If program is halted or not running, stop the interval
      if (currentState.cpuState.halted || !currentState.isRunning) {
        clearInterval(interval);
        set({ 
          isRunning: false, 
          autoRunInterval: null 
        });
        return;
      }
      
      // Execute one step using existing microcode
      const newCpuState = executeInstruction(currentState.cpuState);
      
      // Update execution statistics
      const updatedStats = {
        ...currentState.executionStats,
        instructionsExecuted: currentState.executionStats.instructionsExecuted + 1,
        clockCycles: currentState.executionStats.clockCycles + 1,
        executionTime: currentState.executionStats.startTime ? Date.now() - currentState.executionStats.startTime : 0,
      };
      
      // Add execution trace if dev mode is enabled
      const newTrace = currentState.isDevMode ? [...currentState.executionTrace, {
        timestamp: Date.now(),
        instruction: `PC:${currentState.cpuState.pc.toString().padStart(3, '0')} IR:${newCpuState.ir.toString().padStart(5, '0')}`,
        address: currentState.cpuState.pc,
        result: `ACC:${newCpuState.acc.toString().padStart(5, '0')} ${newCpuState.halted ? 'HALT' : 'OK'}`,
      }] : currentState.executionTrace;
      
      // Keep only the last 100 entries to prevent memory issues
      if (newTrace.length > 100) {
        newTrace.splice(0, newTrace.length - 100);
      }
      
      set({
        cpuState: newCpuState,
        isRunning: !newCpuState.halted,
        autoRunInterval: newCpuState.halted ? null : interval,
        executionStats: updatedStats,
        executionTrace: newTrace,
      });
      
      // If halted, clear the interval
      if (newCpuState.halted) {
        clearInterval(interval);
      }
    }, 1000 / state.executionSpeed); // Adjust speed based on executionSpeed
    
    set({ autoRunInterval: interval });
  },
  stopAutoRun: () => {
    const state = get();
    if (state.autoRunInterval) {
      clearInterval(state.autoRunInterval);
    }
    set({ 
      isRunning: false, 
      autoRunInterval: null 
    });
  },
  resetMicrocode: () => set((state) => {
    // Get the hardcoded microcode for the current mode
    const hardcodedMicrocode = getCurrentMicrocode(state.currentMode, state.availableModes);
    const flattenedMicrocode = flattenMicrocode(hardcodedMicrocode);
    
    return {
      rawMicrocode: hardcodedMicrocode,
      microcode: generateMicrocodeUI(hardcodedMicrocode),
      cpuState: {
        ...state.cpuState,
        microCode: flattenedMicrocode,
        mcCounter: 0, // Reset the microcode counter
      },
      isRunning: false,
    };
  }),
  saveMicrocodeToFile: () => {
    const state = get();
    const microcode = state.rawMicrocode;
    
    // Convert microcode back to string format like in engine.ts
    const microcodeNumbers = microcode.instructions.flat();
    const operations = microcode.operations;
    const microcodeString = [...microcodeNumbers, ...operations].join(';');
    
    const blob = new Blob([microcodeString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'microcode.mc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  loadMicrocodeFromFile: (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        try {
          const microcodeString = event.target.result as string;
          const loadedMicrocode = parseMicrocode(microcodeString);
          set((state) => {
            const flattenedMicrocode = flattenMicrocode(loadedMicrocode);
            return {
              rawMicrocode: loadedMicrocode,
              microcode: generateMicrocodeUI(loadedMicrocode),
              cpuState: {
                ...state.cpuState,
                microCode: flattenedMicrocode,
                mcCounter: 0, // Reset microcode counter when loading new microcode
              }
            };
          });
        } catch (error) {
          console.error('Error loading microcode from file:', error);
          set({ loadMsg: 'Error loading microcode from file.' });
        }
      }
    };
    reader.readAsText(file);
  },
  updateMicrocodeRow: (rowIndex: number, instruction: string) => {
    set((state) => {
      // Update individual microcode instruction
      const instructionValue = parseInt(instruction, 10);
      
      if (isNaN(instructionValue)) {
        console.error('[Store] Invalid instruction value:', instruction);
        return state;
      }
      
      // Update the flattened microcode array
      const newMicroCode = [...state.cpuState.microCode];
      newMicroCode[rowIndex] = instructionValue;
      
      // Update the raw microcode instructions array
      const newInstructions = [...state.rawMicrocode.instructions];
      const instructionArrayIndex = Math.floor(rowIndex / 10);
      const instructionPosition = rowIndex % 10;
      
      if (newInstructions[instructionArrayIndex]) {
        newInstructions[instructionArrayIndex] = [...newInstructions[instructionArrayIndex]];
        newInstructions[instructionArrayIndex][instructionPosition] = instructionValue;
      } else {
        console.error('[Store] Instruction array index out of bounds:', instructionArrayIndex);
      }
      
      const updatedRawMicrocode = {
        ...state.rawMicrocode,
        instructions: newInstructions
      };
      
      // Generate new UI microcode
      const newUIMicrocode = generateMicrocodeUI(updatedRawMicrocode);
      
      const newState = {
        rawMicrocode: updatedRawMicrocode,
        microcode: newUIMicrocode,
        cpuState: {
          ...state.cpuState,
          microCode: newMicroCode,
        }
      };
      
      return newState;
    });
  },
  
  // Microcode edit dialog actions
  setSelectedInstruction: (instruction) => set({ selectedInstruction: instruction }),
  clearSelectedInstruction: () => set({ selectedInstruction: '' }),
  
  // Dev Mode actions
  toggleDevMode: () => set((state) => ({ 
    isDevMode: !state.isDevMode,
    showMaschinenraum: !state.isDevMode ? true : false // Show panel when enabling, hide when disabling
  })),
  toggleMaschinenraum: () => set((state) => ({ 
    showMaschinenraum: state.isDevMode ? !state.showMaschinenraum : false // Only allow opening if dev mode is enabled
  })),
  resetExecutionStats: () => set({
    executionStats: {
      instructionsExecuted: 0,
      clockCycles: 0,
      startTime: null,
      executionTime: 0,
    }
  }),
  addBreakpoint: (address) => set((state) => {
    const newBreakpoints = new Set(state.breakpoints);
    newBreakpoints.add(address);
    return { breakpoints: newBreakpoints };
  }),
  removeBreakpoint: (address) => set((state) => {
    const newBreakpoints = new Set(state.breakpoints);
    newBreakpoints.delete(address);
    return { breakpoints: newBreakpoints };
  }),
  addWatchAddress: (address) => set((state) => {
    const newWatchedAddresses = new Set(state.watchedAddresses);
    newWatchedAddresses.add(address);
    return { watchedAddresses: newWatchedAddresses };
  }),
  removeWatchAddress: (address) => set((state) => {
    const newWatchedAddresses = new Set(state.watchedAddresses);
    newWatchedAddresses.delete(address);
    return { watchedAddresses: newWatchedAddresses };
  }),
  addExecutionTrace: (entry) => set((state) => {
    const newTrace = [...state.executionTrace, entry];
    // Keep only the last 100 entries to prevent memory issues
    if (newTrace.length > 100) {
      newTrace.splice(0, newTrace.length - 100);
    }
    return { executionTrace: newTrace };
  }),
  clearExecutionTrace: () => set({ executionTrace: [] }),
})); 