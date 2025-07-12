import bcrypt from "bcryptjs"

/**
 * Hash a password using bcrypt with a salt rounds of 12
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns Promise<boolean> - True if passwords match
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns { isValid: boolean, errors: string[] }
 */
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Minimum length
  const minLength = parseInt(process.env.PASSWORD_MIN_LENGTH || "8")
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`)
  }
  
  // Maximum length (to prevent DoS attacks)
  if (password.length > 128) {
    errors.push("Password must be less than 128 characters long")
  }
  
  // Require uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  
  // Require lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  
  // Require number
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }
  
  // Require special character (if enabled)
  const requireSpecial = process.env.PASSWORD_REQUIRE_SPECIAL === "true"
  if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }
  
  // Check for common passwords
  const commonPasswords = [
    "password", "123456", "password123", "admin", "qwerty",
    "letmein", "welcome", "monkey", "dragon", "password1"
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Password is too common, please choose a stronger password")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}