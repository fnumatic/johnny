import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mutates an object by setting a property and returns the mutated object
 * @param obj - The object to mutate
 * @param key - The property key to set
 * @param value - The value to set
 * @returns The mutated object (same reference)
 */
export const assocMut = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): T => {
  obj[key] = value;
  return obj;
};

/**
 * Mutates an object by setting multiple properties and returns the mutated object
 * @param obj - The object to mutate
 * @param updates - Object containing key-value pairs to set
 * @returns The mutated object (same reference)
 */
export const assocMutMany = <T extends Record<string, any>>(
  obj: T,
  updates: Partial<T>
): T => {
  Object.assign(obj, updates);
  return obj;
};
