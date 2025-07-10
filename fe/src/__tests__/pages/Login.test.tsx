import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '@/app/login/page'

// Mock useAuth hook
jest.mock('@/hooks/useAuth')

const mockUseAuth = {
  isAuthenticated: false,
  user: null,
  loading: false,
  login: jest.fn(),
  register: jest.fn(),
}

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}))

// Mock ReCAPTCHA
jest.mock('react-google-recaptcha', () => {
  return function MockRecaptcha({ onChange }: { onChange: (token: string | null) => void }) {
    return (
      <div data-testid="recaptcha">
        <button onClick={() => onChange('mock-token')}>Verify</button>
      </div>
    )
  }
})

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form by default', () => {
    render(<Login />)
    
    expect(screen.getByText('Đăng nhập')).toBeInTheDocument()
    expect(screen.getByLabelText('Tên đăng nhập')).toBeInTheDocument()
    expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đăng nhập', type: 'submit' })).toBeInTheDocument()
  })

  it('switches to register form when register button is clicked', async () => {
    const user = userEvent.setup()
    render(<Login />)
    
    // Click on the register tab button
    const registerTabButton = screen.getByRole('button', { name: 'Đăng ký' })
    await user.click(registerTabButton)
    
    expect(screen.getByText('Đăng ký')).toBeInTheDocument()
    expect(screen.getByLabelText('Họ và tên')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Số điện thoại')).toBeInTheDocument()
    expect(screen.getByLabelText('Xác nhận mật khẩu')).toBeInTheDocument()
  })

  it('validates login form fields', async () => {
    const user = userEvent.setup()
    render(<Login />)
    
    const loginButton = screen.getByRole('button', { name: 'Đăng nhập', type: 'submit' })
    await user.click(loginButton)
    
    expect(screen.getByText('Vui lòng nhập tên đăng nhập')).toBeInTheDocument()
    expect(screen.getByText('Vui lòng nhập mật khẩu')).toBeInTheDocument()
  })

  it('validates register form fields', async () => {
    const user = userEvent.setup()
    render(<Login />)
    
    // Switch to register form
    const registerTabButton = screen.getByRole('button', { name: 'Đăng ký' })
    await user.click(registerTabButton)
    
    const registerButton = screen.getByRole('button', { name: 'Đăng ký', type: 'submit' })
    await user.click(registerButton)
    
    expect(screen.getByText('Vui lòng nhập họ và tên')).toBeInTheDocument()
    expect(screen.getByText('Vui lòng nhập tên đăng nhập')).toBeInTheDocument()
    expect(screen.getByText('Vui lòng nhập email')).toBeInTheDocument()
    expect(screen.getByText('Vui lòng nhập số điện thoại')).toBeInTheDocument()
    expect(screen.getByText('Vui lòng nhập mật khẩu')).toBeInTheDocument()
  })

  it('validates email format in register form', async () => {
    const user = userEvent.setup()
    render(<Login />)
    
    // Switch to register form
    const registerTabButton = screen.getByRole('button', { name: 'Đăng ký' })
    await user.click(registerTabButton)
    
    // Fill in required fields
    await user.type(screen.getByLabelText('Họ và tên'), 'Test User')
    await user.type(screen.getByLabelText('Tên đăng nhập'), 'testuser')
    await user.type(screen.getByLabelText('Email'), 'invalid-email')
    await user.type(screen.getByLabelText('Số điện thoại'), '0987654321')
    await user.type(screen.getByLabelText('Mật khẩu'), 'password123')
    await user.type(screen.getByLabelText('Xác nhận mật khẩu'), 'password123')
    
    // Verify reCAPTCHA
    const recaptchaButton = screen.getByTestId('recaptcha').querySelector('button')
    if (recaptchaButton) {
      await user.click(recaptchaButton)
    }
    
    const registerButton = screen.getByRole('button', { name: 'Đăng ký', type: 'submit' })
    await user.click(registerButton)
    
    expect(screen.getByText('Email không hợp lệ. Ví dụ: example@email.com')).toBeInTheDocument()
  })

  it('validates phone number format in register form', async () => {
    const user = userEvent.setup()
    render(<Login />)
    
    // Switch to register form
    const registerTabButton = screen.getByRole('button', { name: 'Đăng ký' })
    await user.click(registerTabButton)
    
    // Fill in required fields
    await user.type(screen.getByLabelText('Họ và tên'), 'Test User')
    await user.type(screen.getByLabelText('Tên đăng nhập'), 'testuser')
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Số điện thoại'), '123')
    await user.type(screen.getByLabelText('Mật khẩu'), 'password123')
    await user.type(screen.getByLabelText('Xác nhận mật khẩu'), 'password123')
    
    // Verify reCAPTCHA
    const recaptchaButton = screen.getByTestId('recaptcha').querySelector('button')
    if (recaptchaButton) {
      await user.click(recaptchaButton)
    }
    
    const registerButton = screen.getByRole('button', { name: 'Đăng ký', type: 'submit' })
    await user.click(registerButton)
    
    expect(screen.getByText('Số điện thoại không hợp lệ. Ví dụ: 0987654321 hoặc +84987654321')).toBeInTheDocument()
  })

  it('validates password confirmation in register form', async () => {
    const user = userEvent.setup()
    render(<Login />)
    
    // Switch to register form
    const registerTabButton = screen.getByRole('button', { name: 'Đăng ký' })
    await user.click(registerTabButton)
    
    // Fill in required fields
    await user.type(screen.getByLabelText('Họ và tên'), 'Test User')
    await user.type(screen.getByLabelText('Tên đăng nhập'), 'testuser')
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Số điện thoại'), '0987654321')
    await user.type(screen.getByLabelText('Mật khẩu'), 'password123')
    await user.type(screen.getByLabelText('Xác nhận mật khẩu'), 'differentpassword')
    
    // Verify reCAPTCHA
    const recaptchaButton = screen.getByTestId('recaptcha').querySelector('button')
    if (recaptchaButton) {
      await user.click(recaptchaButton)
    }
    
    const registerButton = screen.getByRole('button', { name: 'Đăng ký', type: 'submit' })
    await user.click(registerButton)
    
    expect(screen.getByText('Mật khẩu xác nhận không khớp')).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    const user = userEvent.setup()
    mockUseAuth.login.mockResolvedValue({ success: true })
    
    render(<Login />)
    
    await user.type(screen.getByLabelText('Tên đăng nhập'), 'testuser')
    await user.type(screen.getByLabelText('Mật khẩu'), 'password123')
    
    const loginButton = screen.getByRole('button', { name: 'Đăng nhập', type: 'submit' })
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(mockUseAuth.login).toHaveBeenCalledWith('testuser', 'password123')
    })
  })

  it('handles login failure', async () => {
    const user = userEvent.setup()
    mockUseAuth.login.mockResolvedValue({ 
      success: false, 
      error: 'Tên đăng nhập hoặc mật khẩu không đúng' 
    })
    
    render(<Login />)
    
    await user.type(screen.getByLabelText('Tên đăng nhập'), 'testuser')
    await user.type(screen.getByLabelText('Mật khẩu'), 'wrongpassword')
    
    const loginButton = screen.getByRole('button', { name: 'Đăng nhập', type: 'submit' })
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Tên đăng nhập hoặc mật khẩu không đúng')).toBeInTheDocument()
    })
  })

  it('handles successful registration', async () => {
    const user = userEvent.setup()
    mockUseAuth.register.mockResolvedValue({ success: true })
    
    render(<Login />)
    
    // Switch to register form
    const registerTabButton = screen.getByRole('button', { name: 'Đăng ký' })
    await user.click(registerTabButton)
    
    // Fill in all required fields
    await user.type(screen.getByLabelText('Họ và tên'), 'Test User')
    await user.type(screen.getByLabelText('Tên đăng nhập'), 'testuser')
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Số điện thoại'), '0987654321')
    await user.type(screen.getByLabelText('Mật khẩu'), 'password123')
    await user.type(screen.getByLabelText('Xác nhận mật khẩu'), 'password123')
    
    // Verify reCAPTCHA
    const recaptchaButton = screen.getByTestId('recaptcha').querySelector('button')
    if (recaptchaButton) {
      await user.click(recaptchaButton)
    }
    
    const registerButton = screen.getByRole('button', { name: 'Đăng ký', type: 'submit' })
    await user.click(registerButton)
    
    await waitFor(() => {
      expect(mockUseAuth.register).toHaveBeenCalledWith({
        userName: 'testuser',
        password: 'password123',
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '0987654321',
      })
    })
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    mockUseAuth.login.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)))
    
    render(<Login />)
    
    await user.type(screen.getByLabelText('Tên đăng nhập'), 'testuser')
    await user.type(screen.getByLabelText('Mật khẩu'), 'password123')
    
    const loginButton = screen.getByRole('button', { name: 'Đăng nhập', type: 'submit' })
    await user.click(loginButton)
    
    expect(screen.getByText('Đang xử lý...')).toBeInTheDocument()
  })
}) 