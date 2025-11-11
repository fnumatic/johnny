
import { RAM_SIZE, encodeRam } from './engine';
import { Ok, Err, tryCatch, Result, validateAndMap } from './funclib';

// Core Types
export type Type = 'RAM' | 'ISA';
export type Version = 'V1' | 'V2' | 'V3' | 'V4';
export type ISA = 'normal' | 'bonsai';
export type LineFormat = 'single_line' | 'multi_line';


// Format Detection Results
export interface HeaderInfo {
  type: Type;
  description: string;
  version: Version;
  isa: ISA;
  raw: string;
  containerType: ContainerType;
  lineFormat: LineFormat;
}

export interface FormatDescriptor {
  header: HeaderInfo;
}

// Unified Result Format
export interface UnifiedMetadata {
  type: Type;
  description?: string;
  version: Version;
  isa: ISA;
}

export interface ParsedProgram {
  metadata: UnifiedMetadata | null;
  ram: number[];
}

// Re-export encodeRam from engine for unified access
export { encodeRam };


// Pure String Processing Functions
export const splitLines = (content: string): string[] => content.split('\n');
export const splitSemicolons = (content: string): string[] => 
  content.split(';').map(part => part.trim()).filter(Boolean);
export const trim = (str: string): string => str.trim();
export const isEmpty = (str: string): boolean => str.length === 0;
export const isComment = (str: string): boolean => str.startsWith(';');
export const shouldSkip = (str: string): boolean => isEmpty(str) || isComment(str);

// Validation Functions
export const isValidType = (type: string): type is Type => ['RAM', 'ISA'].includes(type);
export const isValidVersion = (version: string): version is Version => ['V1', 'V2', 'V3', 'V4'].includes(version);
export const isValidISA = (isa: string): isa is ISA => ['normal', 'bonsai'].includes(isa);
export const isValidRamValue = (value: number): boolean => 
  !isNaN(value) && value >= 0 && value <= 99999;
export const isValidAddress = (address: number): boolean => 
  !isNaN(address) && address >= 0 && address < RAM_SIZE;

// Specialized validation helpers using functional patterns
export const validateType = validateAndMap(
  isValidType,
  (type: string): Type => type as Type,
  (type: string) => new Error(`Invalid type: ${type}. Supported: RAM, ISA`)
);

export const validateVersion = validateAndMap(
  isValidVersion,
  (version: string): Version => version as Version,
  (version: string) => new Error(`Invalid version: ${version}. Supported: V1, V2, V3, V4`)
);

export const validateISA = validateAndMap(
  isValidISA,
  (isa: string): ISA => isa as ISA,
  (isa: string) => new Error(`Invalid ISA: ${isa}. Supported: normal, bonsai`)
);

export const validateRamValue = validateAndMap(
  isValidRamValue,
  (value: number) => value,
  (value: number) => new Error(`Invalid RAM value: ${value}. Must be 0-99999`)
);

export const validateAddress = validateAndMap(
  isValidAddress,
  (address: number) => address,
  (address: number) => new Error(`Invalid address: ${address}. Must be 0-${RAM_SIZE - 1}`)
);

// Data Conversion Utilities
export const integerCodeToOpData = (integerCode: string): string => {
  const value = parseInt(integerCode, 10);
  if (isNaN(value) || value < 0 || value > 99999) {
    throw new Error(`Invalid integer code: ${integerCode}`);
  }
  
  const opcode = Math.floor(value / 1000);
  const data = value % 1000;
  return `${opcode}.${data.toString().padStart(3, '0')}`;
};

export const opDataToIntegerCode = (opData: string): string => {
  const [opcodeStr, dataStr] = opData.split('.');
  const opcode = parseInt(opcodeStr, 10);
  const data = parseInt(dataStr, 10);
  
  if (isNaN(opcode) || isNaN(data)) {
    throw new Error(`Invalid op.data format: ${opData}`);
  }
  
  const encodeResult = encodeRam(opcode, data);
  if (!encodeResult.ok) {
    throw new Error((encodeResult as { ok: false; msg: string }).msg);
  }
  
  return encodeResult.value.toString();
};

// Safe versions using functional error handling
export const integerCodeToOpDataSafe = (integerCode: string): Result<string> => 
  tryCatch(() => integerCodeToOpData(integerCode));

export const opDataToIntegerCodeSafe = (opData: string): Result<string> => 
  tryCatch(() => opDataToIntegerCode(opData));

// Content Extraction Functions
export const extractDataAndHeader = (content: string): {
  header: HeaderInfo;
  dataParts: string[];
} => {
  // Get all format information in one call
  const header = parseUnifiedHeader(content);
  const dataContent = !header.raw
    ? content
    : content.substring(header.raw.length).replace(/^;?/, '');
  
  // Extract data based on format
  const rawParts = header.lineFormat === LINE_FORMATS.SINGLE_LINE 
    ? splitSemicolons(dataContent)
    : splitLines(dataContent);
  
  // Process parts using functional composition
  
  const dataParts = rawParts
    .filter(line => !shouldSkip(trim(line))) // Filter out empty or comment lines
    .map(line => trim(line)) // Trim each line

  return { header, dataParts };
};

// RAM Building Functions
export const buildSequentialRam = (values: number[]): number[] => {
  const validValues = values.filter(isValidRamValue).slice(0, RAM_SIZE);
  return [...validValues, ...Array(RAM_SIZE - validValues.length).fill(0)];
};

export const buildAddressedRam = (addressedValues: { address: number; value: number } []): number[] => {
  const ram = Array(RAM_SIZE).fill(0);
  addressedValues
    .filter( (v): v is { address: number; value: number } => v !== null)
    .filter(({ address, value }) => isValidAddress(address) && isValidRamValue(value))
    .forEach(({ address, value }) => { ram[address] = value; });
  return ram;
};

// Metadata Creation
export const createMetadata = (header: HeaderInfo): UnifiedMetadata => ({
  type: header.type,
  description: header.description || undefined,
  version: header.version,
  isa: header.isa
});

export const createParsedProgram = (
  metadata: UnifiedMetadata | null, 
  ram: number[]
): ParsedProgram => ({ metadata, ram });


export const parseHeaderParts = (headerLine: string): Result<HeaderInfo> => {
  const parts = headerLine.split(':');
  if (parts.length < 4) {
    return Err(`Invalid header format: ${headerLine}. Expected: type:description:version:isa`);
  }

  const type = parts[0];
  const typeResult = validateType(type);
  if (!typeResult.ok) {
    return typeResult;
  }
  
  const version = parts[parts.length - 2];
  const versionResult = validateVersion(version);
  if (!versionResult.ok) {
    return versionResult;
  }

  const isa = parts[parts.length - 1];
  const isaResult = validateISA(isa);
  if (!isaResult.ok) {
    return isaResult;
  }

  let description = parts.slice(1, -2).join(':').replace(/^\{|\}$/g, '');
  if (description.startsWith(':')) {
    description = '';
  }

  const containerType = versionResult.value === 'V1' || versionResult.value === 'V2' 
    ? CONTAINER_TYPE.FULL 
    : CONTAINER_TYPE.PARSED;
  const lineFormat = LINE_FORMATS.SINGLE_LINE;
  return Ok({
    type: typeResult.value,
    description,
    version: versionResult.value,
    isa: isaResult.value,
    raw: headerLine,
    containerType,
    lineFormat
  });
};

export const parseUnifiedHeader = (content: string): HeaderInfo => {
  const firstLine = trim(content.split('\n')[0]);
  
  // Handle headerless case
  if (!firstLine.includes(':') || /^\d+$/.test(firstLine)) {
    const lineFormat = detectLineFormat(content);
    return { ...DEFAULT_RAM_HEADER, lineFormat };
  }
  
  // Extract header part (before semicolon if present)
  const headerText = firstLine.includes(';') 
    ? firstLine.substring(0, firstLine.indexOf(';'))
    : firstLine;
  
  // Parse header using safe function
  const headerResult = parseHeaderParts(headerText);
  if (!headerResult.ok) {
    throw new Error(headerResult.msg);
  }
  
  // Add line format info
  const lineFormat = detectLineFormat(content);
  return { ...headerResult.value, lineFormat };
};

export const detectLineFormat = (content: string): LineFormat => {
  return content.includes('\n') ? LINE_FORMATS.MULTI_LINE : LINE_FORMATS.SINGLE_LINE;
};
// Unified Parser Functions - work with pre-split arrays
// Single data chunk parsing functions for sequential formats
export const parseIntegerChunk = (chunk: string): DefaultChunk => {
  return parseInt(chunk, 10);
};
export const parseIntegerValue : AddressChunkParser= (chunk: string) => {
  return  parseInt(chunk, 10) ;
};

export const parseOpDataChunk = (chunk: string): DefaultChunk => {
  const result = opDataToIntegerCodeSafe(chunk);
  if (!result.ok) {
    console.warn(`Skipping invalid op.data: ${chunk}`, result.msg);
    return 0;
  }
  const value = parseInt(result.value, 10);
  return isValidRamValue(value) ? value : 0;
};

const parseOpDataValue: AddressChunkParser = (valueStr: string, address: number) => {
  const result = opDataToIntegerCodeSafe(valueStr);
  if (!result.ok) {
    console.warn(`Skipping invalid op.data at address ${address}: ${valueStr}`, result.msg);
    return null;
  }
  return parseInt(result.value, 10);
};

const parseChunkArray =(
  chunks: string[], 
  header: HeaderInfo, 
  pipeline: (chunks: string[]) => number[]
): ParsedProgram => {
  
  const ram = pipeline(chunks);
  return createParsedProgram(header.raw ? createMetadata(header) : null, ram);
};

const sparseContainerPipeline = (chunkParser: AddressChunkParser) => (chunks: string[]) => 
  buildAddressedRam(chunks.map(parseAddressedChunkFunctional(chunkParser)).filter((v): v is {address: number; value: number} => v !== null));

const fullContainerPipeline = (chunkParser: DefaultChunkParser) => (chunks: string[]) => 
  buildSequentialRam(chunks.map(chunkParser));
type DefaultChunkParser = (dataPart: string) => DefaultChunk;
type AddressChunkParser = (valueStr: string, address: number) => number | null;
type ContainerType = typeof CONTAINER_TYPE.FULL | typeof CONTAINER_TYPE.PARSED;
type DefaultChunk = number ;

export const parseAddressedChunkFunctional = 
(valueParser: AddressChunkParser) => (chunk: string) => {
  const parts = chunk.split(':') as [string, string];
  const [addressStr, valueStr] = parts;
  const address = parseInt(addressStr, 10);
  
  const addressResult = validateAddress(address);
  if (!addressResult.ok) return null;
  
  const value = valueParser(valueStr, addressResult.value);
  if (value === null) return null;
  
  const valueResult = validateRamValue(value);
  return valueResult.ok ? { address: addressResult.value, value: valueResult.value } : null;
};


const CONTAINER_TYPE = {
  FULL: 'full' as const,
  PARSED: 'parsed' as const
} as const;

// Constants for parser mapping
const LINE_FORMATS = {
  SINGLE_LINE: 'single_line' as const,
  MULTI_LINE: 'multi_line' as const
} as const;


// Default header for V1 headerless RAM programs
const DEFAULT_RAM_HEADER: HeaderInfo = {
  type: 'RAM',
  description: '',
  version: 'V1',
  isa: 'normal',
  raw: '',
  containerType: CONTAINER_TYPE.FULL,
  lineFormat: LINE_FORMATS.SINGLE_LINE
};

// Main Entry Point
export const parseProgram = (content: string): ParsedProgram => {
  if (!content || !trim(content)) {
    return createParsedProgram(null, Array(RAM_SIZE).fill(0));
  }
  
  const { header, dataParts } = extractDataAndHeader(content);
  
  // Call unified core functions directly instead of legacy wrappers
  switch (header.version) {
    case 'V1':
      return parseChunkArray(dataParts, header, fullContainerPipeline(parseIntegerChunk));
    case 'V2':
      return parseChunkArray(dataParts, header, fullContainerPipeline(parseOpDataChunk));
    case 'V3':
      return parseChunkArray(dataParts, header, sparseContainerPipeline(parseIntegerValue));
    case 'V4':
      return parseChunkArray(dataParts, header, sparseContainerPipeline(parseOpDataValue));
    default:
      throw new Error(`Unsupported version: ${header.version}`);
  }
};


