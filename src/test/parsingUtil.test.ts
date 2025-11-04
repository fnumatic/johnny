import { describe, it, expect } from 'vitest';
import { checkValidFormat, parseInputResult } from '../lib/parsingUtil';

describe('parsingUtil - checkValidFormat', () => {
  describe('valid formats', () => {
    it('should accept empty string', () => {
      expect(checkValidFormat('')).toBe(true);
    });

    it('should accept single digit', () => {
      expect(checkValidFormat('1')).toBe(true);
      expect(checkValidFormat('5')).toBe(true);
      expect(checkValidFormat('9')).toBe(true);
    });

    it('should accept two digits', () => {
      expect(checkValidFormat('01')).toBe(true);
      expect(checkValidFormat('12')).toBe(true);
      expect(checkValidFormat('99')).toBe(true);
    });

    it('should accept dot followed by single digit', () => {
      expect(checkValidFormat('.1')).toBe(true);
      expect(checkValidFormat('.5')).toBe(true);
      expect(checkValidFormat('.9')).toBe(true);
    });

    it('should accept dot followed by two digits', () => {
      expect(checkValidFormat('.01')).toBe(true);
      expect(checkValidFormat('.12')).toBe(true);
      expect(checkValidFormat('.99')).toBe(true);
    });

    it('should accept dot followed by three digits', () => {
      expect(checkValidFormat('.001')).toBe(true);
      expect(checkValidFormat('.123')).toBe(true);
      expect(checkValidFormat('.999')).toBe(true);
    });

    it('should accept single digit with dot and single digit', () => {
      expect(checkValidFormat('1.1')).toBe(true);
      expect(checkValidFormat('5.5')).toBe(true);
      expect(checkValidFormat('9.9')).toBe(true);
    });

    it('should accept single digit with dot and two digits', () => {
      expect(checkValidFormat('1.01')).toBe(true);
      expect(checkValidFormat('5.12')).toBe(true);
      expect(checkValidFormat('9.99')).toBe(true);
    });

    it('should accept single digit with dot and three digits', () => {
      expect(checkValidFormat('1.001')).toBe(true);
      expect(checkValidFormat('5.123')).toBe(true);
      expect(checkValidFormat('9.999')).toBe(true);
    });

    it('should accept two digits with dot and single digit', () => {
      expect(checkValidFormat('01.1')).toBe(true);
      expect(checkValidFormat('12.5')).toBe(true);
      expect(checkValidFormat('99.9')).toBe(true);
    });

    it('should accept two digits with dot and two digits', () => {
      expect(checkValidFormat('01.01')).toBe(true);
      expect(checkValidFormat('12.12')).toBe(true);
      expect(checkValidFormat('99.99')).toBe(true);
    });

    it('should accept two digits with dot and three digits', () => {
      expect(checkValidFormat('01.001')).toBe(true);
      expect(checkValidFormat('12.123')).toBe(true);
      expect(checkValidFormat('99.999')).toBe(true);
    });
  });

  describe('invalid formats', () => {
    it('should reject letters', () => {
      expect(checkValidFormat('a')).toBe(false);
      expect(checkValidFormat('abc')).toBe(false);
      expect(checkValidFormat('1a')).toBe(false);
      expect(checkValidFormat('a1')).toBe(false);
    });

    it('should reject special characters', () => {
      expect(checkValidFormat('!')).toBe(false);
      expect(checkValidFormat('@')).toBe(false);
      expect(checkValidFormat('#')).toBe(false);
      expect(checkValidFormat('1!')).toBe(false);
    });

    it('should reject multiple dots', () => {
      expect(checkValidFormat('1.2.3')).toBe(false);
      expect(checkValidFormat('..')).toBe(false);
      expect(checkValidFormat('1..2')).toBe(false);
    });

    it('should reject leading zeros in wrong context', () => {
      expect(checkValidFormat('001')).toBe(false);
      expect(checkValidFormat('001.1')).toBe(false);
    });

    it('should reject more than three digits after dot', () => {
      expect(checkValidFormat('1.1234')).toBe(false);
      expect(checkValidFormat('01.1234')).toBe(false);
    });

    it('should reject more than two digits before dot', () => {
      expect(checkValidFormat('123.1')).toBe(false);
      expect(checkValidFormat('123.12')).toBe(false);
    });

    it('should reject whitespace', () => {
      expect(checkValidFormat(' ')).toBe(false);
      expect(checkValidFormat(' 1')).toBe(false);
      expect(checkValidFormat('1 ')).toBe(false);
      expect(checkValidFormat(' 1.2 ')).toBe(false);
    });
  });
});

describe('parsingUtil - parseInputResult', () => {
  const mockOpcodeMapping = {
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
  };

  describe('empty input', () => {
    it('should return invalid result for empty string', () => {
      const result = parseInputResult('', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '',
        data: '',
        operationName: '',
        isValid: false
      });
    });

    it('should return invalid result for whitespace only', () => {
      const result = parseInputResult('   ', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '',
        data: '',
        operationName: '',
        isValid: false
      });
    });
  });

  describe('single number input', () => {
    it('should parse single digit correctly', () => {
      const result = parseInputResult('1', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '01',
        data: '000',
        operationName: 'TAKE',
        isValid: true
      });
    });

    it('should parse two digits correctly', () => {
      const result = parseInputResult('02', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '02',
        data: '000',
        operationName: 'ADD',
        isValid: true
      });
    });

    it('should handle unknown opcode', () => {
      const result = parseInputResult('99', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '99',
        data: '000',
        operationName: 'UNKNOWN',
        isValid: true
      });
    });
  });

  describe('opcode.data format', () => {
    it('should parse opcode.data format correctly', () => {
      const result = parseInputResult('01.005', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '01',
        data: '005',
        operationName: 'TAKE',
        isValid: true
      });
    });

    it('should pad opcode to two digits', () => {
      const result = parseInputResult('1.005', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '01',
        data: '005',
        operationName: 'TAKE',
        isValid: true
      });
    });

    it('should pad data to three digits', () => {
      const result = parseInputResult('01.5', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '01',
        data: '500',
        operationName: 'TAKE',
        isValid: true
      });
    });

    it('should handle single digit data', () => {
      const result = parseInputResult('02.1', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '02',
        data: '100',
        operationName: 'ADD',
        isValid: true
      });
    });

    it('should handle two digit data', () => {
      const result = parseInputResult('03.12', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '03',
        data: '120',
        operationName: 'SUB',
        isValid: true
      });
    });

    it('should handle three digit data', () => {
      const result = parseInputResult('04.123', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '04',
        data: '123',
        operationName: 'SAVE',
        isValid: true
      });
    });

    it('should handle unknown opcode with data', () => {
      const result = parseInputResult('99.123', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '99',
        data: '123',
        operationName: 'UNKNOWN',
        isValid: true
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero opcode', () => {
      const result = parseInputResult('0.123', mockOpcodeMapping, false);
      expect(result).toEqual({
        operation: '00',
        data: '123',
        operationName: 'FETCH',
        isValid: true
      });
    });

    it('should handle zero data', () => {
      const result = parseInputResult('01.0', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '01',
        data: '000',
        operationName: 'TAKE',
        isValid: true
      });
    });

    it('should handle both zero opcode and data', () => {
      const result = parseInputResult('0.0', mockOpcodeMapping, false);
      expect(result).toEqual({
        operation: '00',
        data: '000',
        operationName: 'FETCH',
        isValid: true
      });
    });

    it('should handle large numbers', () => {
      const result = parseInputResult('10.999', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '10',
        data: '999',
        operationName: 'HLT',
        isValid: true
      });
    });
  });

  describe('invalid formats', () => {
    it('should return invalid for malformed input', () => {
      const result = parseInputResult('1.2.3', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '',
        data: '',
        operationName: '',
        isValid: false
      });
    });

    it('should return invalid for missing data part', () => {
      const result = parseInputResult('01.', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '',
        data: '',
        operationName: '',
        isValid: false
      });
    });

    it('should return invalid for missing opcode part', () => {
      const result = parseInputResult('.123', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '',
        data: '',
        operationName: '',
        isValid: false
      });
    });

    it('should return invalid for multiple dots', () => {
      const result = parseInputResult('01.123.456', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '',
        data: '',
        operationName: '',
        isValid: false
      });
    });
  });

  describe('integration with real opcode mapping', () => {
    it('should work with normal microcode operations', () => {
      const normalMapping = {
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
      };

      expect(parseInputResult('01.005', normalMapping)).toEqual({
        operation: '01',
        data: '005',
        operationName: 'TAKE',
        isValid: true
      });

      expect(parseInputResult('02.123', normalMapping)).toEqual({
        operation: '02',
        data: '123',
        operationName: 'ADD',
        isValid: true
      });
    });

    it('should work with bonsai microcode operations', () => {
      const bonsaiMapping = {
        '00': 'FETCH',
        '01': 'INC',
        '02': 'DEC',
        '03': 'JMP',
        '04': 'TST',
        '05': 'HLT'
      };

      expect(parseInputResult('01.005', bonsaiMapping)).toEqual({
        operation: '01',
        data: '005',
        operationName: 'INC',
        isValid: true
      });

      expect(parseInputResult('02.123', bonsaiMapping)).toEqual({
        operation: '02',
        data: '123',
        operationName: 'DEC',
        isValid: true
      });
    });
  });

  describe('hideFetch parameter', () => {
    const mockOpcodeMapping = {
      '00': 'FETCH',
      '01': 'TAKE',
      '02': 'ADD'
    };

    it('should hide FETCH operation name by default (hideFetch=true)', () => {
      const result = parseInputResult('0.123', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '00',
        data: '123',
        operationName: '',
        isValid: true
      });
    });

    it('should hide FETCH operation name when hideFetch is explicitly true', () => {
      const result = parseInputResult('0.123', mockOpcodeMapping, true);
      expect(result).toEqual({
        operation: '00',
        data: '123',
        operationName: '',
        isValid: true
      });
    });

    it('should show FETCH operation name when hideFetch is false', () => {
      const result = parseInputResult('0.123', mockOpcodeMapping, false);
      expect(result).toEqual({
        operation: '00',
        data: '123',
        operationName: 'FETCH',
        isValid: true
      });
    });

    it('should hide FETCH for single number input by default', () => {
      const result = parseInputResult('0', mockOpcodeMapping);
      expect(result).toEqual({
        operation: '00',
        data: '000',
        operationName: '',
        isValid: true
      });
    });

    it('should show FETCH for single number input when hideFetch is false', () => {
      const result = parseInputResult('0', mockOpcodeMapping, false);
      expect(result).toEqual({
        operation: '00',
        data: '000',
        operationName: 'FETCH',
        isValid: true
      });
    });

    it('should not affect other operations when hideFetch is true', () => {
      const result = parseInputResult('01.123', mockOpcodeMapping, true);
      expect(result).toEqual({
        operation: '01',
        data: '123',
        operationName: 'TAKE',
        isValid: true
      });
    });

    it('should not affect other operations when hideFetch is false', () => {
      const result = parseInputResult('02.123', mockOpcodeMapping, false);
      expect(result).toEqual({
        operation: '02',
        data: '123',
        operationName: 'ADD',
        isValid: true
      });
    });
  });
});
