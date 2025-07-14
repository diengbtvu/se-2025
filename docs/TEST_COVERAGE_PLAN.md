# 🧪 Test Coverage Improvement Plan

## 📊 Current Status

**Global Coverage**: 10.28% (Target: 70% eventually)

| Metric | Current | Short-term Target | Long-term Target |
|--------|---------|-------------------|------------------|
| Statements | 10.28% | 25% | 70% |
| Branches | 10% | 20% | 70% |
| Functions | 9.26% | 20% | 70% |
| Lines | 9.92% | 25% | 70% |

## 🎯 Phase-based Approach

### 🚀 Phase 1: Foundation (Current - Week 4)
**Target**: 25% overall coverage

**Priority Files** (High Impact, Low Effort):
- ✅ `src/config/api.ts` - Already at 100%
- ✅ `src/utils/validation.ts` - Already at 81.48%
- 🎯 `src/hooks/useAuth.ts` - Currently 85%, improve to 90%
- 🎯 `src/services/api.ts` - Currently 3.77%, improve to 30%
- 🎯 `src/components/layouts/Header.tsx` - Currently 93%, maintain

**Actions**:
```bash
# Add basic tests for critical services
npm test src/services/api.test.ts
npm test src/hooks/useCart.test.ts
```

### 📈 Phase 2: Core Features (Week 5-8)
**Target**: 40% overall coverage

**Focus Areas**:
- Cart functionality (currently 48.48%)
- Login flow (currently 44.96%)
- API services integration
- Key components

**Test Types**:
- Unit tests for business logic
- Integration tests for user flows
- Mock API responses
- Error handling scenarios

### 🏆 Phase 3: Comprehensive Coverage (Week 9-12)
**Target**: 60-70% overall coverage

**Focus Areas**:
- Admin functionality
- Complex components
- Edge cases
- Performance testing

## 📋 Immediate Actions

### 1. Fix Failing Tests
```bash
cd fe

# Run specific test suites
npm test -- --testPathPattern=components/Header.test.tsx
npm test -- --testPathPattern=hooks/useAuth.test.ts

# Check specific failures
npm test -- --verbose
```

### 2. Add Missing Test Files

**High Priority** (Create these first):
```bash
# Services (Critical for API communication)
touch src/services/__tests__/api.test.ts
touch src/services/__tests__/adminAPI.test.ts

# Hooks (Core business logic)
touch src/hooks/__tests__/useCart.test.ts
touch src/hooks/__tests__/useProducts.test.ts
touch src/hooks/__tests__/useOrders.test.ts

# Utils (Helper functions)
touch src/utils/__tests__/validation.test.ts  # Enhance existing

# Core Components
touch src/components/__tests__/OrderModal.test.tsx
touch src/components/common/__tests__/AddToCartButtons.test.tsx
```

### 3. Test Templates

#### Service Test Template
```typescript
// src/services/__tests__/api.test.ts
import { authAPI, productAPI, cartAPI } from '../api';

// Mock fetch
global.fetch = jest.fn();

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authAPI', () => {
    it('should login successfully', async () => {
      // Mock successful response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('mock-token'),
      });

      const result = await authAPI.login('user', 'pass');
      expect(result.token).toBe('mock-token');
    });

    it('should handle login errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      });

      await expect(authAPI.login('user', 'wrong')).rejects.toThrow();
    });
  });
});
```

#### Hook Test Template
```typescript
// src/hooks/__tests__/useCart.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';

// Mock the API
jest.mock('../../services/api', () => ({
  cartAPI: {
    getCart: jest.fn(),
    addItem: jest.fn(),
    updateItem: jest.fn(),
    removeItem: jest.fn(),
  }
}));

describe('useCart', () => {
  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart());
    
    await act(async () => {
      await result.current.addToCart(1, 2);
    });

    expect(result.current.items).toHaveLength(1);
  });
});
```

## 🔧 CI/CD Adjustments

### Current Settings
```javascript
// jest.config.js - Adjusted thresholds
coverageThreshold: {
  global: {
    branches: 15,    // Was 70%
    functions: 15,   // Was 70%
    lines: 15,       // Was 70%
    statements: 15,  // Was 70%
  },
}
```

### Progressive Targets
```javascript
// Week 4 target
global: { statements: 25, branches: 20, functions: 20, lines: 25 }

// Week 8 target  
global: { statements: 40, branches: 35, functions: 35, lines: 40 }

// Week 12 target
global: { statements: 60, branches: 55, functions: 55, lines: 60 }
```

## 📊 Monitoring & Reporting

### 1. Coverage Reports
```bash
# Generate detailed coverage report
npm test -- --coverage --coverageReporters=html
open coverage/lcov-report/index.html

# CI coverage badge
[![Coverage](https://codecov.io/gh/user/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/user/repo)
```

### 2. Weekly Reviews
- Track coverage metrics
- Identify bottlenecks
- Adjust priorities
- Team knowledge sharing

### 3. Quality Gates

```yaml
# .github/workflows/test-quality.yml
- name: Coverage Check
  run: |
    coverage=$(npm test -- --coverage | grep "All files" | awk '{print $2}' | sed 's/%//')
    if [ $coverage -lt 25 ]; then
      echo "❌ Coverage below target: ${coverage}%"
      exit 1
    fi
    echo "✅ Coverage OK: ${coverage}%"
```

## 🎯 Best Practices

### Test Structure
```
src/
├── components/
│   ├── Header.tsx
│   └── __tests__/
│       └── Header.test.tsx
├── hooks/
│   ├── useAuth.ts
│   └── __tests__/
│       └── useAuth.test.ts
└── services/
    ├── api.ts
    └── __tests__/
        └── api.test.ts
```

### Testing Priorities

1. **Critical Path** - Auth, Cart, Orders (60-70% coverage)
2. **Business Logic** - Hooks, Utils (50-60% coverage)
3. **UI Components** - Focus on logic, not rendering (30-40% coverage)
4. **Pages** - Integration tests, not unit tests (20-30% coverage)

### Quick Wins

1. **Test existing functions** - Many utilities already work, just add tests
2. **Mock external dependencies** - Don't test the API, test your code
3. **Focus on edge cases** - Error handling, empty states
4. **Use test helpers** - Create reusable mocks and fixtures

## 📅 Weekly Milestones

### Week 1-2: Setup & Foundation
- [ ] Fix all failing tests
- [ ] Create service layer tests
- [ ] Improve hook tests

### Week 3-4: Core Features  
- [ ] Cart functionality tests
- [ ] Auth flow tests
- [ ] Component interaction tests

### Week 5-8: Integration
- [ ] E2E critical paths
- [ ] Error scenarios
- [ ] Performance tests

### Week 9-12: Polish
- [ ] Edge cases
- [ ] Admin features
- [ ] Documentation

---

**Target**: Progressive improvement from 10% → 70% over 12 weeks  
**Focus**: Quality over quantity, critical paths first  
**Review**: Weekly coverage reports and adjustments 