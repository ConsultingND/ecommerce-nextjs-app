# Testing Guide for E-Commerce App

## Overview

This document outlines the plan for adding unit and integration tests to the e-commerce application.

**Project Stats:**
- 23 TypeScript files
- 6 API routes
- 6 React components
- Current testing framework: None

---

## Effort Estimate: MEDIUM (2-4 days)

### Timeline Breakdown
- **Setup Phase**: 2-4 hours
- **High Priority Tests**: 1-2 days
- **Medium Priority Tests**: 1 day
- **Lower Priority Tests**: 0.5-1 day

---

## Setup Phase (2-4 hours)

### 1. Install Dependencies

```bash
# Core testing libraries
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event jest-environment-jsdom
npm install --save-dev @types/jest ts-node

# MongoDB mocking
npm install --save-dev mongodb-memory-server

# Next.js testing support
npm install --save-dev @next/env
```

### 2. Configuration Files

#### `jest.config.js`
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/layout.tsx',
    '!app/**/page.tsx',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
}

module.exports = createJestConfig(customJestConfig)
```

#### `jest.setup.js`
```javascript
import '@testing-library/jest-dom'

// Mock environment variables
process.env.MONGODB_USER = 'test_user'
process.env.MONGODB_PASSWORD = 'test_password'
process.env.AUTH_SECRET = 'test_secret_key_for_testing_only'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
```

#### `.env.test`
```bash
MONGODB_USER=test_user
MONGODB_PASSWORD=test_password
AUTH_SECRET=test_secret_key_for_testing_only
NEXTAUTH_URL=http://localhost:3000
```

#### Update `package.json`
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Testing Breakdown by Priority

### HIGH PRIORITY - API Routes (1-2 days)

#### 1. `/api/cart` Route (4-6 hours)
**File**: `app/api/cart/__tests__/route.test.ts`

**Test Cases:**
- ✅ GET: Returns 401 when user is not authenticated
- ✅ GET: Returns empty array when cart doesn't exist
- ✅ GET: Returns cart products for authenticated user
- ✅ POST: Returns 401 when user is not authenticated
- ✅ POST: Adds product to cart successfully
- ✅ POST: Returns 400 for invalid product ID
- ✅ POST: Returns 404 for non-existent product
- ✅ POST: Handles upsert correctly (creates cart if doesn't exist)
- ✅ DELETE: Returns 401 when user is not authenticated
- ✅ DELETE: Removes product from cart successfully
- ✅ DELETE: Returns empty array when cart is empty after deletion

**Why High Priority:**
- Core business logic
- Security-critical (authentication)
- Complex state management

#### 2. `/api/auth/signup` Route (2-3 hours)
**File**: `app/api/auth/signup/__tests__/route.test.ts`

**Test Cases:**
- ✅ Successfully creates new user with valid data
- ✅ Returns 400 for missing email
- ✅ Returns 400 for missing password
- ✅ Returns 400 for missing name
- ✅ Returns 409 when user already exists
- ✅ Properly hashes password (bcrypt)
- ✅ Validates email format
- ✅ Validates password strength

**Why High Priority:**
- Security-critical
- User data integrity
- Prevents duplicate accounts

#### 3. `/api/products` Routes (2-3 hours)
**Files**:
- `app/api/products/__tests__/route.test.ts`
- `app/api/products/__tests__/[id].test.ts`

**Test Cases:**
- ✅ GET /api/products: Returns all products
- ✅ GET /api/products: Handles database errors gracefully
- ✅ GET /api/products/[id]: Returns single product
- ✅ GET /api/products/[id]: Returns 404 for non-existent product
- ✅ PUT /api/products/[id]: Updates product (if implemented)
- ✅ DELETE /api/products/[id]: Deletes product (if implemented)

**Why High Priority:**
- Core functionality
- Public-facing data

---

### MEDIUM PRIORITY - React Components (1 day)

#### 4. ProductList Component (2-3 hours)
**File**: `app/__tests__/ProductList.test.tsx`

**Test Cases:**
- ✅ Renders all products correctly
- ✅ Shows "Add to Cart" button for products not in cart
- ✅ Shows "Remove from Cart" button for products in cart
- ✅ Calls addToCart when "Add to Cart" is clicked
- ✅ Calls removeFromCart when "Remove from Cart" is clicked
- ✅ Updates cart state after adding product
- ✅ Updates cart state after removing product
- ✅ Prevents navigation when clicking cart buttons
- ✅ Displays product images, names, and prices correctly

**Why Medium Priority:**
- Core user experience
- Complex interaction logic
- State management

#### 5. ShoppingCartList Component (1-2 hours)
**File**: `app/cart/__tests__/ShoppingCartList.test.tsx`

**Test Cases:**
- ✅ Renders cart items correctly
- ✅ Shows empty state when cart is empty
- ✅ Displays product names, prices, and images
- ✅ Calls removeFromCart when "Remove" is clicked
- ✅ Updates UI after removing item
- ✅ Prevents navigation when clicking remove button

**Why Medium Priority:**
- Important UX
- Critical user flow

#### 6. NavBar Component (1 hour)
**File**: `app/__tests__/navbar.test.tsx`

**Test Cases:**
- ✅ Renders navigation links correctly
- ✅ Shows sign out button
- ✅ Calls signOut when sign out button is clicked
- ✅ Redirects to login page after sign out
- ✅ Navigation links have correct href attributes

**Why Medium Priority:**
- Simple component
- Important for authentication flow

---

### LOWER PRIORITY - Pages & Integration (0.5-1 day)

#### 7. Page Components (3-4 hours)
**Files**: Various `__tests__/page.test.tsx` files

**Test Cases:**
- ✅ Products page loads and displays products
- ✅ Cart page loads and displays cart items
- ✅ Login page renders form correctly
- ✅ Signup page renders form correctly
- ✅ Product detail page loads product data

**Why Lower Priority:**
- More integration than unit testing
- Can be covered by E2E tests later

#### 8. Utility Functions (1-2 hours)
**File**: `app/api/__tests__/db.test.ts`

**Test Cases:**
- ✅ Database connection returns cached client on subsequent calls
- ✅ Database connection creates new client on first call
- ✅ Connection string is properly formatted
- ✅ Handles connection errors gracefully

**Why Lower Priority:**
- Simple utility functions
- Already well-tested in practice

---

## Recommended Phased Approach

### Phase 1: Minimal Viable Testing (1 day) - **START HERE**

Focus on the highest ROI tests:

1. **Setup testing infrastructure** (2-4 hours)
   - Install dependencies
   - Configure Jest
   - Create first test file

2. **Write critical API tests** (4 hours)
   - `/api/cart` route tests
   - `/api/auth/signup` tests

3. **Write key component test** (2 hours)
   - `ProductList` component tests

**Expected Coverage**: ~70% of critical business logic

**Value**: Catches most critical bugs, enables safe refactoring

---

### Phase 2: Comprehensive Coverage (2-3 additional days) - **OPTIONAL**

Expand test coverage:

1. **Remaining API routes** (4-5 hours)
   - Products endpoints
   - Other auth routes

2. **All interactive components** (4-5 hours)
   - ShoppingCartList
   - NavBar
   - Form components

3. **Integration tests** (4-5 hours)
   - Critical user flows
   - Page rendering tests

**Expected Coverage**: ~90% overall

**Value**: High confidence, comprehensive safety net

---

## Cost-Benefit Analysis

### Benefits
- ✅ **Catch bugs before production**: Find issues during development
- ✅ **Safe refactoring**: Change code with confidence
- ✅ **Documentation**: Tests serve as living documentation
- ✅ **Faster debugging**: Pinpoint issues quickly
- ✅ **Confidence in deployments**: Deploy without fear
- ✅ **Regression prevention**: Ensure old bugs don't return
- ✅ **Better code design**: Writing testable code improves architecture

### Costs
- ⏱️ **Initial setup**: 2-4 hours one-time investment
- ⏱️ **Writing tests**: 2-4 days (depending on coverage goals)
- ⏱️ **Maintenance overhead**: ~20% additional time for future changes
- 💰 **Learning curve**: Time to learn testing patterns (if new to testing)

### ROI Timeline
- **Week 1**: Negative (time investment)
- **Month 1**: Break-even (catching first bugs)
- **Month 3+**: Positive (faster development, fewer production bugs)

---

## Example Test Files

### Example: API Route Test

```typescript
// app/api/cart/__tests__/route.test.ts
import { NextRequest } from 'next/server';
import { GET, POST, DELETE } from '../route';
import { auth } from '@/auth';

// Mock dependencies
jest.mock('@/auth');
jest.mock('@/app/api/db');

describe('/api/cart', () => {
  describe('GET', () => {
    it('returns 401 when user is not authenticated', async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/cart');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns cart products for authenticated user', async () => {
      (auth as jest.Mock).mockResolvedValue({
        user: { id: 'user123', email: 'test@example.com' }
      });

      // Mock database response
      // ... setup mock data

      const request = new NextRequest('http://localhost:3000/api/cart');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
```

### Example: Component Test

```typescript
// app/__tests__/ProductList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductsList from '../ProductList';

const mockProducts = [
  { id: '1', name: 'Product 1', price: 10.99, imageUrl: 'test.jpg' },
  { id: '2', name: 'Product 2', price: 20.99, imageUrl: 'test2.jpg' },
];

describe('ProductsList', () => {
  it('renders all products', () => {
    render(
      <ProductsList
        products={mockProducts}
        initialCartProducts={[]}
      />
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('shows "Add to Cart" for products not in cart', () => {
    render(
      <ProductsList
        products={mockProducts}
        initialCartProducts={[]}
      />
    );

    const buttons = screen.getAllByText('Add to Cart');
    expect(buttons).toHaveLength(2);
  });

  it('calls addToCart when button is clicked', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([mockProducts[0]]),
      })
    ) as jest.Mock;

    render(
      <ProductsList
        products={mockProducts}
        initialCartProducts={[]}
      />
    );

    const button = screen.getAllByText('Add to Cart')[0];
    fireEvent.click(button);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/cart'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
```

---

## Best Practices

### 1. Test Organization
```
app/
├── api/
│   ├── cart/
│   │   ├── route.ts
│   │   └── __tests__/
│   │       └── route.test.ts
│   └── products/
│       ├── route.ts
│       └── __tests__/
│           └── route.test.ts
└── ProductList.tsx
    └── __tests__/
        └── ProductList.test.tsx
```

### 2. Naming Conventions
- Test files: `*.test.ts` or `*.test.tsx`
- Test suites: `describe('ComponentName', () => {})`
- Test cases: `it('should do something', () => {})`

### 3. AAA Pattern
```typescript
it('adds product to cart', async () => {
  // Arrange - Set up test data
  const mockProduct = { id: '1', name: 'Test' };

  // Act - Perform the action
  const result = await addToCart(mockProduct.id);

  // Assert - Verify the result
  expect(result).toContain(mockProduct);
});
```

### 4. Mocking Strategy
- Mock external dependencies (database, APIs)
- Mock NextAuth for authentication tests
- Use `mongodb-memory-server` for database tests
- Mock `fetch` for API calls in components

### 5. Coverage Goals
- **Minimum**: 60% overall coverage
- **Target**: 80% for business logic
- **Focus**: High-value, high-risk code

---

## Common Testing Patterns

### Testing API Routes with Auth
```typescript
import { auth } from '@/auth';

jest.mock('@/auth');

beforeEach(() => {
  (auth as jest.Mock).mockResolvedValue({
    user: { id: 'test-user', email: 'test@example.com' }
  });
});
```

### Testing Database Operations
```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

let mongod: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  client = new MongoClient(uri);
  await client.connect();
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});
```

### Testing React Components with User Events
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('handles user interaction', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);

  const button = screen.getByRole('button', { name: /click me/i });
  await user.click(button);

  expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
```

---

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

### Learning Resources
- [Testing JavaScript with Kent C. Dodds](https://testingjavascript.com/)
- [React Testing Library Tutorial](https://www.robinwieruch.de/react-testing-library/)
- [Jest Crash Course](https://www.youtube.com/watch?v=7r4xVDI2vho)

---

## Decision Framework

### When to Add Tests?

**Add tests NOW if:**
- ✅ Project will be maintained long-term
- ✅ Multiple developers working on codebase
- ✅ Complex business logic
- ✅ High cost of bugs (e.g., payment processing)
- ✅ Frequent refactoring expected

**Add tests LATER if:**
- ⏸️ Rapid prototyping/MVP stage
- ⏸️ Solo developer, short-term project
- ⏸️ Simple CRUD operations only
- ⏸️ Need to ship quickly for validation

**Our Recommendation for this project:**
Start with **Phase 1** (1 day) focusing on critical API routes. This gives you:
- Safety net for core functionality
- Foundation for future tests
- Confidence in deployments
- Minimal time investment

---

## Next Steps

1. **Review this document** and decide on testing scope
2. **Run setup commands** to install testing dependencies
3. **Create first test file** (start with `/api/cart` tests)
4. **Run tests**: `npm test`
5. **Iterate**: Add more tests as you develop new features

---

## Notes

- Tests are living documentation - keep them updated
- Red → Green → Refactor (TDD cycle)
- Test behavior, not implementation details
- Write tests that give you confidence
- Don't aim for 100% coverage - aim for meaningful coverage

---

**Last Updated**: 2025-11-17
**Status**: Ready for implementation
**Estimated Total Effort**: 2-4 days (depending on coverage goals)
