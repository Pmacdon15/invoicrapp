import { InvoiceTheme } from '../types/invoice';

export const modernTealTheme: InvoiceTheme = {
  id: "modern-teal",
  name: "Modern Teal",
  color: "teal",
  description: "Fresh and modern with teal highlights",
  version: "1.0.0",
  author: "Invoice Wiz Craft",
  preview: {
    primary: "#14b8a6",
    secondary: "#ccfbf1",
    accent: "#0f766e"
  },
  styles: {
    primary: "text-invoice-teal",
    primaryLight: "bg-invoice-teal-light",
    text: "text-invoice-teal",
    background: "bg-invoice-teal-light",
    border: "border-invoice-teal"
  },
  layout: {
    headerStyle: "modern",
    footerStyle: "clean",
    spacing: "minimal",
    typography: {
      headerFont: "font-semibold",
      bodyFont: "font-normal",
      accentFont: "font-medium"
    }
  },
  customCSS: `
    .invoice-header-modern-teal {
      background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%);
      color: white;
    }
    
    .invoice-section-modern-teal {
      border-left: 2px solid #14b8a6;
      padding: 1rem;
      margin: 1rem 0;
      background: #f0fdfa;
      border-radius: 0;
    }
    
    .invoice-total-modern-teal {
      background: #f0fdfa;
      border: 1px solid #14b8a6;
      border-radius: 0.375rem;
      padding: 1rem;
    }
    
    /* Theme Preview Styles */
    .theme-preview-header-modern-teal {
      background: linear-gradient(135deg, #14b8a6, #0f766e);
    }
    
    .theme-preview-icon-modern-teal {
      background: rgba(255, 255, 255, 0.9);
    }
    
    .theme-preview-bar-modern-teal {
      background: linear-gradient(90deg, #14b8a6, #2dd4bf);
    }
    
    .theme-preview-accent-modern-teal {
      background: #14b8a6;
    }
    
    .theme-preview-color1-modern-teal {
      background: #14b8a6;
    }
    
    .theme-preview-color2-modern-teal {
      background: #2dd4bf;
    }
    
    .theme-preview-color3-modern-teal {
      background: #0f766e;
    }
    
    .invoice-table-modern-teal {
      background: linear-gradient(135deg, #14b8a6, #0f766e);
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .invoice-table-modern-teal th {
      color: white;
      padding: 0.75rem;
      border: none;
    }
    
    .invoice-table-modern-teal td {
      padding: 0.75rem;
      border-bottom: 1px solid #ccfbf1;
    }
  `
};

export default modernTealTheme;
