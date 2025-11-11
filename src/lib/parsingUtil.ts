export interface ParseResult {
  operation: string;
  data: string;
  operationName: string;
  isValid: boolean;
}

/**
 * Check if input matches valid opcode data format patterns
 * @param input - The input string to validate
 * @returns true if input matches any valid pattern
 */
export const checkValidFormat = (input: string): boolean => {
  if (input === '') return true;
  
  const validPatterns = [
    /^\d$/,           // Single digit: 1, 2, 3...
    /^\d{2}$/,        // Two digits: 01, 02, 03...
    /^\.\d$/,         // .1, .2, .3...
    /^\.\d{2}$/,      // .01, .02, .03...
    /^\.\d{3}$/,      // .001, .002, .003...
    /^\d\.\d$/,       // 1.1, 1.2, 1.3...
    /^\d\.\d{2}$/,    // 1.01, 1.02, 1.03...
    /^\d\.\d{3}$/,    // 1.001, 1.002, 1.003...
    /^\d{2}\.\d$/,    // 01.1, 01.2, 01.3...
    /^\d{2}\.\d{2}$/, // 01.01, 01.02, 01.03...
    /^\d{2}\.\d{3}$/, // 01.001, 01.002, 01.003...
  ];

  return validPatterns.some(pattern => pattern.test(input));
};

/**
 * Parse the input to show real-time result
 * @param input - The input string to parse (e.g., "01.005", "1", "1.5")
 * @param opcodeMapping - Mapping of opcode strings to operation names
 * @param hideFetch - Whether to hide FETCH operation name (defaults to true)
 * @returns ParseResult object with parsed components
 */
export const parseInputResult = (input: string, opcodeMapping: Record<string, string>, hideFetch: boolean = true): ParseResult => {
  if (!input || input.trim() === '') {
    return { operation: '', data: '', operationName: '', isValid: false };
  }

  const parts = input.split('.');
  if (parts.length === 2) {
    const opPart = parts[0].trim();
    const dataPart = parts[1].trim();
    
    if (opPart && dataPart) {
      const operation = opPart.padStart(2, '0');
      const data = dataPart.padEnd(3, '0');
      let operationName = opcodeMapping[operation] || 'UNKNOWN';
      
      // Hide FETCH operation if hideFetch is true
      if (hideFetch && operationName === 'FETCH') {
        operationName = '';
      }
      
      return {
        operation,
        data,
        operationName,
        isValid: true
      };
    }
  } else if (parts.length === 1 && parts[0].trim()) {
    // Single number input
    const opPart = parts[0].trim();
    const operation = opPart.padStart(2, '0');
    let operationName = opcodeMapping[operation] || 'UNKNOWN';
    
    // Hide FETCH operation if hideFetch is true
    if (hideFetch && operationName === 'FETCH') {
      operationName = '';
    }
    
    return {
      operation,
      data: '000',
      operationName,
      isValid: true
    };
  }
  
  return { operation: '', data: '', operationName: '', isValid: false };
};
