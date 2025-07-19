import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import Cart from '@/app/cart/page'

// Mock hooks
jest.mock('@/hooks/useAuth')
jest.mock('@/hooks/useCart')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

const mockCart = {
  id: 1,
  customerId: 1,
  cartItems: [
    {
      id: 1,
      productId: 1,
      productName: 'BeeLife Smart Hive',
      price: 15000000,
      quantity: 2,
      imageUrl: '/images/test-hive.jpg',
    },
    {
      id: 2,
      productId: 2,
      productName: 'BeeLife Monitor',
      price: 5000000,
      quantity: 1,
      imageUrl: '/images/test-monitor.jpg',
    },
  ],
  totalAmount: 35000000,
}

describe('Cart Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, userName: 'testuser', name: 'Test User', role: 'USER' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      refreshProfile: jest.fn(),
      updateProfile: jest.fn(),
    })

    mockUseCart.mockReturnValue({
      cart: mockCart,
      loading: false,
      error: null,
      addToCart: jest.fn(),
      updateCartItem: jest.fn(),
      removeFromCart: jest.fn(),
      checkoutAll: jest.fn(),
      clearCart: jest.fn(),
      getTotalItems: jest.fn().mockReturnValue(3),
    })
  })

  it('displays cart items correctly', () => {
    render(<Cart />)
    
    expect(screen.getByText('Giỏ hàng')).toBeInTheDocument()
    expect(screen.getByText('BeeLife Smart Hive')).toBeInTheDocument()
    expect(screen.getByText('BeeLife Monitor')).toBeInTheDocument()
    expect(screen.getByText('35,000,000 VNĐ')).toBeInTheDocument()
  })

  it('allows updating item quantity', async () => {
    const user = userEvent.setup()
    const mockUpdateCartItem = jest.fn()
    mockUseCart.mockReturnValue({
      ...mockUseCart(),
      updateCartItem: mockUpdateCartItem,
    })

    render(<Cart />)
    
    // Find quantity display and click + button to increase
    const plusButtons = screen.getAllByText('+')
    await user.click(plusButtons[0])
    
    await waitFor(() => {
      expect(mockUpdateCartItem).toHaveBeenCalled()
    })
  })

  it('allows removing items from cart', async () => {
    const user = userEvent.setup()
    const mockRemoveFromCart = jest.fn()
    mockUseCart.mockReturnValue({
      ...mockUseCart(),
      removeFromCart: mockRemoveFromCart,
    })

    // Mock window.confirm to return true BEFORE rendering
    global.confirm = jest.fn(() => true)

    render(<Cart />)
    
    // Find remove buttons by their role and position (first item)
    const removeButtons = screen.getAllByRole('button').filter(button => 
      button.className.includes('text-red-500') || button.className.includes('hover:text-red-700')
    )
    await user.click(removeButtons[0])
    
    await waitFor(() => {
      expect(mockRemoveFromCart).toHaveBeenCalled()
    })
  })

  it('allows clearing entire cart', async () => {
    const user = userEvent.setup()
    const mockClearCart = jest.fn()
    mockUseCart.mockReturnValue({
      ...mockUseCart(),
      clearCart: mockClearCart,
    })

    // Mock window.confirm to return true BEFORE rendering
    global.confirm = jest.fn(() => true)

    render(<Cart />)
    
    const clearButton = screen.getByText('Xóa tất cả')
    await user.click(clearButton)
    
    await waitFor(() => {
      expect(mockClearCart).toHaveBeenCalled()
    })
  })

  it('allows checkout with note', async () => {
    const user = userEvent.setup()
    const mockCheckoutAll = jest.fn().mockResolvedValue({ success: true })
    mockUseCart.mockReturnValue({
      ...mockUseCart(),
      checkoutAll: mockCheckoutAll,
    })

    render(<Cart />)
    
    const noteInput = screen.getByPlaceholderText('Ghi chú về đơn hàng của bạn...')
    await user.type(noteInput, 'Giao hàng vào buổi sáng')
    
    const checkoutButton = screen.getByText('Đặt hàng ngay')
    await user.click(checkoutButton)
    
    await waitFor(() => {
      expect(mockCheckoutAll).toHaveBeenCalledWith('Giao hàng vào buổi sáng')
    })
  })

  it('shows empty cart message when cart is empty', () => {
    mockUseCart.mockReturnValue({
      cart: { ...mockCart, cartItems: [] },
      loading: false,
      error: null,
      addToCart: jest.fn(),
      updateCartItem: jest.fn(),
      removeFromCart: jest.fn(),
      checkoutAll: jest.fn(),
      clearCart: jest.fn(),
      getTotalItems: jest.fn().mockReturnValue(0),
    })

    render(<Cart />)
    
    expect(screen.getByText('Giỏ hàng trống')).toBeInTheDocument()
    expect(screen.getByText('Bạn chưa có sản phẩm nào trong giỏ hàng')).toBeInTheDocument()
    expect(screen.getByText('Tiếp tục mua sắm')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockUseCart.mockReturnValue({
      ...mockUseCart(),
      loading: true,
    })

    render(<Cart />)
    
    expect(screen.getByText('Đang tải giỏ hàng...')).toBeInTheDocument()
  })

  it('shows error message when there is an error', () => {
    mockUseCart.mockReturnValue({
      ...mockUseCart(),
      error: 'Không thể tải giỏ hàng',
    })

    render(<Cart />)
    
    expect(screen.getByText('Không thể tải giỏ hàng')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      refreshProfile: jest.fn(),
      updateProfile: jest.fn(),
    })

    render(<Cart />)
    
    // Should redirect to login (this would be handled by useEffect)
    expect(screen.queryByText('Giỏ hàng')).not.toBeInTheDocument()
  })
}) 