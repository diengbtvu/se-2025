import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import Header from '@/components/layouts/Header'

// Mock hooks
jest.mock('@/hooks/useAuth')
jest.mock('@/hooks/useCart')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

describe('Header Component', () => {
  const defaultAuthProps = {
    isAuthenticated: false,
    user: null,
    logout: jest.fn(),
  }

  const defaultCartProps = {
    getTotalItems: jest.fn().mockReturnValue(0),
    cart: null,
    loading: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue(defaultAuthProps)
    mockUseCart.mockReturnValue(defaultCartProps)
  })

  it('renders logo and navigation links', () => {
    render(<Header />)
    
    expect(screen.getByAltText('BeeLife Logo')).toBeInTheDocument()
    expect(screen.getByText('Sản phẩm')).toBeInTheDocument()
    expect(screen.getByText('Nhà nông')).toBeInTheDocument()
    expect(screen.getByText('Nuôi ong')).toBeInTheDocument()
    expect(screen.getByText('Nuôi ong đô thị')).toBeInTheDocument()
    expect(screen.getByText('Tác động')).toBeInTheDocument()
  })

  it('shows login and get started buttons when user is not authenticated', () => {
    render(<Header />)
    
    expect(screen.getByText('Đăng nhập')).toBeInTheDocument()
    expect(screen.getByText('Bắt đầu ngay')).toBeInTheDocument()
    expect(screen.queryByText('Giỏ hàng')).not.toBeInTheDocument()
  })

  it('shows user menu when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      isAuthenticated: true,
      user: {
        id: 1,
        userName: 'testuser',
        name: 'Test User',
        role: 'USER',
      },
    })

    render(<Header />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByLabelText('Giỏ hàng')).toBeInTheDocument()
  })

  it('shows admin link when user is admin', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      isAuthenticated: true,
      user: {
        id: 1,
        userName: 'admin',
        name: 'Admin User',
        role: 'ADMIN',
      },
    })

    render(<Header />)
    
    expect(screen.getByText('Quản lý Admin')).toBeInTheDocument()
  })

  it('calls logout when logout button is clicked', async () => {
    const mockLogout = jest.fn()
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      isAuthenticated: true,
      user: {
        id: 1,
        userName: 'testuser',
        name: 'Test User',
        role: 'USER',
      },
      logout: mockLogout,
    })

    render(<Header />)
    
    // Hover over user menu to show dropdown
    const userButton = screen.getByText('Test User')
    fireEvent.mouseEnter(userButton)
    
    await waitFor(() => {
      const logoutButton = screen.getByText('Đăng xuất')
      fireEvent.click(logoutButton)
    })
    
    expect(mockLogout).toHaveBeenCalled()
  })

  it('shows cart badge when cart has items', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      isAuthenticated: true,
      user: {
        id: 1,
        userName: 'testuser',
        name: 'Test User',
        role: 'USER',
      },
    })

    mockUseCart.mockReturnValue({
      ...defaultCartProps,
      getTotalItems: jest.fn().mockReturnValue(3),
    })

    render(<Header />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('navigates to cart when cart button is clicked', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      isAuthenticated: true,
      user: {
        id: 1,
        userName: 'testuser',
        name: 'Test User',
        role: 'USER',
      },
    })

    render(<Header />)
    
    const cartButton = screen.getByLabelText('Giỏ hàng')
    expect(cartButton).toHaveAttribute('href', '/cart')
  })

  it('navigates to orders when orders link is clicked', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      isAuthenticated: true,
      user: {
        id: 1,
        userName: 'testuser',
        name: 'Test User',
        role: 'USER',
      },
    })

    render(<Header />)
    
    // Hover over user menu to show dropdown
    const userButton = screen.getByText('Test User')
    fireEvent.mouseEnter(userButton)
    
    waitFor(() => {
      const ordersLink = screen.getByText('Đơn hàng của tôi')
      expect(ordersLink).toHaveAttribute('href', '/orders')
    })
  })

  it('shows user avatar with first letter of name', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      isAuthenticated: true,
      user: {
        id: 1,
        userName: 'testuser',
        name: 'Test User',
        role: 'USER',
      },
    })

    render(<Header />)
    
    expect(screen.getByText('T')).toBeInTheDocument() // First letter of "Test User"
  })

  it('shows default avatar when user has no name', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      isAuthenticated: true,
      user: {
        id: 1,
        userName: 'testuser',
        name: '',
        role: 'USER',
      },
    })

    render(<Header />)
    
    expect(screen.getByText('U')).toBeInTheDocument() // Default avatar
  })

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Header />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)
    
    // Should show mobile menu items
    expect(screen.getByText('Sản phẩm')).toBeInTheDocument()
  })
}) 