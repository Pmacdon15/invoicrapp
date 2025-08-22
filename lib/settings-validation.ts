export interface SettingsValidationResult {
  isValid: boolean;
  missingFields: string[];
  criticalMissing: string[];
}

export interface ValidationRequirement {
  field: keyof import('@/types/settings').SettingsFormData;
  label: string;
  critical: boolean;
}

// Define which settings are required for invoice creation
export const INVOICE_REQUIRED_SETTINGS: ValidationRequirement[] = [
  { field: 'company_name', label: 'Company Name', critical: true },
  { field: 'company_email', label: 'Company Email', critical: true },
  { field: 'company_address', label: 'Company Address', critical: true },
  { field: 'default_currency', label: 'Default Currency', critical: false },
  { field: 'default_payment_terms', label: 'Payment Terms', critical: false },
];

/**
 * Validates if user settings are sufficient for invoice creation
 */
export function validateSettingsForInvoice(settings: import('@/types/settings').SettingsFormData): SettingsValidationResult {
  const missingFields: string[] = [];
  const criticalMissing: string[] = [];

  INVOICE_REQUIRED_SETTINGS.forEach(requirement => {
    const value = settings[requirement.field];
    const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
    
    if (isEmpty) {
      missingFields.push(requirement.label);
      if (requirement.critical) {
        criticalMissing.push(requirement.label);
      }
    }
  });

  return {
    isValid: criticalMissing.length === 0,
    missingFields,
    criticalMissing,
  };
}

/**
 * Check if user has configured basic settings
 */
export async function checkUserSettingsConfigured(userId: string): Promise<SettingsValidationResult> {
  try {
    const { SettingsService } = await import('@/lib/settings-service');
    const settings = await SettingsService.getSettingsWithDefaults(userId);
    return validateSettingsForInvoice(settings);
  } catch (error) {
    console.error('Error checking user settings:', error);
    return {
      isValid: false,
      missingFields: ['Unable to load settings'],
      criticalMissing: ['Unable to load settings'],
    };
  }
}
