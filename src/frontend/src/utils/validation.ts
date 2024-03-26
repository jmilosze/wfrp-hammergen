export interface ValidationStatus {
  valid: boolean;
  message?: string;
}

export function setValidationStatus(valid: boolean, message?: string): ValidationStatus {
  return { valid: valid, message: valid ? undefined : message };
}
