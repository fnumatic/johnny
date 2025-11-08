# Functional Library (funclib.ts)

A collection of generic functional programming helper functions for better code composition, error handling, and immutability.

## Features

- **Result Type**: Better error handling without exceptions
- **Functional Composition**: `pipe`, `compose`, `curry` utilities
- **Safe Operations**: Wrapper functions that return Result types
- **Validation**: Higher-order validation functions
- **Array Operations**: Functional array utilities
- **Option Type**: Handle optional values safely
- **Immutable Operations**: Safe array updates without mutation

## Core Types

### Result<T, E>
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

### Option<T>
```typescript
type Option<T> = 
  | { some: true; value: T }
  | { some: false };
```

## Usage Examples

### Safe Parsing with Result Type
```typescript
import { safeParseInt } from './funclib';

const parseAge = (input: string): Result<number> => {
  const result = safeParseInt(input);
  if (!result.success) return result;
  
  return result.data >= 0 && result.data <= 150
    ? { success: true, data: result.data }
    : { success: false, error: new Error('Invalid age') };
};
```

### Function Composition
```typescript
import { compose, pipe } from './funclib';

const addTax = (price: number) => price * 1.1;
const formatPrice = (amount: number) => amount.toFixed(2);
const addDollarSign = (amount: string) => `$${amount}`;

// Compose functions right-to-left
const formatCurrency = compose(addDollarSign, formatPrice, addTax);

// Pipe operations left-to-right
const result = pipe(100)
  .to(addTax)
  .to(formatPrice)
  .to(addDollarSign); // "$110.00"
```

### Validation
```typescript
import { createValidator, combineValidators } from './funclib';

const validateEmail = createValidator(
  (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  'Invalid email format'
);

const validatePassword = createValidator(
  (password: string) => password.length >= 8,
  'Password too short'
);

const validateUser = combineValidators(validateEmail, validatePassword);
```

### Array Operations
```typescript
import { filterMap, updateArrayCell } from './funclib';

// Filter and map in one operation
const evenDoubled = filterMap(
  (n: number) => n % 2 === 0,
  (n: number) => n * 2
)([1, 2, 3, 4, 5]); // [4, 8]

// Immutable array updates
const newUsers = updateArrayCell(['Alice', 'Bob', 'Charlie'], 1, 'Robert');
// ['Alice', 'Robert', 'Charlie'] - original array unchanged
```

### Option Type
```typescript
import { some, none, mapOption, getOptionOrElse } from './funclib';

const findUser = (users: User[], id: number) => {
  const user = users.find(u => u.id === id);
  return user ? some(user) : none();
};

const userName = mapOption(findUser(users, 123), user => user.name);
const displayName = getOptionOrElse(userName, 'Unknown User');
```

### Currying
```typescript
import { curry } from './funclib';

const multiply = curry((a: number, b: number) => a * b);
const double = multiply(2);
const triple = multiply(3);

double(5); // 10
triple(5); // 15
```

## Benefits

1. **Better Error Handling**: Result types eliminate try-catch blocks
2. **Immutability**: Safe operations prevent accidental mutations
3. **Composition**: Build complex operations from simple functions
4. **Type Safety**: Full TypeScript support with proper typing
5. **Reusability**: Generic functions work across different domains
6. **Testability**: Pure functions are easy to unit test

## Integration with Unified Parser

The unified parser (`unifiedParse.ts`) re-exports these utilities for convenience:

```typescript
import { 
  Result, 
  safeParseInt, 
  validateAndMap, 
  updateRamCell 
} from './unifiedParse';
```

## Complete Examples

### User Management System
```typescript
// Type definitions
type User = {
  id: number;
  name: string;
  email: string;
};

// Safe parsing with validation
export const parseUserAge = (input: string): Result<number> => {
  const parseResult = safeParseInt(input);
  if (!parseResult.success) {
    return parseResult;
  }
  
  const age = parseResult.data;
  return age >= 0 && age <= 150
    ? { success: true, data: age }
    : { success: false, error: new Error('Age must be between 0 and 150') };
};

// Email and password validation
export const validateEmail = createValidator(
  (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  'Invalid email format'
);

export const validatePassword = createValidator(
  (password: string) => password.length >= 8,
  'Password must be at least 8 characters'
);

export const validateUser = combineValidators(
  validateEmail,
  validatePassword
);

// Functional array operations
export const processNumbers = (numbers: number[]): number[] => {
  const isEven = (n: number) => n % 2 === 0;
  const double = (n: number) => n * 2;
  
  return filterMap(isEven, double)(numbers);
};

// Immutable array updates
export const updateUserList = (
  users: readonly string[], 
  index: number, 
  newName: string
): readonly string[] => {
  return updateArrayCell(users, index, newName);
};

// Option type for optional values
export const findUserById = (
  users: readonly { id: number; name: string }[], 
  id: number
) => {
  const user = users.find(u => u.id === id);
  return user ? some(user) : none();
};

export const getUserName = (
  users: readonly { id: number; name: string }[], 
  id: number
): string => {
  const userOption = findUserById(users, id);
  const nameOption = mapOption(userOption, user => user.name);
  return getOptionOrElse(nameOption, 'Unknown User');
};

// Function composition for pricing
export const addTax = (price: number) => price * 1.1;
export const formatPrice = (amount: number) => amount.toFixed(2);
export const addDollarSign = (amount: string) => `$${amount}`;

export const formatCurrency = compose(addDollarSign, compose(formatPrice, addTax));

// Higher-order function with logging
export const withLogging = <T extends (...args: any[]) => any>(fn: T): T => {
  return ((...args: any[]) => {
    console.log(`Calling ${fn.name} with:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  }) as T;
};

// Curried multiplication
export const multiply = curry((a: number, b: number) => a * b);
export const double = (x: number) => multiply(2, x);
export const triple = (x: number) => multiply(3, x);
```

## Performance

- All functions are optimized for minimal overhead
- Memoization utility available for expensive computations
- Immutable operations use spread syntax efficiently
- Result types have minimal memory footprint