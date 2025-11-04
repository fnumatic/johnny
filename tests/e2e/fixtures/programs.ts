export const TEST_PROGRAMS = {
  simple: {
    name: 'Simple Addition',
    program: `1005
2006
3007
10000`,
    description: 'TAKE 5, ADD 6, SUB 7, HALT',
    expected: { accumulator: 16 }
  },
  
  complex: {
    name: 'Complex Loop',
    program: `1000
2001
3002
4001
5003
10000`,
    description: 'Loop program with conditional jump',
    expected: { accumulator: 0, iterations: 3 }
  },

  invalid: {
    name: 'Invalid Format',
    program: `invalid
abc123
1005`,
    description: 'Should be rejected',
    expected: { error: true }
  },

  multiline: {
    name: 'Multiline Program',
    program: `1005
2006
3007
4008
5000
10000`,
    description: 'Complex program with jump',
    expected: { accumulator: 11 }
  },

  semicolon: {
    name: 'Semicolon Separated',
    program: '1005;2006;3007;10000',
    description: 'Semicolon separated format',
    expected: { accumulator: 16 }
  }
};

export const TEST_DATA = {
  memoryAddresses: {
    start: 0,
    end: 999,
    visible: 20
  },
  cpuStates: {
    initial: {
      accumulator: 0,
      programCounter: 0,
      instructionRegister: 0
    },
    afterSimple: {
      accumulator: 16,
      programCounter: 4,
      instructionRegister: 10000
    }
  },
  timeouts: {
    splashScreen: 2000,
    cpuOperation: 100,
    programLoad: 500
  }
};