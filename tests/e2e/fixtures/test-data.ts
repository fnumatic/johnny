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