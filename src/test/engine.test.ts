import { describe, it, expect } from 'vitest'
import { 
  encodeRam,
  decodeRam,
  extractOpcode,
  extractData,
  bonsaiMC,
  normalMC,
  parseMicrocode,
  generateOpcodeMapping,
  toVec,
  RAM_SIZE,
  RAM_CELL_OPCODE_DIGITS,
  RAM_CELL_DATA_DIGITS,
  RAM_CELL_TOTAL_DIGITS
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
    expect(encodeRam(12, 0)).toEqual({ ok: true, value: 12000 })
    expect(encodeRam(5, 123)).toEqual({ ok: true, value: 5123 })
    expect(encodeRam(1, 42)).toEqual({ ok: true, value: 1042 })
  })

  it('should round-trip opcode and data extraction', () => {
    const opcode = 12
    const data = 345
    const cellResult = encodeRam(opcode, data)
    expect(cellResult.ok).toBe(true)
    if (cellResult.ok) {
      const cell = cellResult.value
      expect(extractOpcode(cell)).toBe(opcode)
      expect(extractData(cell)).toBe(data)
    }
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
    const incResult = encodeRam(1, 123)
    const decResult = encodeRam(2, 456)
    const jmpResult = encodeRam(3, 789)
    const tstResult = encodeRam(4, 234)
    const hltResult = encodeRam(5, 567)
    
    expect(incResult.ok).toBe(true)
    expect(decResult.ok).toBe(true)
    expect(jmpResult.ok).toBe(true)
    expect(tstResult.ok).toBe(true)
    expect(hltResult.ok).toBe(true)
    
    if (incResult.ok && decResult.ok && jmpResult.ok && 
        tstResult.ok && hltResult.ok) {
      const incDecode = decodeRam(incResult.value, microCode)
      const decDecode = decodeRam(decResult.value, microCode)
      const jmpDecode = decodeRam(jmpResult.value, microCode)
      const tstDecode = decodeRam(tstResult.value, microCode)
      const hltDecode = decodeRam(hltResult.value, microCode)
      
      expect(incDecode.ok).toBe(true)
      expect(decDecode.ok).toBe(true)
      expect(jmpDecode.ok).toBe(true)
      expect(tstDecode.ok).toBe(true)
      expect(hltDecode.ok).toBe(true)
      
      if (incDecode.ok && decDecode.ok && jmpDecode.ok && 
          tstDecode.ok && hltDecode.ok) {
        expect(toVec(incDecode.value)).toStrictEqual(['INC', 123])
        expect(toVec(decDecode.value)).toStrictEqual(['DEC', 456])
        expect(toVec(jmpDecode.value)).toStrictEqual(['JMP', 789])
        expect(toVec(tstDecode.value)).toStrictEqual(['TST', 234])
        expect(toVec(hltDecode.value)).toStrictEqual(['HLT', 567])
      }
    }
  })

  it('should decode all normal microcode operations correctly', () => {
    const microCode = parseMicrocode(normalMC, 11)
    const takeResult = encodeRam(1, 123)
    const addResult = encodeRam(2, 456)
    const subResult = encodeRam(3, 789)
    const saveResult = encodeRam(4, 234)
    const jmpResult = encodeRam(5, 567)
    const tstResult = encodeRam(6, 890)
    const incResult = encodeRam(7, 345)
    const decResult = encodeRam(8, 678)
    const nulResult = encodeRam(9, 901)
    const hltResult = encodeRam(10, 0)
    
    const results = [takeResult, addResult, subResult, saveResult, jmpResult, 
                    tstResult, incResult, decResult, nulResult, hltResult]
    results.forEach(result => expect(result.ok).toBe(true))
    
    if (results.every(r => r.ok)) {
      const takeDecode = decodeRam((takeResult as any).value, microCode)
      const addDecode = decodeRam((addResult as any).value, microCode)
      const subDecode = decodeRam((subResult as any).value, microCode)
      const saveDecode = decodeRam((saveResult as any).value, microCode)
      const jmpDecode = decodeRam((jmpResult as any).value, microCode)
      const tstDecode = decodeRam((tstResult as any).value, microCode)
      const incDecode = decodeRam((incResult as any).value, microCode)
      const decDecode = decodeRam((decResult as any).value, microCode)
      const nulDecode = decodeRam((nulResult as any).value, microCode)
      const hltDecode = decodeRam((hltResult as any).value, microCode)
      
      const decodes = [takeDecode, addDecode, subDecode, saveDecode, jmpDecode,
                     tstDecode, incDecode, decDecode, nulDecode, hltDecode]
      decodes.forEach(decode => expect(decode.ok).toBe(true))
      
      if (decodes.every(d => d.ok)) {
        expect(toVec((takeDecode as any).value)).toStrictEqual(['TAKE', 123])
        expect(toVec((addDecode as any).value)).toStrictEqual(['ADD', 456])
        expect(toVec((subDecode as any).value)).toStrictEqual(['SUB', 789])
        expect(toVec((saveDecode as any).value)).toStrictEqual(['SAVE', 234])
        expect(toVec((jmpDecode as any).value)).toStrictEqual(['JMP', 567])
        expect(toVec((tstDecode as any).value)).toStrictEqual(['TST', 890])
        expect(toVec((incDecode as any).value)).toStrictEqual(['INC', 345])
        expect(toVec((decDecode as any).value)).toStrictEqual(['DEC', 678])
        expect(toVec((nulDecode as any).value)).toStrictEqual(['NULL', 901])
        expect(toVec((hltDecode as any).value)).toStrictEqual(['HLT', 0])
      }
    }
  })

  it('should decode all normal microcode operations correctly', () => {
    const microCode = parseMicrocode(normalMC, 11)
    const takeResult = encodeRam(1, 123)
    const addResult = encodeRam(2, 456)
    const subResult = encodeRam(3, 789)
    const saveResult = encodeRam(4, 234)
    const jmpResult = encodeRam(5, 567)
    const tstResult = encodeRam(6, 890)
    const incResult = encodeRam(7, 345)
    const decResult = encodeRam(8, 678)
    const nullResult = encodeRam(9, 901)
    const hltResult = encodeRam(10, 432)
    
    const results = [takeResult, addResult, subResult, saveResult, jmpResult, 
                    tstResult, incResult, decResult, nullResult, hltResult]
    results.forEach(result => expect(result.ok).toBe(true))
    
    if (results.every(r => r.ok)) {
      const takeData = (takeResult as any).value
      const addData = (addResult as any).value
      const subData = (subResult as any).value
      const saveData = (saveResult as any).value
      const jmpData = (jmpResult as any).value
      const tstData = (tstResult as any).value
      const incData = (incResult as any).value
      const decData = (decResult as any).value
      const nullData = (nullResult as any).value
      const hltData = (hltResult as any).value
      
      const takeDecode = decodeRam(takeData, microCode)
      const addDecode = decodeRam(addData, microCode)
      const subDecode = decodeRam(subData, microCode)
      const saveDecode = decodeRam(saveData, microCode)
      const jmpDecode = decodeRam(jmpData, microCode)
      const tstDecode = decodeRam(tstData, microCode)
      const incDecode = decodeRam(incData, microCode)
      const decDecode = decodeRam(decData, microCode)
      const nullDecode = decodeRam(nullData, microCode)
      const hltDecode = decodeRam(hltData, microCode)
      
      const decodes = [takeDecode, addDecode, subDecode, saveDecode, jmpDecode,
                      tstDecode, incDecode, decDecode, nullDecode, hltDecode]
      decodes.forEach(decode => expect(decode.ok).toBe(true))
      
      if (decodes.every(d => d.ok)) {
        expect(toVec((takeDecode as any).value)).toStrictEqual(['TAKE', 123])
        expect(toVec((addDecode as any).value)).toStrictEqual(['ADD', 456])
        expect(toVec((subDecode as any).value)).toStrictEqual(['SUB', 789])
        expect(toVec((saveDecode as any).value)).toStrictEqual(['SAVE', 234])
        expect(toVec((jmpDecode as any).value)).toStrictEqual(['JMP', 567])
        expect(toVec((tstDecode as any).value)).toStrictEqual(['TST', 890])
        expect(toVec((incDecode as any).value)).toStrictEqual(['INC', 345])
        expect(toVec((decDecode as any).value)).toStrictEqual(['DEC', 678])
        expect(toVec((nullDecode as any).value)).toStrictEqual(['NULL', 901])
        expect(toVec((hltDecode as any).value)).toStrictEqual(['HLT', 432])
      }
    }
  })

  it('should handle unknown opcode', () => {
    const microCode = parseMicrocode(normalMC, 11)
    const cellResult = encodeRam(99, 123) // Unknown opcode
    expect(cellResult.ok).toBe(true)
    if (cellResult.ok) {
      const opdata = decodeRam(cellResult.value, microCode)
      expect(opdata.ok).toBe(true)
      if (opdata.ok) {
        expect(toVec(opdata.value)).toStrictEqual(['', 123])
      }
    }
  })

  it('should handle zero data', () => {
    const microCode = parseMicrocode(normalMC, 11)
    const cellResult = encodeRam(2, 0)
    expect(cellResult.ok).toBe(true)
    if (cellResult.ok) {
      const opdata = decodeRam(cellResult.value, microCode)
      expect(opdata.ok).toBe(true)
      if (opdata.ok) {
        expect(toVec(opdata.value)).toStrictEqual(['ADD', 0])
      }
    }
  })

  it('should handle maximum 3-digit data', () => {
    const microCode = parseMicrocode(normalMC, 11)
    const cellResult = encodeRam(3, 999)
    expect(cellResult.ok).toBe(true)
    if (cellResult.ok) {
      const opdata = decodeRam(cellResult.value, microCode)
      expect(opdata.ok).toBe(true)
      if (opdata.ok) {
        expect(toVec(opdata.value)).toStrictEqual(['SUB', 999])
      }
    }
  })
})