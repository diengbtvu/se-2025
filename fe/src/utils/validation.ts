export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.trim())
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/
  return phoneRegex.test(phone.trim())
}

export const validatePassword = (password: string): boolean => {
  if (password.length < 6 || password.length > 50) {
    return false
  }
  // Must contain at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  return hasLetter && hasNumber
}

export const validateUserName = (userName: string): boolean => {
  if (userName.length < 3 || userName.length > 20) {
    return false
  }
  // Only allow letters, numbers, and underscores
  const userNameRegex = /^[a-zA-Z0-9_]+$/
  return userNameRegex.test(userName)
}

export const validateName = (name: string): boolean => {
  if (name.trim().length < 2) {
    return false
  }
  // Only allow letters and spaces
  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/
  return nameRegex.test(name.trim())
} 