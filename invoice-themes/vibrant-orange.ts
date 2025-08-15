import { InvoiceTheme } from '../types/invoice';

export const vibrantOrangeTheme: InvoiceTheme = {
  id: "vibrant-orange",
  name: "Vibrant Orange",
  color: "orange",
  description: "Energetic and warm with orange accents",
  version: "1.0.0",
  author: "Invoice Wiz Craft",
  preview: {
    primary: "#f97316",
    secondary: "#fed7aa",
    accent: "#ea580c"
  },
  styles: {
    primary: "text-invoice-orange",
    primaryLight: "bg-invoice-orange-light",
    text: "text-invoice-orange",
    background: "bg-invoice-orange-light",
    border: "border-invoice-orange"
  },
  layout: {
    headerStyle: "energetic",
    footerStyle: "warm",
    spacing: "cozy",
    typography: {
      headerFont: "font-bold",
      bodyFont: "font-medium",
      accentFont: "font-extrabold"
    }
  },
  customCSS: `
    .invoice-header-vibrant-orange {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: white;
      box-shadow: 0 4px 20px rgba(249, 115, 22, 0.3);
    }
    
    .invoice-section-vibrant-orange {
      border-left: 4px solid #f97316;
      padding: 1.25rem;
      margin: 1.25rem 0;
      background: linear-gradient(90deg, #fff7ed 0%, #ffffff 100%);
      border-radius: 0 0.375rem 0.375rem 0;
    }
    
    .invoice-total-vibrant-orange {
      background: linear-gradient(135deg, #ea580c, #dc2626);
      border: 2px solid #ea580c;
      border-radius: 0.5rem;
      padding: 1rem;
      color: white;
      box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);
      transition: all 0.3s ease;
    }
    
    .invoice-total-vibrant-orange:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(234, 88, 12, 0.4);
    }
    
    .invoice-item-row-vibrant-orange:hover {
      background: #fff7ed;
      transform: translateX(4px);
      transition: all 0.2s ease;
    }
    
    /* Theme Preview Styles */
    .theme-preview-header-vibrant-orange {
      background: linear-gradient(135deg, #ea580c, #dc2626);
    }
    
    .theme-preview-icon-vibrant-orange {
      background: rgba(255, 255, 255, 0.9);
    }
    
    .theme-preview-bar-vibrant-orange {
      background: linear-gradient(90deg, #ea580c, #fb923c);
    }
    
    .theme-preview-accent-vibrant-orange {
      background: #ea580c;
    }
    
    .theme-preview-color1-vibrant-orange {
      background: #ea580c;
    }
    
    .theme-preview-color2-vibrant-orange {
      background: #fb923c;
    }
    
    .theme-preview-color3-vibrant-orange {
      background: #dc2626;
    }
    
    .invoice-table-vibrant-orange {
      background: linear-gradient(135deg, #ea580c, #dc2626);
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .invoice-table-vibrant-orange th {
      color: white;
      padding: 0.75rem;
      border: none;
      box-shadow: 0 2px 8px rgba(234, 88, 12, 0.3);
    }
    
    .invoice-table-vibrant-orange td {
      padding: 0.75rem;
      border-bottom: 1px solid #fed7aa;
    }
  `
};

export default vibrantOrangeTheme;
