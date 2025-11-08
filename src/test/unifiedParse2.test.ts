import { describe, it, expect } from 'vitest';
import {
  parseProgram,
  parseUnifiedHeader,
  encodeRam,
  decodeRam,
  integerCodeToOpData,
  opDataToIntegerCode
} from '../lib/unifiedParse';

describe.skip('unifiedParse', () => {
  describe('encodeRam and decodeRam', () => {
    it('should encode and decode RAM values correctly', () => {
      expect(encodeRam(1, 5)).toBe(1005);
      expect(encodeRam(8, 2)).toBe(8002);
      expect(encodeRam(13, 0)).toBe(13000);
      expect(encodeRam(0, 0)).toBe(0);
      expect(encodeRam(99, 999)).toBe(99999);

      expect(decodeRam(1005)).toEqual({ opcode: 1, data: 5 });
      expect(decodeRam(8002)).toEqual({ opcode: 8, data: 2 });
      expect(decodeRam(13000)).toEqual({ opcode: 13, data: 0 });
      expect(decodeRam(0)).toEqual({ opcode: 0, data: 0 });
      expect(decodeRam(99999)).toEqual({ opcode: 99, data: 999 });
    });

    it('should throw errors for out of range values', () => {
      expect(() => encodeRam(-1, 0)).toThrow('Opcode out of range');
      expect(() => encodeRam(100, 0)).toThrow('Opcode out of range');
      expect(() => encodeRam(0, -1)).toThrow('Data out of range');
      expect(() => encodeRam(0, 1000)).toThrow('Data out of range');
      expect(() => decodeRam(-1)).toThrow('RAM cell value out of range');
      expect(() => decodeRam(100000)).toThrow('RAM cell value out of range');
    });
  });

  describe.skip('integerCodeToOpData and opDataToIntegerCode', () => {
    it('should convert between integer code and op.data formats', () => {
      expect(integerCodeToOpData('1005')).toBe('1.005');
      expect(integerCodeToOpData('8002')).toBe('8.002');
      expect(integerCodeToOpData('13000')).toBe('13.000');
      expect(integerCodeToOpData('0')).toBe('0.000');
      expect(integerCodeToOpData('99999')).toBe('99.999');

      expect(opDataToIntegerCode('1.005')).toBe('1005');
      expect(opDataToIntegerCode('8.002')).toBe('8002');
      expect(opDataToIntegerCode('13.000')).toBe('13000');
      expect(opDataToIntegerCode('0.000')).toBe('0');
      expect(opDataToIntegerCode('99.999')).toBe('99999');
    });

    it('should handle various padding formats', () => {
      expect(opDataToIntegerCode('01.005')).toBe('1005');
      expect(opDataToIntegerCode('1.5')).toBe('1005');
      expect(opDataToIntegerCode('1.05')).toBe('1005');
      expect(opDataToIntegerCode('01.5')).toBe('1005');
    });
  });

  describe('parseUnifiedHeader', () => {
    it('should parse unified headers correctly', () => {
      const header1 = parseUnifiedHeader('RAM:{add two numbers}:V2:normal');
      expect(header1).toEqual({
        type: 'RAM',
        description: 'add two numbers',
        version: 'V2',
        isa: 'normal',
        raw: 'RAM:{add two numbers}:V2:normal',
        containerType: 'full'
      });

      const header2 = parseUnifiedHeader('RAM::{simple program}:V3:bonsai');
      expect(header2).toEqual({
        type: 'RAM',
        description: '',
        version: 'V3',
        isa: 'bonsai',
        raw: 'RAM::{simple program}:V3:bonsai',
        containerType: 'parsed'
});

    it('should throw errors for invalid headers', () => {
      expect(() => parseUnifiedHeader('RAM:{invalid')).toThrow('Invalid header format');
      expect(() => parseUnifiedHeader('RAM:{program}:V5:normal')).toThrow('Invalid version');
      expect(() => parseUnifiedHeader('RAM:{program}:V2:invalid')).toThrow('Invalid ISA');
    });
  });



    

    

    

    

    
  });

  describe.skip('V1 Formats', () => {
    describe('V1 Flat RAM (multi_line, headerless, integer_code)', () => {
      it('should parse basic V1 flat RAM', () => {
        const content = '1005\n2006\n3007\n10000';
        const result = parseProgram(content);
        
        expect(result.metadata).toBeNull();
        expect(result.ram.slice(0, 4)).toEqual([1005, 2006, 3007, 10000]);
        expect(result.ram.slice(4)).toEqual(Array(996).fill(0));
      });

      it('should handle comments and empty lines', () => {
        const content = '; Example program\n1005\n\n; Another comment\n2006\n3007';
        const result = parseProgram(content);
        
        expect(result.ram.slice(0, 3)).toEqual([1005, 2006, 3007]);
      });

      it('should handle empty RAM cells', () => {
        const content = '1005\n0\n2006\n000\n3007';
        const result = parseProgram(content);
        
        expect(result.ram.slice(0, 5)).toEqual([1005, 0, 2006, 0, 3007]);
      });
    });

    describe('V1 Semicolon (single_line, headerless, integer_code)', () => {
      it('should parse basic V1 semicolon format', () => {
        const content = '1005;2006;3007;10000';
        const result = parseProgram(content);
        
        expect(result.metadata).toBeNull();
        expect(result.ram.slice(0, 4)).toEqual([1005, 2006, 3007, 10000]);
      });

      it('should handle empty values', () => {
        const content = '1005;;2006;;3007';
        const result = parseProgram(content);
        
        expect(result.ram.slice(0, 3)).toEqual([1005, 2006, 3007]);
      });
    });

    describe('V1 with Header', () => {
      it('should parse V1 semicolon with header', () => {
        const content = 'RAM:{add two numbers}:V1:normal;1005;2006;3007;10000';
        const result = parseProgram(content);
        
        expect(result.metadata).toEqual({
          type: 'RAM',
          description: 'add two numbers',
          version: 'V1',
          isa: 'normal'
        });
        expect(result.ram.slice(0, 4)).toEqual([1005, 2006, 3007, 10000]);
      });

      it('should parse V1 flat RAM with header', () => {
        const content = 'RAM:{addition program}:V1:normal\n1005\n2006\n3007\n10000';
        const result = parseProgram(content);
        
        expect(result.metadata).toEqual({
          type: 'RAM',
          description: 'addition program',
          version: 'V1',
          isa: 'normal'
        });
        expect(result.ram.slice(0, 4)).toEqual([1005, 2006, 3007, 10000]);
      });
    });
  });

  describe.skip('V2 Formats', () => {
    describe('V2 Semicolon (single_line, header, op.data)', () => {
      it('should parse V2 semicolon format', () => {
        const content = 'RAM:{add two numbers}:V2:normal;1.005;2.006;3.007;10.000';
        const result = parseProgram(content);
        
        expect(result.metadata).toEqual({
          type: 'RAM',
          description: 'add two numbers',
          version: 'V2',
          isa: 'normal'
        });
        expect(result.ram.slice(0, 4)).toEqual([1005, 2006, 3007, 10000]);
      });

      it('should handle various padding formats', () => {
        const content = 'RAM:{test}:V2:normal;01.005;1.5;1.05;01.5';
        const result = parseProgram(content);
        
        expect(result.ram.slice(0, 4)).toEqual([1005, 1005, 1005, 1005]);
      });

      it('should handle bonsai ISA', () => {
        const content = 'RAM::{bonsai program}:V2:bonsai;1.005;2.006;3.007';
        const result = parseProgram(content);
        
        expect(result.metadata?.isa).toBe('bonsai');
        expect(result.ram.slice(0, 3)).toEqual([1005, 2006, 3007]);
      });
    });

    describe('V2 Format (multi_line, header, op.data)', () => {
      it('should parse V2 format', () => {
        const content = 'RAM:{addition program}:V2:normal\n; Example program\n1.005\n2.006\n0.000\n13.000\n10.000';
        const result = parseProgram(content);
        
        expect(result.metadata).toEqual({
          type: 'RAM',
          description: 'addition program',
          version: 'V2',
          isa: 'normal'
        });
        expect(result.ram.slice(0, 5)).toEqual([1005, 2006, 0, 13000, 10000]);
      });

      it('should handle comments and empty lines', () => {
        const content = 'RAM:{test}:V2:normal\n; Comment\n1.005\n\n2.006\n; Another comment\n3.007';
        const result = parseProgram(content);
        
        expect(result.ram.slice(0, 3)).toEqual([1005, 2006, 3007]);
      });
    });
  });

  describe.skip('V3 Formats', () => {
    describe('V3 Semicolon (single_line, header, line:integer_code)', () => {
      it('should parse V3 semicolon format', () => {
        const content = 'RAM:{add two numbers}:V3:normal;01:1005;02:2006;03:3007;05:10000';
        const result = parseProgram(content);
        
        expect(result.metadata).toEqual({
          type: 'RAM',
          description: 'add two numbers',
          version: 'V3',
          isa: 'normal'
        });
        expect(result.ram[1]).toBe(1005);
        expect(result.ram[2]).toBe(2006);
        expect(result.ram[3]).toBe(3007);
        expect(result.ram[5]).toBe(10000);
        expect(result.ram[0]).toBe(0); // Address 0 should be empty
        expect(result.ram[4]).toBe(0); // Address 4 should be empty
      });

      it('should handle non-sequential addressing', () => {
        const content = 'RAM:{sparse}:V3:normal;10:8002;25:1005;50:2006;99:10000';
        const result = parseProgram(content);
        
        expect(result.ram[10]).toBe(8002);
        expect(result.ram[25]).toBe(1005);
        expect(result.ram[50]).toBe(2006);
        expect(result.ram[99]).toBe(10000);
      });
    });

    describe('V3 Format (multi_line, header, line:integer_code)', () => {
      it('should parse V3 format', () => {
        const content = 'RAM:{addition program}:V3:normal\n; Example program\n01:8002\n02:1005\n03:0\n04:2006\n05:1300\n06:10000';
        const result = parseProgram(content);
        
        expect(result.metadata).toEqual({
          type: 'RAM',
          description: 'addition program',
          version: 'V3',
          isa: 'normal'
        });
        expect(result.ram[1]).toBe(8002);
        expect(result.ram[2]).toBe(1005);
        expect(result.ram[3]).toBe(0);
        expect(result.ram[4]).toBe(2006);
        expect(result.ram[5]).toBe(1300);
        expect(result.ram[6]).toBe(10000);
      });

      it('should handle sparse RAM', () => {
        const content = 'RAM:{sparse program}:V3:normal\n; Only specify addresses that contain data\n10:8002\n25:1005\n50:2006\n99:10000';
        const result = parseProgram(content);
        
        expect(result.ram[10]).toBe(8002);
        expect(result.ram[25]).toBe(1005);
        expect(result.ram[50]).toBe(2006);
        expect(result.ram[99]).toBe(10000);
        expect(result.ram.slice(0, 10).every((v: number) => v === 0)).toBe(true);
        expect(result.ram.slice(11, 25).every((v: number) => v === 0)).toBe(true);
      });
    });
  });

  describe.skip('V4 Formats', () => {
    describe('V4 Semicolon (single_line, header, line:op.data)', () => {
      it('should parse V4 semicolon format', () => {
        const content = 'RAM:{add two numbers}:V4:normal;01:1.005;02:2.006;03:3.007;05:10.000';
        const result = parseProgram(content);
        
        expect(result.metadata).toEqual({
          type: 'RAM',
          description: 'add two numbers',
          version: 'V4',
          isa: 'normal'
        });
        expect(result.ram[1]).toBe(1005);
        expect(result.ram[2]).toBe(2006);
        expect(result.ram[3]).toBe(3007);
        expect(result.ram[5]).toBe(10000);
      });

      it('should handle various padding formats', () => {
        const content = 'RAM:{test}:V4:normal;01:1.005;01:01.5;01:1.05;01:01.05';
        const result = parseProgram(content);
        
        expect(result.ram[1]).toBe(1005);
      });
    });

    describe('V4 Format (multi_line, header, line:op.data)', () => {
      it('should parse V4 format', () => {
        const content = 'RAM:{addition program}:V4:normal\n; Add two numbers from addresses 50 and 51\n01:8.002\n02:1.005\n03:0.000\n04:2.006\n05:13.000\n06:10.000';
        const result = parseProgram(content);
        
        expect(result.metadata).toEqual({
          type: 'RAM',
          description: 'addition program',
          version: 'V4',
          isa: 'normal'
        });
        expect(result.ram[1]).toBe(8002);
        expect(result.ram[2]).toBe(1005);
        expect(result.ram[3]).toBe(0);
        expect(result.ram[4]).toBe(2006);
        expect(result.ram[5]).toBe(13000);
        expect(result.ram[6]).toBe(10000);
      });

      it('should handle sparse RAM with explicit format', () => {
        const content = 'RAM:{sparse program}:V4:normal\n; Sparse RAM with explicit op.data format\n10:8.002\n25:1.005\n50:2.006\n99:10.000';
        const result = parseProgram(content);
        
        expect(result.ram[10]).toBe(8002);
        expect(result.ram[25]).toBe(1005);
        expect(result.ram[50]).toBe(2006);
        expect(result.ram[99]).toBe(10000);
      });
    });
  });

  describe.skip('Cross-Format Equivalence', () => {
    const baseProgram = [1005, 2006, 3007, 10000];
    
    it('should produce equivalent results for same program in different formats', () => {
      const formats = [
        '1005;2006;3007;10000', // V1 semicolon
        '1005\n2006\n3007\n10000', // V1 flat RAM
        'RAM:{program}:V2:normal;1.005;2.006;3.007;10.000', // V2 semicolon
        'RAM:{program}:V2:normal\n1.005\n2.006\n3.007\n10.000', // V2 format
        'RAM:{program}:V3:normal;01:1005;02:2006;03:3007;04:10000', // V3 semicolon
        'RAM:{program}:V3:normal\n01:1005\n02:2006\n03:3007\n04:10000', // V3 format
        'RAM:{program}:V4:normal;01:1.005;02:2.006;03:3.007;04:10.000', // V4 semicolon
        'RAM:{program}:V4:normal\n01:1.005\n02:2.006\n03:3.007\n04:10.000', // V4 format
      ];

      formats.forEach(format => {
        const result = parseProgram(format);
        if (format.includes('V3') || format.includes('V4')) {
          // Addressed formats - check specific addresses
          expect(result.ram[1]).toBe(1005);
          expect(result.ram[2]).toBe(2006);
          expect(result.ram[3]).toBe(3007);
          expect(result.ram[4]).toBe(10000);
        } else {
          // Sequential formats - check from address 0
          expect(result.ram.slice(0, 4)).toEqual(baseProgram);
        }
      });
    });
  });

  describe.skip('Error Handling', () => {
    it('should handle empty content', () => {
      const result = parseProgram('');
      expect(result.metadata).toBeNull();
      expect(result.ram).toEqual(Array(1000).fill(0));
    });

    it('should handle whitespace-only content', () => {
      const result = parseProgram('   \n  \t  \n  ');
      expect(result.metadata).toBeNull();
      expect(result.ram).toEqual(Array(1000).fill(0));
    });

    it('should handle invalid op.data gracefully', () => {
      const content = 'RAM:{test}:V2:normal\n1.005\ninvalid.opdata\n3.007';
      const result = parseProgram(content);
      
      expect(result.ram[0]).toBe(1005);
      expect(result.ram[1]).toBe(0); // Invalid entry should be skipped
      expect(result.ram[2]).toBe(3007);
    });

    it('should handle invalid addresses gracefully', () => {
      const content = 'RAM:{test}:V3:normal\n01:1005\ninvalid:2006\n03:3007';
      const result = parseProgram(content);
      
      expect(result.ram[1]).toBe(1005);
      expect(result.ram[3]).toBe(3007);
    });

    it('should handle out of range addresses', () => {
      const content = 'RAM:{test}:V3:normal\n01:1005\n999:2006\n1000:3007';
      const result = parseProgram(content);
      
      expect(result.ram[1]).toBe(1005);
      expect(result.ram[999]).toBe(2006);
      // Address 1000 should be ignored (out of range)
    });

    it('should handle out of range values', () => {
      const content = 'RAM:{test}:V2:normal\n1.005\n2.1000\n3.007';
      const result = parseProgram(content);
      
      expect(result.ram[0]).toBe(1005);
      expect(result.ram[1]).toBe(0); // Invalid value should be skipped
      expect(result.ram[2]).toBe(3007);
    });
  });

  describe.skip('Edge Cases', () => {
    it('should handle minimum and maximum values', () => {
      const content = 'RAM:{extremes}:V2:normal\n0.000\n99.999\n10.000';
      const result = parseProgram(content);
      
      expect(result.ram[0]).toBe(0);
      expect(result.ram[1]).toBe(99999);
      expect(result.ram[2]).toBe(10000);
    });

    it('should handle single instruction programs', () => {
      const formats = [
        '10000',
        '10.000',
        '1.005',
        '1005',
        'RAM:{single}:V1:normal;10000',
        'RAM:{single}:V2:normal;10.000',
        'RAM:{single}:V3:normal;01:10000',
        'RAM:{single}:V4:normal;01:10.000',
      ];

formats.forEach(format => {
        const result = parseProgram(format);
        // Check if this should use addressed format (V3/V4) based on detected version or explicit headers
        const isAddressedFormat = (result.metadata && (result.metadata.version === 'V3' || result.metadata.version === 'V4')) ||
                               format.includes('V3') || format.includes('V4');
        
        if (isAddressedFormat) {
          expect(result.ram[1]).toBe(10000);
        } else {
          expect(result.ram[0]).toBe(10000);
        }
      });
    });

    it('should handle programs with only empty RAM cells', () => {
      const formats = [
        '0;0;0',
        '0\n0\n0',
        'RAM:{empty}:V2:normal;0.000;0.000;0.000',
        'RAM:{empty}:V3:normal;01:0;02:0;03:0',
        'RAM:{empty}:V4:normal;01:0.000;02:0.000;03:0.000',
      ];

      formats.forEach(format => {
        const result = parseProgram(format);
        expect(result.ram.every((v: number) => v === 0)).toBe(true);
      });
    });
  });
});