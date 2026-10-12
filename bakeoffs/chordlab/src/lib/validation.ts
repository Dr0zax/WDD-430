export type ValidationResult = {
  valid: boolean
  message?: string
}

export function requiredText(value: string, fieldName: string): ValidationResult {
  if (value.trim().length === 0) {
    return {
      valid: false,
      message: `${fieldName} is required. Enter a value to continue.`,
    }
  }

  return { valid: true }
}

