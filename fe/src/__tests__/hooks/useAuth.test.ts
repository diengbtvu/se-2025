import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'

// Mock authAPI
jest.mock('@/services/api', () => ({
  authAPI: {
    setToken: jest.fn(),
    clearToken: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

describe('useAuth Hook', () => {
  const mockAuthAPI = require('@/services/api').authAPI

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true) // Initially loading
  })

  it('should load user from localStorage on mount', async () => {
    const mockUser = {
      id: 1,
      userName: 'testuser',
      name: 'Test User',
      role: 'USER',
    }
    const mockToken = 'mock-token'

    localStorageMock.getItem.mockReturnValue(mockToken)
    mockAuthAPI.getProfile.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useAuth())

    // Wait for useEffect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.loading).toBe(false)
  })

  it('should handle login successfully', async () => {
    const mockToken = 'mock-token'
    const mockUser = {
      id: 1,
      userName: 'testuser',
      name: 'Test User',
      role: 'USER',
    }

    mockAuthAPI.login.mockResolvedValue({ token: mockToken })
    mockAuthAPI.getProfile.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      const loginResult = await result.current.login('testuser', 'password')
      expect(loginResult.success).toBe(true)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.token).toBe(mockToken)
    expect(mockAuthAPI.setToken).toHaveBeenCalledWith(mockToken)
  })

  it('should handle login failure', async () => {
    const errorMessage = 'Invalid credentials'
    mockAuthAPI.login.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      const loginResult = await result.current.login('testuser', 'wrongpassword')
      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe(errorMessage)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(mockAuthAPI.clearToken).toHaveBeenCalled()
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
  })

  it('should handle register successfully', async () => {
    const mockMessage = 'Registration successful'
    mockAuthAPI.register.mockResolvedValue(mockMessage)

    const { result } = renderHook(() => useAuth())

    const registerData = {
      userName: 'newuser',
      password: 'password123',
      name: 'New User',
      email: 'newuser@example.com',
      phoneNumber: '0987654321',
    }

    await act(async () => {
      const registerResult = await result.current.register(registerData)
      expect(registerResult.success).toBe(true)
      expect(registerResult.message).toBe(mockMessage)
    })

    expect(mockAuthAPI.register).toHaveBeenCalledWith(registerData)
  })

  it('should handle register failure', async () => {
    const errorMessage = 'Username already exists'
    mockAuthAPI.register.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useAuth())

    const registerData = {
      userName: 'existinguser',
      password: 'password123',
      name: 'Existing User',
      email: 'existing@example.com',
      phoneNumber: '0987654321',
    }

    await act(async () => {
      const registerResult = await result.current.register(registerData)
      expect(registerResult.success).toBe(false)
      expect(registerResult.error).toBe(errorMessage)
    })
  })

  it('should handle refresh profile', async () => {
    const mockUser = {
      id: 1,
      userName: 'testuser',
      name: 'Test User',
      role: 'USER',
    }

    mockAuthAPI.getProfile.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      const refreshResult = await result.current.refreshProfile()
      expect(refreshResult.success).toBe(true)
      expect(refreshResult.user).toEqual(mockUser)
    })

    expect(result.current.user).toEqual(mockUser)
  })

  it('should handle profile refresh failure', async () => {
    mockAuthAPI.getProfile.mockRejectedValue(new Error('Profile fetch failed'))

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      const refreshResult = await result.current.refreshProfile()
      expect(refreshResult.success).toBe(false)
    })

    // Should logout on profile refresh failure
    expect(result.current.isAuthenticated).toBe(false)
    expect(mockAuthAPI.clearToken).toHaveBeenCalled()
  })

  it('should handle update profile', async () => {
    const updatedUser = {
      id: 1,
      userName: 'testuser',
      name: 'Updated Name',
      role: 'USER',
    }

    mockAuthAPI.updateProfile.mockResolvedValue(updatedUser)

    const { result } = renderHook(() => useAuth())

    const updateData = {
      name: 'Updated Name',
      phoneNumber: '0987654321',
    }

    await act(async () => {
      const updateResult = await result.current.updateProfile(updateData)
      expect(updateResult.success).toBe(true)
      expect(updateResult.user).toEqual(updatedUser)
    })

    expect(result.current.user).toEqual(updatedUser)
    expect(mockAuthAPI.updateProfile).toHaveBeenCalledWith(updateData)
  })

  it('should handle invalid token on mount', async () => {
    const mockToken = 'invalid-token'
    localStorageMock.getItem.mockReturnValue(mockToken)
    mockAuthAPI.getProfile.mockRejectedValue(new Error('Invalid token'))

    const { result } = renderHook(() => useAuth())

    // Wait for useEffect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(mockAuthAPI.clearToken).toHaveBeenCalled()
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
  })
}) 