import { describe, it, expect } from 'vitest';
import { parseRamFile, readRamFile } from '../lib/programLoader';

describe('Program Loader', () => {
  describe('parseRamFile', () => {
    it('should parse V2 format with line:code format', () => {
      const content = `V2:2025-01-01:normal
Test program
01:1005
02:2006
03:10000`;

      const result = parseRamFile(content);

      expect(result.metadata).not.toBeNull();
      expect(result.metadata?.version).toBe('V2');
      expect(result.metadata?.date).toBe('2025-01-01');
      expect(result.metadata?.computerType).toBe('normal');
      expect(result.metadata?.comment).toBe('Test program');
      
      expect(result.ram[0]).toBe(0); // Address 00 should be empty
      expect(result.ram[1]).toBe(1005); // Address 01
      expect(result.ram[2]).toBe(2006); // Address 02
      expect(result.ram[3]).toBe(10000); // Address 03
    });

    it('should parse V3 format with line:opcode.data format', () => {
      const content = `V3:2025-01-01:bonsai
Test program
01:1.5
02:2.6
03:10.0`;

      const result = parseRamFile(content);

      expect(result.metadata?.version).toBe('V3');
      expect(result.ram[1]).toBe(1005); // 1.5 becomes 1005
      expect(result.ram[2]).toBe(2006); // 2.6 becomes 2006
      expect(result.ram[3]).toBe(10000); // 10.0 becomes 10000 (10 * 1000 + 0)
    });

    it('should handle sparse addresses correctly', () => {
      const content = `V2:2025-01-01:normal
Test program
05:1005
10:2006`;

      const result = parseRamFile(content);

      expect(result.ram[5]).toBe(1005);
      expect(result.ram[10]).toBe(2006);
      expect(result.ram[0]).toBe(0); // Should remain 0
      expect(result.ram[6]).toBe(0); // Should remain 0
    });

    it('should throw error for invalid program lines', () => {
      const content = `V2:2025-01-01:normal
Test program
01:1005
invalid_line
02:2006`;

      expect(() => parseRamFile(content)).toThrow('Invalid address at line 4: invalid_line');
    });

    it('should throw error for invalid metadata format', () => {
      const content = `INVALID_FORMAT
Test program
01:1005`;

      expect(() => parseRamFile(content)).toThrow('Invalid metadata format');
    });

    it('should throw error for unsupported version', () => {
      const content = `V99:2025-01-01:normal
Test program
01:1005`;

      expect(() => parseRamFile(content)).toThrow('Unsupported version');
    });

    it('should handle empty comment line', () => {
      const content = `V2:2025-01-01:normal
comment
01:1005`;

      const result = parseRamFile(content);

      expect(result.metadata?.comment).toBe('comment');
      expect(result.ram[1]).toBe(1005);
    });
  });

  describe('readRamFile', () => {
    it('should load a valid .ram file', async () => {
      const mockFile = new File(['V2:2025-01-01:normal\nTest\n01:1005'], 'test.ram', {
        type: 'text/plain'
      });

      const result = await readRamFile(mockFile);

      expect(result.metadata?.version).toBe('V2');
      expect(result.ram[1]).toBe(1005);
    });

    it('should propagate parsing errors', async () => {
      const mockFile = new File(['INVALID_FORMAT\nTest\n01:1005'], 'test.ram', {
        type: 'text/plain'
      });

      await expect(readRamFile(mockFile)).rejects.toThrow('Invalid metadata format');
    });

    it('should reject non-.ram files', async () => {
      const mockFile = new File(['V2:2025-01-01:normal\nTest\n01:1005'], 'test.txt', {
        type: 'text/plain'
      });

      await expect(readRamFile(mockFile)).rejects.toThrow('File must have .ram extension');
    });
  });
});