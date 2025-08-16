import { InvoiceTheme } from '../types/invoice';

// Dynamic theme imports for marketplace support
export const loadTheme = async (themeId: string): Promise<InvoiceTheme> => {
  try {
    const themeModule = await import(`./${themeId}`);
    return themeModule.default;
  } catch (error) {
    console.error(`Failed to load theme: ${themeId}`, error);
    // Fallback to professional blue
    const fallbackModule = await import('./professional-blue');
    return fallbackModule.default;
  }
};

// Available theme registry for marketplace
export const availableThemes = [
  'professional-blue',
  'elegant-green', 
  'creative-purple',
  'vibrant-orange',
  'modern-teal',
  'elegant-rose'
];

// Theme metadata for quick access (without loading full theme)
export const themeMetadata = {
  'professional-blue': {
    id: 'professional-blue',
    name: 'Professional Blue',
    description: 'Clean and modern with blue accents',
    author: 'Invoicr',
    version: '1.0.0',
    preview: {
      primary: '#3b82f6',
      secondary: '#dbeafe',
      accent: '#1e40af'
    }
  },
  'elegant-green': {
    id: 'elegant-green',
    name: 'Elegant Green',
    description: 'Sophisticated with green highlights',
    author: 'Invoicr',
    version: '1.0.0',
    preview: {
      primary: '#10b981',
      secondary: '#d1fae5',
      accent: '#047857'
    }
  },
  'creative-purple': {
    id: 'creative-purple',
    name: 'Creative Purple',
    description: 'Bold and creative with purple theme',
    author: 'Invoicr',
    version: '1.0.0',
    preview: {
      primary: '#8b5cf6',
      secondary: '#ede9fe',
      accent: '#7c3aed'
    }
  },
  'vibrant-orange': {
    id: 'vibrant-orange',
    name: 'Vibrant Orange',
    description: 'Energetic and warm with orange accents',
    author: 'Invoicr',
    version: '1.0.0',
    preview: {
      primary: '#f97316',
      secondary: '#fed7aa',
      accent: '#ea580c'
    }
  },
  'modern-teal': {
    id: 'modern-teal',
    name: 'Modern Teal',
    description: 'Fresh and modern with teal highlights',
    author: 'Invoicr',
    version: '1.0.0',
    preview: {
      primary: '#14b8a6',
      secondary: '#ccfbf1',
      accent: '#0f766e'
    }
  },
  'elegant-rose': {
    id: 'elegant-rose',
    name: 'Elegant Rose',
    description: 'Sophisticated with rose pink accents',
    author: 'Invoicr',
    version: '1.0.0',
    preview: {
      primary: '#f43f5e',
      secondary: '#ffe4e6',
      accent: '#e11d48'
    }
  }
};

// Helper functions
export const getThemeMetadata = (themeId: string) => {
  return themeMetadata[themeId as keyof typeof themeMetadata];
};

export const getAllThemeMetadata = () => {
  return Object.values(themeMetadata);
};

export const getDefaultThemeId = () => {
  return 'professional-blue';
};
