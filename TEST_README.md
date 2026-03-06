# Book Library Application - Testing Guide

## Overview

This repository contains a comprehensive test suite for the Book Library Application, demonstrating professional QA practices with both E2E and unit testing approaches.

## Test Suite Summary

- **Total Tests**: 70
- **E2E Tests (Playwright)**: 32 tests across 7 files
- **Unit Tests (Vitest)**: 38 tests across 3 files

## Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **npm**: 9+ (comes with Node.js)
- **Operating System**: Windows, macOS, or Linux
- **Browser**: Chromium (auto-installed by Playwright)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 2c-qa-engineer-tech-test
```

### 2. Install Dependencies

```bash
npm install
```

This will automatically:
- Install all project dependencies
- Install Playwright browsers (via postinstall script)

### 3. Verify Installation

```bash
# Check Node.js version
node --version  # Should be 18+

# Check npm version
npm --version   # Should be 9+
```

## Running the Application

### Start Development Server
```bash
npm run dev
```

#### To install all browsers
```bash
npx playwright install
```

The application will be available at: http://localhost:3000

**Note**: The dev server must be running for E2E tests to work (Playwright config handles this automatically).

## Running Tests

### E2E Tests (Playwright)

#### Run All E2E Tests
```bash
npm run test:e2e
```

#### Run Specific Test File
```bash
npx playwright test tests/home-page.spec.ts
```

#### Run in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

#### Run on Specific Browser
```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit only
npx playwright test --project=webkit
```

#### Run with UI Mode (Interactive)
```bash
npx playwright test --ui
```

#### View Test Report
After running E2E tests, an HTML report is automatically generated.

```bash
# View the latest test report
npx playwright show-report
```

The report includes:
- Test results with pass/fail status
- Screenshots of failures
- Video recordings of failed tests
- Execution timeline
- Detailed error messages and stack traces

The report will open in your browser at http://localhost:9323

#### Debug Tests
```bash
npx playwright test --debug
```

### Unit Tests (Vitest)

#### Run All Unit Tests
```bash
npm test
```

#### Run in Watch Mode
```bash
npm test -- --watch
```

#### Run with Coverage Report
```bash
npm test -- --coverage
```

#### Run Specific Test File
```bash
npm test src/lib/__tests__/books-data.test.ts
```

#### Run in UI Mode
```bash
npm test -- --ui
```

## Test Structure

### E2E Tests (Playwright)

```
tests/
├── home-page.spec.ts           # Home page book list display
├── book-detail.spec.ts         # Book detail page & 404 handling
├── add-book.spec.ts            # Add book form functionality
├── form-validation.spec.ts     # Form validation (HTML5 & API)
├── error-scenarios.spec.ts     # Error handling & edge cases
├── navigation.spec.ts          # Navigation flows & browser controls
└── edge-cases.spec.ts          # Special characters, long text, boundaries
```

### Unit Tests (Vitest)

```
src/
├── lib/__tests__/
│   └── books-data.test.ts                    # Data store operations
├── app/api/books/__tests__/
│   └── route.test.ts                         # GET & POST /api/books
└── app/api/books/[id]/__tests__/
    └── route.test.ts                         # GET /api/books/[id]
```

## Test Coverage

### E2E Test Coverage (32 tests)

| Feature | Tests | File |
|---------|-------|------|
| Home Page | 1 | `home-page.spec.ts` |
| Book Detail | 2 | `book-detail.spec.ts` |
| Add Book Form | 4 | `add-book.spec.ts` |
| Form Validation | 5 | `form-validation.spec.ts` |
| Error Scenarios | 3 | `error-scenarios.spec.ts` |
| Navigation | 5 | `navigation.spec.ts` |
| Edge Cases | 4 | `edge-cases.spec.ts` |

### Unit Test Coverage (38 tests)

| Component | Tests | File |
|-----------|-------|------|
| Data Store | 17 | `books-data.test.ts` |
| GET /api/books | 3 | `route.test.ts` |
| POST /api/books | 10 | `route.test.ts` |
| GET /api/books/[id] | 8 | `route.test.ts` |

## Configuration Files

### Playwright Configuration
- **File**: `playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit
- **Base URL**: http://localhost:3000
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Retries**: 2 on CI, 0 locally

### Vitest Configuration
- **File**: `vitest.config.mts`
- **Environment**: jsdom
- **Globals**: Enabled
- **Setup Files**: `src/test/setup.ts`
- **Path Aliases**: `@` resolves to `./src`
- **Include**: `src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`
- **Exclude**: `node_modules`, `dist`, `tests`

## Troubleshooting

### Playwright Browser Not Found

If you see "Executable doesn't exist" error:

```bash
npx playwright install chromium
```

### Vitest ESM Module Error

Add `"type": "module"` to `package.json` or rename config to `vitest.config.mts`.

### Port 3000 Already in Use

Kill the process using port 3000 or change the port in `playwright.config.ts`.

### Tests Timing Out

Increase timeout in test files:
```typescript
test('my test', async ({ page }) => {
  // ...
}, { timeout: 10000 }); // 10 seconds
```

## Best Practices Demonstrated

### 1. Structured Test Organization
- Clear test descriptions
- Logical grouping with `test.describe()`
- Step-by-step execution with `test.step()`

### 2. Custom Error Messages
```typescript
await expect(element, 'Helpful error message').toBeVisible();
```

### 3. Role-Based Locators
```typescript
// Accessibility-friendly
await page.getByRole('button', { name: 'Add Book' });

// Fragile
await page.locator('.submit-btn');
```

### 4. Proper Mocking
```typescript
vi.mock('@/lib/books-data', () => ({
  getBooks: vi.fn(),
}));
```

### 5. Test Isolation
- Each test is independent
- No shared state between tests
- Can run in any order


## Test Reports

### Playwright HTML Report
After running E2E tests, view the report:
```bash
npx playwright show-report
```

Features:
- Test results with screenshots
- Video recordings of failures
- Execution timeline
- Trace viewer for debugging

### Vitest Coverage Report
Generate coverage report:
```bash
npm test -- --coverage
```

View in browser:
```bash
open coverage/index.html  # macOS
start coverage/index.html # Windows
```

## Key Features Tested

### User Journeys
- View book list on home page
- Click book to view details
- Add new book via form
- Navigate between pages
- Use browser back/forward buttons

### Form Validation
- HTML5 validation (required fields)
- API validation (server-side)
- Field constraints (year, rating, pages)
- Empty field handling
- Invalid data handling

### Error Scenarios
- 404 for non-existent books
- Invalid book ID format
- API validation errors
- Recovery options (Back to Library)

### Edge Cases
- Special characters (&, ", ', <, >)
- Very long text (200+ chars)
- Numeric boundaries (min/max values)
- Empty states

### API Endpoints
- GET /api/books - List all books
- GET /api/books/[id] - Get book by ID
- POST /api/books - Create new book

### Data Operations
- getBooks() - Retrieve all books
- getBookById() - Find book by ID
- addBook() - Add new book with unique ID

## Performance

- **Unit Tests**: ~200ms total (very fast)
- **E2E Tests**: ~2-5 seconds per test
- **Total Test Suite**: ~3-5 minutes (all browsers)

---

**Happy Testing! 🚀**
