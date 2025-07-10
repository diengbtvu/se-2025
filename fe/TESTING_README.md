# Testing Guide - BeeLife Frontend

## Cài đặt và Chạy Tests

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy tests

#### Chạy tất cả tests:
```bash
npm test
```

#### Chạy tests với watch mode (tự động chạy lại khi có thay đổi):
```bash
npm run test:watch
```

#### Chạy tests với coverage report:
```bash
npm run test:coverage
```

#### Chạy tests trong CI/CD environment:
```bash
npm run test:ci
```

## Cấu trúc Tests

```
src/
├── __tests__/
│   ├── components/          # Component tests
│   │   ├── Header.test.tsx
│   │   ├── ProductCard.test.tsx
│   │   └── ...
│   ├── hooks/              # Hook tests
│   │   ├── useAuth.test.ts
│   │   └── ...
│   ├── pages/              # Page tests
│   │   ├── Login.test.tsx
│   │   └── ...
│   ├── utils/              # Utility function tests
│   │   ├── validation.test.ts
│   │   └── ...
│   └── integration/        # Integration tests
│       ├── CartFlow.test.tsx
│       └── ...
```

## Các loại Tests

### 1. Unit Tests
- **Components**: Test từng component riêng lẻ
- **Hooks**: Test custom hooks
- **Utils**: Test utility functions

### 2. Integration Tests
- **Page Flows**: Test toàn bộ flow của một trang
- **User Interactions**: Test tương tác người dùng
- **API Integration**: Test tích hợp với API

### 3. E2E Tests (Có thể thêm sau)
- **User Journeys**: Test toàn bộ user journey
- **Critical Paths**: Test các đường dẫn quan trọng

## Ví dụ Test Cases

### Component Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/layouts/Header'

describe('Header Component', () => {
  it('renders logo and navigation links', () => {
    render(<Header />)
    
    expect(screen.getByText('BeeLife')).toBeInTheDocument()
    expect(screen.getByText('Trang chủ')).toBeInTheDocument()
  })
})
```

### Hook Test
```typescript
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'

describe('useAuth Hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })
})
```

### Integration Test
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cart from '@/app/cart/page'

describe('Cart Flow Integration', () => {
  it('allows updating item quantity', async () => {
    const user = userEvent.setup()
    render(<Cart />)
    
    const quantityInput = screen.getByDisplayValue('2')
    await user.clear(quantityInput)
    await user.type(quantityInput, '3')
    
    await waitFor(() => {
      expect(mockUpdateCartItem).toHaveBeenCalledWith(1, 3)
    })
  })
})
```

## Testing Best Practices

### 1. Test Structure (AAA Pattern)
```typescript
describe('Component Name', () => {
  it('should do something', () => {
    // Arrange - Setup test data
    const mockData = { id: 1, name: 'Test' }
    
    // Act - Perform the action
    render(<Component data={mockData} />)
    
    // Assert - Verify the result
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### 2. Mocking
```typescript
// Mock external dependencies
jest.mock('@/hooks/useAuth')
jest.mock('next/navigation')

// Mock API calls
global.fetch = jest.fn()
```

### 3. User Interactions
```typescript
// Use userEvent for better user interaction simulation
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'text')
```

### 4. Async Testing
```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

## Coverage Targets

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

## Debugging Tests

### 1. Debug một test cụ thể
```bash
npm test -- --testNamePattern="Header Component"
```

### 2. Debug với console.log
```typescript
it('should work', () => {
  console.log('Debug info')
  // test code
})
```

### 3. Debug với debugger
```typescript
it('should work', () => {
  debugger
  // test code
})
```

## Common Issues và Solutions

### 1. Mock không hoạt động
```typescript
// Đảm bảo mock được setup trước khi test
beforeEach(() => {
  jest.clearAllMocks()
})
```

### 2. Async test không đợi
```typescript
// Sử dụng waitFor thay vì setTimeout
await waitFor(() => {
  expect(element).toBeInTheDocument()
})
```

### 3. Component không render
```typescript
// Kiểm tra mocks và providers
const wrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
)
render(<Component />, { wrapper })
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
```

## Performance Testing

### 1. Bundle Size
```bash
npm run build
# Kiểm tra bundle size trong .next/static
```

### 2. Lighthouse CI
```bash
npm install -g @lhci/cli
lhci autorun
```

## Security Testing

### 1. Dependency Scanning
```bash
npm audit
npm audit fix
```

### 2. XSS Testing
```typescript
it('should not render HTML in user input', () => {
  const maliciousInput = '<script>alert("xss")</script>'
  render(<Component userInput={maliciousInput} />)
  
  expect(screen.queryByText('<script>')).not.toBeInTheDocument()
})
```

## Tips và Tricks

1. **Sử dụng data-testid cho elements khó select**
```typescript
<button data-testid="submit-button">Submit</button>
screen.getByTestId('submit-button')
```

2. **Test error states**
```typescript
it('shows error message', () => {
  render(<Component error="Something went wrong" />)
  expect(screen.getByText('Something went wrong')).toBeInTheDocument()
})
```

3. **Test loading states**
```typescript
it('shows loading spinner', () => {
  render(<Component loading={true} />)
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
})
```

4. **Test accessibility**
```typescript
it('has proper ARIA labels', () => {
  render(<Component />)
  expect(screen.getByLabelText('Search')).toBeInTheDocument()
})
``` 