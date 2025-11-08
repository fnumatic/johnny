/**
 * Minimal Result toolkit for functional error handling
 */

// New Result type - clean and simple
export type Result<T> = 
  | { ok: true; value: T }
  | { ok: false; msg: string };

// Constructor functions
export const Ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const Err = <T>(msg: string): Result<T> => ({ ok: false, msg });

// Type guards
export const isOk = <T>(r: Result<T>): r is { ok: true; value: T } => r.ok;
export const isErr = <T>(r: Result<T>): r is { ok: false; msg: string } => !r.ok;

// Functional composition
export const andThen = <T, U>(
  r: Result<T>, 
  fn: (value: T) => Result<U>
): Result<U> => isOk(r) ? fn(r.value) : r;

export const map = <T, U>(
  r: Result<T>, 
  fn: (value: T) => U
): Result<U> => isOk(r) ? Ok(fn(r.value)) : r;

export const mapErr = <T>(
  r: Result<T>, 
  fn: (msg: string) => string
): Result<T> => isErr(r) ? Err(fn(r.msg)) : r;

// Recovery helpers
export const unwrapOr = <T>(r: Result<T>, defaultValue: T): T => 
  isOk(r) ? r.value : defaultValue;

export const unwrapOrElse = <T>(r: Result<T>, fn: (msg: string) => T): T => 
  isOk(r) ? r.value : fn(r.msg);

// Legacy Result type for backward compatibility during migration
export type LegacyResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Converts a RAM address string to a number with validation
 * Returns new Result type with improved error handling
 */
export function encodeRam(address: string): Result<number> {
  const trimmed = address.trim();
  
  // Check if it's a valid decimal number
  if (!/^\d+$/.test(trimmed)) {
    return Err(`Invalid RAM address "${address}": must be a non-negative integer`);
  }
  
  const num = parseInt(trimmed, 10);
  
  // Check if it's within valid RAM range (0-99)
  if (num > 99) {
    return Err(`RAM address "${address}" (${num}) is out of range: must be 0-99`);
  }
  
  return Ok(num);
}

/**
 * Converts a number to a RAM address string with validation
 * Returns new Result type with improved error handling
 */
export function decodeRam(address: number): Result<string> {
  // Check if it's a valid integer
  if (!Number.isInteger(address)) {
    return Err(`Invalid RAM address number "${address}": must be an integer`);
  }
  
  // Check if it's within valid RAM range (0-99)
  if (address < 0 || address > 99) {
    return Err(`RAM address "${address}" is out of range: must be 0-99`);
  }
  
  return Ok(address.toString());
}

/**
 * Legacy version of encodeRam for backward compatibility
 * @deprecated Use encodeRam instead
 */
export function encodeRamLegacy(address: string): LegacyResult<number> {
  const result = encodeRam(address);
  return isOk(result) 
    ? { success: true, data: result.value }
    : { success: false, error: result.msg };
}

/**
 * Legacy version of decodeRam for backward compatibility  
 * @deprecated Use decodeRam instead
 */
export function decodeRamLegacy(address: number): LegacyResult<string> {
  const result = decodeRam(address);
  return isOk(result) 
    ? { success: true, data: result.value }
    : { success: false, error: result.msg };
}

// Functional utilities
export const pipe = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduce((acc, fn) => fn(acc), value);

export const compose = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduceRight((acc, fn) => fn(acc), value);

export const curry = <T extends (...args: any[]) => any>(fn: T): T => {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...nextArgs: any[]) => curried.apply(this, args.concat(nextArgs));
  } as T;
};

// Safe wrapper functions that return Result types
export const safeParseInt = (str: string, radix?: number): Result<number> => {
  const value = parseInt(str, radix);
  return isNaN(value) 
    ? Err(`Invalid integer: ${str}`)
    : Ok(value);
};

// Higher-order functions for validation
export const validateAndMap = <T, U>(
  validator: (value: T) => boolean,
  mapper: (value: T) => U,
  errorFactory: (value: T) => Error
) => 
  (value: T): Result<U> => 
    validator(value) 
      ? Ok(mapper(value))
      : Err(errorFactory(value).message);

// Functional array utilities
export const filterMap = <T, U>(
  predicate: (value: T) => boolean,
  mapper: (value: T) => U
) => 
  (array: T[]): U[] => 
    array.filter(predicate).map(mapper);

export const findWithDefault = <T>(
  predicate: (value: T) => boolean,
  defaultValue: T
) => 
  (array: T[]): T => 
    array.find(predicate) ?? defaultValue;

// String utilities
export const splitNonEmpty = (delimiter: string) => (str: string): string[] =>
  str.split(delimiter).filter(s => s.length > 0);

export const trimAndSplit = (delimiter: string) => (str: string): string[] =>
  str.trim().split(delimiter).map(s => s.trim()).filter(s => s.length > 0);

// Number utilities
export const clamp = (min: number, max: number) => (value: number): number =>
  Math.min(Math.max(value, min), max);

export const isBetween = (min: number, max: number) => (value: number): boolean =>
  value >= min && value <= max;

// Type utilities
export const hasProperty = <K extends string | number | symbol>(key: K) =>
  <T extends object>(obj: T): obj is T & Record<K, unknown> =>
    key in obj;

export const isNotNull = <T>(value: T | null): value is T => value !== null;
export const isNotUndefined = <T>(value: T | undefined): value is T => value !== undefined;
export const isNotNullish = <T>(value: T | null | undefined): value is T => 
  value != null; // Checks for both null and undefined

// Async utilities
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const withTimeout = <T>(
  promise: Promise<T>, 
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> =>
  Promise.race([
    promise,
    sleep(timeoutMs).then(() => Promise.reject(new Error(errorMessage)))
  ]);

// Error handling utilities
export const tryCatch = <T, E extends Error = Error>(
  fn: () => T,
  onError: (error: E) => string = (e) => e.message
): Result<T> => {
  try {
    return Ok(fn());
  } catch (error) {
    return Err(onError(error as E));
  }
};

export const tryCatchAsync = async <T, E extends Error = Error>(
  fn: () => Promise<T>,
  onError: (error: E) => string = (e) => e.message
): Promise<Result<T>> => {
  try {
    return Ok(await fn());
  } catch (error) {
    return Err(onError(error as E));
  }
};

// Collection utilities
export const groupBy = <K extends string | number | symbol, T>(
  keyFn: (item: T) => K
) => 
  (array: T[]): Record<K, T[]> => 
    array.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);

export const uniqBy = <T>(keyFn: (item: T) => any) => 
  (array: T[]): T[] => {
    const seen = new Set();
    return array.filter(item => {
      const key = keyFn(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

// Functional composition helpers
export const tap = <T>(fn: (value: T) => void) => 
  (value: T): T => {
    fn(value);
    return value;
  };

export const when = <T>(
  condition: boolean,
  fn: (value: T) => T
) => 
  (value: T): T => condition ? fn(value) : value;