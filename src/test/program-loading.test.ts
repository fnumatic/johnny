import { describe, it, expect } from 'vitest';
import { loadProgram, parseProgramMetadata } from '../lib/engine';

describe('Program Loading with Metadata', () => {
  describe('parseProgramMetadata', () => {
    it('should parse metadata with description', () => {
      const metadata = parseProgramMetadata("RAM:{add two numbers}:V2");
      
      expect(metadata.type).toBe("RAM");
      expect(metadata.description).toBe("add two numbers");
      expect(metadata.version).toBe("V2");
      expect(metadata.raw).toBe("RAM:{add two numbers}:V2");
    });

    it('should parse metadata without description', () => {
      const metadata = parseProgramMetadata("RAM::V1");
      
      expect(metadata.type).toBe("RAM");
      expect(metadata.description).toBeUndefined();
      expect(metadata.version).toBe("V1");
      expect(metadata.raw).toBe("RAM::V1");
    });

    it('should handle empty description braces', () => {
      const metadata = parseProgramMetadata("RAM:{}:V1");
      
      expect(metadata.type).toBe("RAM");
      expect(metadata.description).toBeUndefined();
      expect(metadata.version).toBe("V1");
    });

    it('should throw error for invalid format', () => {
      expect(() => {
        parseProgramMetadata("INVALID_FORMAT");
      }).toThrow('Invalid metadata format');
    });
  });

  describe('loadProgram', () => {
    it('should load semicolon-separated program with metadata', () => {
      const programString = "RAM:{simple test}:V1;1005;2006;10000";
      const result = loadProgram(programString);
      
      expect(result.metadata).not.toBeNull();
      expect(result.metadata?.type).toBe("RAM");
      expect(result.metadata?.description).toBe("simple test");
      expect(result.metadata?.version).toBe("V1");
      
      expect(result.ram[0]).toBe(1005);
      expect(result.ram[1]).toBe(2006);
      expect(result.ram[2]).toBe(10000);
      expect(result.ram[3]).toBe(0); // Rest should be zeros
    });

    it('should load semicolon-separated program without metadata', () => {
      const programString = "1005;2006;10000";
      const result = loadProgram(programString);
      
      expect(result.metadata).toBeNull();
      expect(result.ram[0]).toBe(1005);
      expect(result.ram[1]).toBe(2006);
      expect(result.ram[2]).toBe(10000);
    });

    it('should fall back to multiline format', () => {
      const programString = `1005
2006
10000`;
      const result = loadProgram(programString);
      
      expect(result.metadata).toBeNull();
      expect(result.ram[0]).toBe(1005);
      expect(result.ram[1]).toBe(2006);
      expect(result.ram[2]).toBe(10000);
    });

    it('should handle invalid semicolon values gracefully', () => {
      const programString = "RAM:{test}:V1;1005;invalid;2006;abc;10000";
      const result = loadProgram(programString);
      
      expect(result.metadata?.type).toBe("RAM");
      expect(result.ram[0]).toBe(1005);
      expect(result.ram[1]).toBe(0); // invalid should become 0
      expect(result.ram[2]).toBe(2006);
      expect(result.ram[3]).toBe(0); // abc should become 0
      expect(result.ram[4]).toBe(10000);
    });

    it('should handle complex description with spaces and special chars', () => {
      const programString = "RAM:{fibonacci calculator v2.1}:V3;1005;2006;10000";
      const result = loadProgram(programString);
      
      expect(result.metadata?.description).toBe("fibonacci calculator v2.1");
      expect(result.metadata?.version).toBe("V3");
    });
  });
});

