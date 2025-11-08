/**
 * Functional Programming Library
 * Generic functional helper functions for better code composition and error handling
 */



// Functional Result Type for better error handling
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Functional Utilities
export const pipe = <T>(value: T) => ({
  to: <U>(fn: (value: T) => U): U => fn(value)
});

export const compose = <T, U, V>(f: (arg: U) => V, g: (arg: T) => U) => 
  (arg: T): V => f(g(arg));

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
    ? { success: false, error: new Error(`Invalid integer: ${str}`) }
    : { success: true, data: value };
};

// Higher-order functions for validation
export const validateAndMap = <T, U>(
  validator: (value: T) => boolean,
  mapper: (value: T) => U,
  errorFactory: (value: T) => Error
) => 
  (value: T): Result<U> => 
    validator(value) 
      ? { success: true, data: mapper(value) }
      : { success: false, error: errorFactory(value) };

// Functional array utilities
export const filterMap = <T, U>(
  predicate: (value: T) => boolean,
  mapper: (value: T) => U
) => 
  (array: T[]): U[] => 
    array.filter(predicate).map(mapper);

export const findOrElse = <T>(
  predicate: (value: T) => boolean,
  defaultValue: T
) => 
  (array: T[]): T => 
    array.find(predicate) ?? defaultValue;

// Functional composition helpers for parsing pipeline
export const createParsePipeline = <T>(initialValue: T) => ({
  pipe: <U>(fn: (value: T) => Result<U>) => {
    const result = fn(initialValue);
    return result.success 
      ? createParsePipeline(result.data)
      : { success: false, error: result.error } as Result<any>;
  },
  get: () => ({ success: true, data: initialValue } as Result<T>)
});

// Immutable operations for arrays
export const updateArrayCell = <T>(array: readonly T[], index: number, value: T): readonly T[] => {
  if (index < 0 || index >= array.length) return array;
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
};

export const setArrayCells = <T>(array: readonly T[], cells: readonly { index: number; value: T }[]): readonly T[] => 
  cells.reduce((acc, { index, value }) => updateArrayCell(acc, index, value), array);

// Result type utilities
export const mapResult = <T, U, E = Error>(
  result: Result<T, E>,
  mapper: (value: T) => U
): Result<U, E> => 
  result.success 
    ? { success: true, data: mapper(result.data) }
    : result;

export const flatMapResult = <T, U, E = Error>(
  result: Result<T, E>,
  mapper: (value: T) => Result<U, E>
): Result<U, E> => 
  result.success 
    ? mapper(result.data)
    : result;

export const getResultOrElse = <T, E = Error>(
  result: Result<T, E>,
  defaultValue: T
): T => 
  result.success ? result.data : defaultValue;

// Option type (optional value handling)
export type Option<T> = 
  | { some: true; value: T }
  | { some: false };

export const some = <T>(value: T): Option<T> => ({ some: true, value });
export const none = (): Option<never> => ({ some: false });

export const mapOption = <T, U>(
  option: Option<T>,
  mapper: (value: T) => U
): Option<U> => 
  option.some ? some(mapper(option.value)) : none();

export const getOptionOrElse = <T>(
  option: Option<T>,
  defaultValue: T
): T => 
  option.some ? option.value : defaultValue;

// Functional validation helpers
export const createValidator = <T>(
  predicate: (value: T) => boolean,
  errorMessage: string
) => 
  (value: T): Result<T> => 
    predicate(value) 
      ? { success: true, data: value }
      : { success: false, error: new Error(errorMessage) };

export const combineValidators = <T>(
  ...validators: Array<(value: T) => Result<T>>
) => 
  (value: T): Result<T> => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.success) {
        return result;
      }
    }
    return { success: true, data: value };
  };

// Async functional utilities
export const asyncPipe = <T>(value: T) => ({
  to: async <U>(fn: (value: T) => Promise<U>): Promise<U> => fn(value)
});

export const asyncCompose = <T, U, V>(
  f: (arg: U) => Promise<V>, 
  g: (arg: T) => Promise<U>
) => 
  async (arg: T): Promise<V> => f(await g(arg));

// Memoization utility
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};