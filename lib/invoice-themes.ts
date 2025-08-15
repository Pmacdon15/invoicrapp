import { InvoiceTheme } from '../types/invoice';
import { 
  loadTheme, 
  getThemeMetadata, 
  getAllThemeMetadata, 
  getDefaultThemeId,
  availableThemes 
} from '../invoice-themes';

// Cache for loaded themes
const themeCache = new Map<string, InvoiceTheme>();

export const getThemeById = async (id: string): Promise<InvoiceTheme | undefined> => {
  try {
    // Check cache first
    if (themeCache.has(id)) {
      return themeCache.get(id);
    }

    // Load theme dynamically
    const theme = await loadTheme(id);
    themeCache.set(id, theme);
    return theme;
  } catch (error) {
    console.error(`Failed to get theme by id: ${id}`, error);
    return undefined;
  }
};

export const getThemeByColor = async (color: string): Promise<InvoiceTheme | undefined> => {
  // Find theme id by color from metadata
  const metadata = getAllThemeMetadata();
  const themeData = metadata.find(theme => theme.id.includes(color));
  
  if (themeData) {
    return getThemeById(themeData.id);
  }
  
  return undefined;
};

export const getDefaultTheme = async (): Promise<InvoiceTheme> => {
  const defaultId = getDefaultThemeId();
  const theme = await getThemeById(defaultId);
  
  if (!theme) {
    throw new Error('Failed to load default theme');
  }
  
  return theme;
};

// Synchronous functions for metadata (used in UI)
export const getThemeMetadataSync = (id: string) => {
  return getThemeMetadata(id);
};

export const getAllThemeMetadataSync = () => {
  return getAllThemeMetadata();
};

export const getAvailableThemes = () => {
  return availableThemes;
};

export const getThemes = () => {
  return getAllThemeMetadata();
};

// Preload all themes for better performance
export const preloadAllThemes = async (): Promise<void> => {
  const loadPromises = availableThemes.map(async (themeId) => {
    try {
      const theme = await loadTheme(themeId);
      themeCache.set(themeId, theme);
    } catch (error) {
      console.error(`Failed to preload theme: ${themeId}`, error);
    }
  });
  
  await Promise.all(loadPromises);
};
