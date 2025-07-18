import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Login from '@/app/login/page'

// Chỉ test đăng nhập thật sự

describe('Login Page', () => {
  it('hiển thị lỗi khi bỏ trống tên đăng nhập và mật khẩu', async () => {
    const user = userEvent.setup()
    render(<Login />)

    // Đợi form render
    await waitFor(() => {
      expect(screen.getByTestId('login-submit')).toBeInTheDocument()
    })

    // Submit form với dữ liệu trống
    const loginButton = screen.getByTestId('login-submit')
    await act(async () => {
      await user.click(loginButton)
    })

    // Đợi validation message xuất hiện
    await waitFor(() => {
      expect(screen.getByText('Vui lòng nhập tên đăng nhập')).toBeInTheDocument()
      expect(screen.getByText('Vui lòng nhập mật khẩu')).toBeInTheDocument()
    }, { timeout: 3000 })
  })
}) 