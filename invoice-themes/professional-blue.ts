import { InvoiceTheme } from '../types/invoice';

export const professionalBlueTheme: InvoiceTheme = {
  id: "professional-blue",
  name: "Professional Blue",
  color: "blue",
  description: "Clean and modern with blue accents",
  version: "1.0.0",
  author: "Invoicr",
  preview: {
    primary: "#3b82f6",
    secondary: "#dbeafe",
    accent: "#1e40af"
  },
  styles: {
    primary: "text-invoice-blue",
    primaryLight: "bg-invoice-blue-light",
    text: "text-invoice-blue",
    background: "bg-invoice-blue-light",
    border: "border-invoice-blue"
  },
  layout: {
    headerStyle: "classic",
    footerStyle: "minimal",
    spacing: "comfortable",
    typography: {
      headerFont: "font-semibold",
      bodyFont: "font-normal",
      accentFont: "font-medium"
    }
  },
  customCSS: `
    .invoice-header-professional-blue {
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      color: white;
    }
    
    .invoice-section-professional-blue {
      border-left: 4px solid #3b82f6;
      padding-left: 1rem;
      margin: 1rem 0;
    }
    
    .invoice-total-professional-blue {
      background: #dbeafe;
      border: 2px solid #3b82f6;
      border-radius: 0.5rem;
      padding: 1rem;
    }
    
    /* Theme Preview Styles */
    .theme-preview-header-professional-blue {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }
    
    .theme-preview-icon-professional-blue {
      background: rgba(255, 255, 255, 0.9);
    }
    
    .theme-preview-bar-professional-blue {
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
    }
    
    .theme-preview-accent-professional-blue {
      background: #3b82f6;
    }
    
    .theme-preview-color1-professional-blue {
      background: #3b82f6;
    }
    
    .theme-preview-color2-professional-blue {
      background: #60a5fa;
    }
    
    .theme-preview-color3-professional-blue {
      background: #1d4ed8;
    }
    
    .invoice-table-professional-blue {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .invoice-table-professional-blue th {
      color: white;
      padding: 0.75rem;
      border: none;
    }
    
    .invoice-table-professional-blue td {
      padding: 0.75rem;
      border-bottom: 1px solid #dbeafe;
    }
  `
};

export default professionalBlueTheme;
