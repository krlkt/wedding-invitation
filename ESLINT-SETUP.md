# ESLint Strict Configuration Guide

## Overview

This project now uses a comprehensive, strict ESLint configuration following industry best practices for React and Next.js 14 applications.

## Installed Packages

```json
{
  "@typescript-eslint/eslint-plugin": "^8.46.2",
  "@typescript-eslint/parser": "^8.46.2",
  "eslint-plugin-react": "^7.37.5",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-jsx-a11y": "^6.10.2",
  "eslint-plugin-import": "^2.32.0",
  "eslint-import-resolver-typescript": "^4.4.4",
  "eslint-config-prettier": "^10.1.8"
}
```

## What's Enforced

### 1. TypeScript Strict Rules (ERROR level)

- ❌ **No `any` types** - Must use proper TypeScript types
- ❌ **No unused variables** - All variables must be used (prefix with `_` to ignore)
- ❌ **No floating promises** - All promises must be awaited or handled
- ❌ **No non-null assertions** (`!`) - Use proper type guards
- ✅ **Prefer optional chaining** (`?.`)
- ✅ **Prefer nullish coalescing** (`??`)
- ✅ **Strict boolean expressions** - No implicit boolean conversions

### 2. React Best Practices (ERROR level)

- ❌ **No unnecessary curly braces** - `title="Hello"` instead of `title={"Hello"}`
- ❌ **Boolean values** - `<Component enabled />` instead of `<Component enabled={true} />`
- ❌ **Missing keys in lists** - All mapped elements must have keys
- ❌ **Self-closing components** - `<Component />` instead of `<Component></Component>`
- ❌ **Unstable nested components** - Don't define components inside components
- ⚠️ **Array index as key** - Warning (sometimes acceptable)

### 3. React Hooks (ERROR level)

- ❌ **Rules of Hooks** - Hooks must be called at top level
- ❌ **Exhaustive deps** - All dependencies must be in dependency array

### 4. Accessibility (a11y) (ERROR level)

- ❌ **Alt text required** - All images must have alt text
- ❌ **Valid anchor tags** - Links must have valid href
- ❌ **ARIA props** - Proper ARIA attributes
- ❌ **Role attributes** - Valid role attributes

### 5. Import Organization (ERROR level)

Imports are automatically ordered:
1. React (builtin)
2. Next.js (builtin)
3. External packages
4. Internal (`@/` paths)
5. Parent imports (`../`)
6. Sibling imports (`./`)
7. Type imports

**Blank lines required between groups**

### 6. General Best Practices (ERROR level)

- ❌ **No `var`** - Use `const` or `let`
- ❌ **No debugger statements**
- ❌ **Always use `===`** - No loose equality (`==`)
- ❌ **Prefer `const`** - Use const for non-reassigned variables
- ❌ **Prefer template literals** - Use backticks for string concatenation
- ⚠️ **No console.log** - Warning (except `console.warn`, `console.error`)
- ⚠️ **No nested ternaries** - Warning

## Available Scripts

### `yarn lint`
Run ESLint on all files (shows errors and warnings)

### `yarn lint:fix`
Auto-fix all fixable ESLint issues

### `yarn lint:strict`
Fail if there are ANY warnings (use in CI/CD)

### `yarn type-check`
Run TypeScript type checking without building

### `yarn validate`
Run all checks: type-check + lint:strict + format check + tests

## Usage Examples

### Fixing Common Issues

#### 1. Unused Variables
```typescript
// ❌ Bad - error
function example(param1: string, param2: string) {
  return param1;
}

// ✅ Good - prefix unused with _
function example(param1: string, _param2: string) {
  return param1;
}
```

#### 2. Any Types
```typescript
// ❌ Bad - error
const data: any = fetchData();

// ✅ Good - proper typing
interface UserData {
  name: string;
  email: string;
}
const data: UserData = fetchData();

// ✅ Also good - unknown with type guard
const data: unknown = fetchData();
if (isUserData(data)) {
  // use data
}
```

#### 3. Floating Promises
```typescript
// ❌ Bad - error
async function example() {
  fetchData(); // Promise not handled
}

// ✅ Good - await it
async function example() {
  await fetchData();
}

// ✅ Also good - handle with .catch()
async function example() {
  fetchData().catch(console.error);
}

// ✅ Or explicitly mark as ignored
async function example() {
  void fetchData();
}
```

#### 4. Import Order
```typescript
// ❌ Bad - error
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '@/components/Button';
import { formatDate } from '../utils/date';

// ✅ Good - properly ordered with blank lines
import { useState } from 'react';

import Link from 'next/link';

import axios from 'axios';

import { Button } from '@/components/Button';

import { formatDate } from '../utils/date';
```

Use `yarn lint:fix` to auto-fix import order!

#### 5. React Best Practices
```typescript
// ❌ Bad
<Component title={"Hello"} enabled={true} />

// ✅ Good
<Component title="Hello" enabled />

// ❌ Bad
<div></div>

// ✅ Good
<div />

// ❌ Bad
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}

// ✅ Good
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

#### 6. Strict Boolean Expressions
```typescript
// ❌ Bad - error
if (value) { }          // value could be string, number, etc.
if (array.length) { }   // implicit number to boolean

// ✅ Good - explicit checks
if (value !== null && value !== undefined) { }
if (Boolean(value)) { }
if (array.length > 0) { }
```

## Test Files Exception

Test files (`*.test.ts`, `*.spec.ts`) have relaxed rules:
- `any` types allowed
- `console.log` allowed
- Non-null assertions allowed
- Unsafe type operations allowed

## Configuration Files Exception

Config files (`*.config.ts`, `*.config.js`) have relaxed rules:
- `console.log` allowed
- `require()` allowed in .js files

## Integration with Prettier

ESLint configuration includes `eslint-config-prettier` to avoid conflicts with Prettier.

**Workflow:**
1. Prettier handles formatting (spacing, semicolons, etc.)
2. ESLint handles code quality and best practices

Always run both:
```bash
yarn format    # Prettier fix
yarn lint:fix  # ESLint fix
```

## CI/CD Integration

Add to your GitHub Actions / CI pipeline:

```yaml
- name: Validate code quality
  run: yarn validate
```

This runs:
- TypeScript type checking
- ESLint (with zero warnings allowed)
- Prettier format check
- All tests

## Gradual Migration

If you have many existing errors:

1. **See all issues:**
   ```bash
   yarn lint > eslint-issues.txt
   ```

2. **Auto-fix what you can:**
   ```bash
   yarn lint:fix
   ```

3. **Fix remaining manually** or **temporarily disable rules:**

   ```typescript
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const data: any = legacyCode();
   ```

4. **Don't commit disabled rules** - fix the code instead!

## VS Code Integration

Install ESLint extension and add to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Benefits

✅ Catch bugs before runtime
✅ Enforce consistent code style
✅ Better type safety
✅ Improved accessibility
✅ Easier code reviews
✅ Onboard new developers faster
✅ Prevent common React mistakes

## Questions?

- Check `.eslintrc.json` for all rules
- See specific rule docs: https://eslint.org/docs/rules/
- TypeScript ESLint: https://typescript-eslint.io/rules/
- React plugin: https://github.com/jsx-eslint/eslint-plugin-react
