import { describe, it, expect } from 'vitest';
import { str2ram } from '../lib/engine';

describe('str2ram', () => {
  it('should convert multiline string to RAM array', () => {
    const program = `1005
2006
3007
10000
0
23
3
10`;

    const ram = str2ram(program);

    expect(ram[0]).toBe(1005); // TAKE 5
    expect(ram[1]).toBe(2006); // ADD 6
    expect(ram[2]).toBe(3007); // SUB 7
    expect(ram[3]).toBe(10000); // HLT
    expect(ram[4]).toBe(0); // Empty cell
    expect(ram[5]).toBe(23); // Data at address 5
    expect(ram[6]).toBe(3); // Data at address 6
    expect(ram[7]).toBe(10); // Data at address 7
  });

  it('should handle empty lines and comments', () => {
    const program = `1005
; This is a comment
2006

3007`;

    const ram = str2ram(program);

    expect(ram[0]).toBe(1005);
    expect(ram[1]).toBe(2006);
    expect(ram[2]).toBe(3007);
  });

  it('should handle invalid lines', () => {
    const program = `1005
invalid
2006
abc123
3007`;

    const ram = str2ram(program);

    expect(ram[0]).toBe(1005);
    expect(ram[1]).toBe(2006);
    expect(ram[2]).toBe(3007);
  });

  it('should return array filled with zeros for empty string', () => {
    const ram = str2ram('');
    
    expect(ram.length).toBe(1000); // RAM_SIZE
    expect(ram.every(val => val === 0)).toBe(true);
  });
}); 