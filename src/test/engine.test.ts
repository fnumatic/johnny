import { describe, it, expect } from 'vitest'
import {
  bonsaiMC,
  normalMC,
  parseMicrocode,
  generateOpcodeMapping,
  RAM_SIZE,
  RAM_CELL_OPCODE_DIGITS,
  RAM_CELL_DATA_DIGITS,
  RAM_CELL_TOTAL_DIGITS,
  extractOpcode,
  extractData,
  encodeRam,
  decodeRam,
  toVec
} from '../lib/engine'

describe('Engine - RAM Configuration', () => {
  it('should have RAM_SIZE set to 1000', () => {
    expect(RAM_SIZE).toBe(1000)
  })

  it('should have correct RAM cell structure constants', () => {
    expect(RAM_CELL_OPCODE_DIGITS).toBe(2)
    expect(RAM_CELL_DATA_DIGITS).toBe(3)
    expect(RAM_CELL_TOTAL_DIGITS).toBe(5)
  })
})

describe('Engine - RAM Cell Structure', () => {
  it('should extract opcode from RAM cell correctly', () => {
    expect(extractOpcode(12000)).toBe(12)
    expect(extractOpcode(5000)).toBe(5) // 5000 = opcode 5, data 0
    expect(extractOpcode(99000)).toBe(99) // Max 2-digit opcode
  })

  it('should extract data from RAM cell correctly', () => {
    expect(extractData(12000)).toBe(0)
    expect(extractData(12345)).toBe(345)
    expect(extractData(5000)).toBe(0) // 5000 = opcode 5, data 0
  })

  it('should create RAM cell from opcode and data correctly', () => {
    expect(encodeRam(12, 0)).toBe(12000)
    expect(encodeRam(5, 123)).toBe(5123) // Single digit opcode: 5 * 1000 + 123 = 5123
    expect(encodeRam(1, 42)).toBe(1042) // Single digit opcode: 1 * 1000 + 42 = 1042
  })

  it('should round-trip opcode and data extraction', () => {
    const opcode = 12
    const data = 345
    const cell = encodeRam(opcode, data)
    expect(extractOpcode(cell)).toBe(opcode)
    expect(extractData(cell)).toBe(data)
  })
})

describe('Engine - Microcode Parsing', () => {
  describe('parseMicrocode', () => {
    it('should parse bonsai microcode correctly', () => {
      const result = parseMicrocode(bonsaiMC, 6)
      expect(result.instructions).toHaveLength(6) // 6 macro instructions (FETCH, INC, DEC, JMP, TST, HLT)
      expect(result.instructions[0]).toHaveLength(10) // Each macro instruction has 10 microcodes
      expect(result.instructions[0]).toEqual([8, 2, 3, 5, 0, 0, 0, 0, 0, 0]) // First macro instruction (FETCH)
      expect(result.operations).toHaveLength(6) // FETCH is now included
      expect(result.operations).toEqual(['FETCH', 'INC', 'DEC', 'JMP', 'TST', 'HLT'])
    })

    it('should parse normal microcode correctly', () => {
      const result = parseMicrocode(normalMC, 11)
      expect(result.instructions).toHaveLength(11) // 11 macro instructions (FETCH, TAKE, ADD, SUB, SAVE, JMP, TST, INC, DEC, NULL, HLT)
      expect(result.instructions[0]).toHaveLength(10) // Each macro instruction has 10 microcodes
      expect(result.instructions[0]).toEqual([8, 2, 3, 5, 0, 0, 0, 0, 0, 0]) // First macro instruction (FETCH)
      expect(result.operations).toHaveLength(11) // FETCH is now included
      expect(result.operations).toEqual(['FETCH', 'TAKE', 'ADD', 'SUB', 'SAVE', 'JMP', 'TST', 'INC', 'DEC', 'NULL', 'HLT'])
    })

    it('should auto-detect bonsai microcode when opcodeCount is not provided', () => {
      const result = parseMicrocode(bonsaiMC)
      expect(result.instructions).toHaveLength(6)
      expect(result.instructions[0]).toHaveLength(10)
      expect(result.operations).toHaveLength(6)
    })

    it('should auto-detect normal microcode when opcodeCount is not provided', () => {
      const result = parseMicrocode(normalMC)
      expect(result.instructions).toHaveLength(11)
      expect(result.instructions[0]).toHaveLength(10)
      expect(result.operations).toHaveLength(11)
    })

    it('should use fallback opcode count for unknown microcode', () => {
      const customMC = "1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;FETCH;TAKE;ADD;SUB;SAVE;JMP;TST;INC;DEC;NULL;HLT"
      const result = parseMicrocode(customMC)
      expect(result.instructions).toHaveLength(2) // 20 numbers / 10 = 2 macro instructions
      expect(result.instructions[0]).toHaveLength(10)
      expect(result.operations).toHaveLength(11) // FETCH is included
    })

    it('should handle custom opcode count', () => {
      const customMC = "1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;FETCH;TAKE;ADD"
      const result = parseMicrocode(customMC, 3)
      expect(result.instructions).toHaveLength(2) // 15 numbers = 1 complete + 1 partial macro instruction
      expect(result.instructions[0]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      expect(result.instructions[1]).toEqual([11, 12, 13, 14, 15, 0, 0, 0, 0, 0]) // Padded with zeros
      expect(result.operations).toHaveLength(3) // FETCH is included
      expect(result.operations).toEqual(['FETCH', 'TAKE', 'ADD'])
    })
  })

  describe('generateOpcodeMapping', () => {
    it('should generate correct opcode mapping for bonsai operations', () => {
      const operations = ['FETCH', 'INC', 'DEC', 'JMP', 'TST', 'HLT']
      const mapping = generateOpcodeMapping(operations)
      
      expect(mapping).toEqual({
        '00': 'FETCH',
        '01': 'INC',
        '02': 'DEC',
        '03': 'JMP',
        '04': 'TST',
        '05': 'HLT'
      })
    })

    it('should generate correct opcode mapping for normal operations', () => {
      const operations = ['FETCH', 'TAKE', 'ADD', 'SUB', 'SAVE', 'JMP', 'TST', 'INC', 'DEC', 'NULL', 'HLT']
      const mapping = generateOpcodeMapping(operations)
      
      expect(mapping).toEqual({
        '00': 'FETCH',
        '01': 'TAKE',
        '02': 'ADD',
        '03': 'SUB',
        '04': 'SAVE',
        '05': 'JMP',
        '06': 'TST',
        '07': 'INC',
        '08': 'DEC',
        '09': 'NULL',
        '10': 'HLT'
      })
    })

    it('should handle empty operations array', () => {
      const mapping = generateOpcodeMapping([])
      expect(mapping).toEqual({})
    })
  })



  describe('Pre-parsed microcode constants', () => {
    it('should have correct bonsai microcode structure', () => {
      const bonsaiMicrocode = parseMicrocode(bonsaiMC, 6)
      expect(bonsaiMicrocode.instructions).toHaveLength(6) // 6 macro instructions including FETCH
      expect(bonsaiMicrocode.instructions[0]).toHaveLength(10) // Each has 10 microcodes
      expect(bonsaiMicrocode.operations).toEqual(['FETCH', 'INC', 'DEC', 'JMP', 'TST', 'HLT'])
    })

    it('should have correct normal microcode structure', () => {
      const normalMicrocode = parseMicrocode(normalMC, 11)
      expect(normalMicrocode.instructions).toHaveLength(11) // 11 macro instructions including FETCH
      expect(normalMicrocode.instructions[0]).toHaveLength(10) // Each has 10 microcodes
      expect(normalMicrocode.operations).toEqual(['FETCH', 'TAKE', 'ADD', 'SUB', 'SAVE', 'JMP', 'TST', 'INC', 'DEC', 'NULL', 'HLT'])
    })
  })
})

describe('Engine - Microcode String Constants', () => {
  it('should have valid bonsai microcode string', () => {
    expect(bonsaiMC).toBeTypeOf('string')
    expect(bonsaiMC.split(';')).toHaveLength(206) // 200 instructions + 6 operations
  })

  it('should have valid normal microcode string', () => {
    expect(normalMC).toBeTypeOf('string')
    expect(normalMC.split(';')).toHaveLength(211) // 200 instructions + 11 operations
  })

    
})

describe('Engine - Edge Cases and Error Handling', () => {
  it('should handle malformed microcode string', () => {
    const malformedMC = "1;2;3;invalid;5;6;7;8;9;10;FETCH;TAKE"
    const result = parseMicrocode(malformedMC, 2)
    // The function filters out NaN values, so we check if it handles the error gracefully
    expect(result.instructions.length).toBeGreaterThan(0)
    expect(result.instructions[0]).toHaveLength(10) // Each macro instruction has 10 microcodes
    expect(result.operations).toHaveLength(2) // FETCH and TAKE are included
  })

  it('should handle empty microcode string', () => {
    const emptyMC = ""
    const result = parseMicrocode(emptyMC, 0)
    // When opcodeCount is 0, slice(0, -0) returns the entire array
    // Empty string split by ';' gives [''] (one empty element)
    expect(result.instructions).toHaveLength(0) // No instructions when empty
    expect(result.operations).toHaveLength(0)
  })

  it('should handle microcode with only instructions', () => {
    const onlyInstrMC = "1;2;3;4;5;6;7;8;9;10;11;12;13;14;15"
    const result = parseMicrocode(onlyInstrMC, 0)
    // When opcodeCount is 0, slice(0, -0) returns the entire array
    expect(result.instructions).toHaveLength(0) // No macro instructions when opcodeCount is 0
    expect(result.operations).toHaveLength(0)
  })

  it('should handle single operation', () => {
    const mapping = generateOpcodeMapping(['TAKE'])
    expect(mapping).toEqual({ '00': 'TAKE' })
  })

  it('should handle operations with special characters', () => {
    const mapping = generateOpcodeMapping(['TAKE-OP', 'ADD_OP'])
    expect(mapping).toEqual({
      '00': 'TAKE-OP',
      '01': 'ADD_OP'
    })
  })

  it('should handle duplicate operations', () => {
    const mapping = generateOpcodeMapping(['TAKE', 'TAKE', 'ADD'])
    expect(mapping).toEqual({
      '00': 'TAKE',
      '01': 'TAKE',
      '02': 'ADD'
    })
  })
})

describe('Engine - Integration Tests', () => {
  const bonsaiMicrocode=parseMicrocode(bonsaiMC,6)
  const normalMicrocode=parseMicrocode(normalMC,11)

  it('should generate consistent opcode mappings with FETCH included', () => {
    const bonsaiMapping = generateOpcodeMapping(bonsaiMicrocode.operations)
    const normalMapping = generateOpcodeMapping(normalMicrocode.operations)
    
    expect(bonsaiMapping['00']).toBe('FETCH')
    expect(normalMapping['00']).toBe('FETCH')
  })

  it('should have correct number of operations for each microcode type', () => {
    expect(bonsaiMicrocode.operations).toHaveLength(6) // Including FETCH
    expect(normalMicrocode.operations).toHaveLength(11) // Including FETCH
  })

  it('should have correct instruction count for each microcode type', () => {
    expect(bonsaiMicrocode.instructions).toHaveLength(6) // 6 macro instructions including FETCH
    expect(normalMicrocode.instructions).toHaveLength(11) // 11 macro instructions including FETCH
  })

  it('should have correct microcode structure for each macro instruction', () => {
    // Each macro instruction should have exactly 10 microcode numbers
    bonsaiMicrocode.instructions.forEach((macroInstruction) => {
      expect(macroInstruction).toHaveLength(10)
    })
    
    normalMicrocode.instructions.forEach((macroInstruction) => {
      expect(macroInstruction).toHaveLength(10)
    })
  })
}) 
describe('Engine - RAM Cell Parsing', () => {

  it('should decode all bonsai microcode operations correctly', () => {
    const microCode = parseMicrocode(bonsaiMC, 6)
    const inc = encodeRam(1, 123)
    const dec = encodeRam(2, 456)
    const jmp = encodeRam(3, 789)
    const tst = encodeRam(4, 234)
    const hlt = encodeRam(5, 567)
    expect(toVec(decodeRam(inc, microCode))).toStrictEqual(['INC', 123])
    expect(toVec(decodeRam(dec, microCode))).toStrictEqual(['DEC', 456])
    expect(toVec(decodeRam(jmp, microCode))).toStrictEqual(['JMP', 789])
    expect(toVec(decodeRam(tst, microCode))).toStrictEqual(['TST', 234])
    expect(toVec(decodeRam(hlt, microCode))).toStrictEqual(['HLT', 567])
  })

  it('should decode all normal microcode operations correctly', () => {
    const microCode = parseMicrocode(normalMC, 11)
    const take = encodeRam(1, 123)
    const add = encodeRam(2, 456)
    const sub = encodeRam(3, 789)
    const save = encodeRam(4, 234)
    const jmp = encodeRam(5, 567)
    const tst = encodeRam(6, 890)
    const inc = encodeRam(7, 345)
    const dec = encodeRam(8, 678)
    const null_ = encodeRam(9, 901)
    const hlt = encodeRam(10, 432)
    expect(toVec(decodeRam(take, microCode))).toStrictEqual(['TAKE', 123])
    expect(toVec(decodeRam(add, microCode))).toStrictEqual(['ADD', 456])
    expect(toVec(decodeRam(sub, microCode))).toStrictEqual(['SUB', 789])
    expect(toVec(decodeRam(save, microCode))).toStrictEqual(['SAVE', 234])
    expect(toVec(decodeRam(jmp, microCode))).toStrictEqual(['JMP', 567])
    expect(toVec(decodeRam(tst, microCode))).toStrictEqual(['TST', 890])
    expect(toVec(decodeRam(inc, microCode))).toStrictEqual(['INC', 345])
    expect(toVec(decodeRam(dec, microCode))).toStrictEqual(['DEC', 678])
    expect(toVec(decodeRam(null_, microCode))).toStrictEqual(['NULL', 901])
    expect(toVec(decodeRam(hlt, microCode))).toStrictEqual(['HLT', 432])
  })

  it('should handle unknown opcode', () => {
    const microCode = parseMicrocode(normalMC, 11)
    const cell = encodeRam(99, 123) // Unknown opcode
    const opdata = decodeRam(cell, microCode)
    expect(toVec(opdata)).toStrictEqual(['', 123])
  })

  it('should handle zero data', () => {
    const microCode = parseMicrocode(normalMC, 11)
    const cell = encodeRam(2, 0)
    const opdata = decodeRam(cell, microCode)
    expect(toVec(opdata)).toStrictEqual(['ADD', 0])
  })

  it('should handle maximum 3-digit data', () => {
    const microCode = parseMicrocode(normalMC, 11)
    const cell = encodeRam(3, 999)
    const opdata = decodeRam(cell, microCode)
    expect(toVec(opdata)).toStrictEqual(['SUB', 999])
  })
})