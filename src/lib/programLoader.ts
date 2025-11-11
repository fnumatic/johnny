import { RAM_SIZE } from './engine';

export interface ProgramMetadata {
  version: string;
  date: string;
  computerType: 'normal' | 'bonsai';
  comment: string;
}

export interface ParsedProgram {
  metadata: ProgramMetadata;
  ram: number[];
}

/**
 * Parse .ram file content with V2/V3 format support
 */
export function parseRamFile(content: string): ParsedProgram {
  const lines = content.trim().split('\n');
  
  if (lines.length < 3) {
    throw new Error('Invalid .ram file: needs metadata, comment, and program lines');
  }

  // Parse metadata: V2:2025-01-01:normal
  const [version, date, computerType] = lines[0].split(':');
  if (!version?.startsWith('V') || !date || !['normal', 'bonsai'].includes(computerType)) {
    throw new Error('Invalid metadata format. Expected: V2:YYYY-MM-DD:normal|bonsai');
  }

  const metadata: ProgramMetadata = {
    version,
    date,
    computerType: computerType as 'normal' | 'bonsai',
    comment: lines[1] || ''
  };

  // Parse program lines into RAM
  const ram = Array(RAM_SIZE).fill(0);
  
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [addressStr, codeStr] = line.split(':');
    const address = parseInt(addressStr);
    
    if (isNaN(address) || address < 0 || address >= RAM_SIZE) {
      throw new Error(`Invalid address at line ${i + 1}: ${addressStr}`);
    }

    let ramValue: number;
    
    if (version === 'V2') {
      // V2: 01:1005
      ramValue = parseInt(codeStr);
      if (isNaN(ramValue)) {
        throw new Error(`Invalid code at line ${i + 1}: ${codeStr}`);
      }
    } else if (version === 'V3') {
      // V3: 01:1.5 -> 1005
      const [opcode, data] = codeStr.split('.').map(Number);
      if (isNaN(opcode) || isNaN(data)) {
        throw new Error(`Invalid opcode.data at line ${i + 1}: ${codeStr}`);
      }
      ramValue = opcode * 1000 + (data % 1000);
    } else {
      throw new Error(`Unsupported version: ${version}`);
    }

    ram[address] = ramValue;
  }

  return { metadata, ram };
}

/**
 * Read and parse .ram file
 */
export async function readRamFile(file: File): Promise<ParsedProgram> {
  if (!file.name.endsWith('.ram')) {
    throw new Error('File must have .ram extension');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = reader.result as string;
        resolve(parseRamFile(content));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}