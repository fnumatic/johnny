import { Result } from './funclib';

export interface ParseResult {
  operation: string;
  data: string;
  operationName: string;
  isValid: boolean;
}

export type ParseResultResult = Result<ParseResult, string>;

// Functional validation helper
const validateFormat = (input: string): boolean => {
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
 * Check if input matches valid opcode data format patterns
 * @param input - The input string to validate
 * @returns true if input matches any valid pattern
 */
export const checkValidFormat = validateFormat;

// Functional parsing helpers
const createParseResult = (operation: string, data: string, operationName: string): ParseResult => ({
  operation,
  data,
  operationName,
  isValid: true
});

const createEmptyResult = (): ParseResult => ({
  operation: '',
  data: '',
  operationName: '',
  isValid: false
});

const getOperationName = (operation: string, opcodeMapping: Record<string, string>, hideFetch: boolean): string => {
  const operationName = opcodeMapping[operation] || 'UNKNOWN';
  return (hideFetch && operationName === 'FETCH') ? '' : operationName;
};

const parseTwoPartInput = (input: string, opcodeMapping: Record<string, string>, hideFetch: boolean): ParseResult | null => {
  const parts = input.split('.');
  if (parts.length !== 2) return null;
  
  const opPart = parts[0].trim();
  const dataPart = parts[1].trim();
  
  if (!opPart || !dataPart) return null;
  
  const operation = opPart.padStart(2, '0');
  const data = dataPart.padEnd(3, '0');
  const operationName = getOperationName(operation, opcodeMapping, hideFetch);
  
  return createParseResult(operation, data, operationName);
};

const parseSinglePartInput = (input: string, opcodeMapping: Record<string, string>, hideFetch: boolean): ParseResult | null => {
  const parts = input.split('.');
  if (parts.length !== 1) return null;
  
  const opPart = parts[0].trim();
  if (!opPart) return null;
  
  const operation = opPart.padStart(2, '0');
  const operationName = getOperationName(operation, opcodeMapping, hideFetch);
  
  return createParseResult(operation, '000', operationName);
};

/**
 * Parse the input to show real-time result using functional composition
 * @param input - The input string to parse (e.g., "01.005", "1", "1.5")
 * @param opcodeMapping - Mapping of opcode strings to operation names
 * @param hideFetch - Whether to hide FETCH operation name (defaults to true)
 * @returns ParseResult object with parsed components
 */
export const parseInputResult = (
  input: string, 
  opcodeMapping: Record<string, string>, 
  hideFetch: boolean = true
): ParseResult => {
  const trimmed = input.trim();
  if (trimmed === '') return createEmptyResult();
  
  const twoPartResult = parseTwoPartInput(trimmed, opcodeMapping, hideFetch);
  if (twoPartResult) return twoPartResult;
  
  const singlePartResult = parseSinglePartInput(trimmed, opcodeMapping, hideFetch);
  return singlePartResult ?? createEmptyResult();
};

/**
 * Parse input using Result type for better error handling
 * @param input - The input string to parse
 * @param opcodeMapping - Mapping of opcode strings to operation names
 * @param hideFetch - Whether to hide FETCH operation name
 * @returns Result<ParseResult, string>
 */
export const parseInputResultSafe = (
  input: string,
  opcodeMapping: Record<string, string>,
  hideFetch: boolean = true
): Result<ParseResult, string> => {
  try {
    if (!input || input.trim() === '') {
      return { success: false, error: 'Empty input' };
    }

    if (!validateFormat(input)) {
      return { success: false, error: 'Invalid format' };
    }

    const result = parseInputResult(input, opcodeMapping, hideFetch);
    return result.isValid 
      ? { success: true, data: result }
      : { success: false, error: 'Parsing failed' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
