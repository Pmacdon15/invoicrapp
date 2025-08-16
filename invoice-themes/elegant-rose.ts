import { InvoiceTheme } from '../types/invoice';

export const elegantRoseTheme: InvoiceTheme = {
  id: "elegant-rose",
  name: "Elegant Rose",
  color: "rose",
  description: "Sophisticated with rose pink accents",
  version: "1.0.0",
  author: "Invoicr",
  preview: {
    primary: "#f43f5e",
    secondary: "#ffe4e6",
    accent: "#e11d48"
  },
  styles: {
    primary: "text-invoice-rose",
    primaryLight: "bg-invoice-rose-light",
    text: "text-invoice-rose",
    background: "bg-invoice-rose-light",
    border: "border-invoice-rose"
  },
  layout: {
    headerStyle: "sophisticated",
    footerStyle: "elegant",
    spacing: "refined",
    typography: {
      headerFont: "font-semibold",
      bodyFont: "font-light",
      accentFont: "font-medium"
    }
  },
  customCSS: `
    .invoice-header-elegant-rose {
      background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
      color: white;
    }
    
    .invoice-section-elegant-rose {
      border-left: 3px solid #f43f5e;
      padding: 1.5rem;
      margin: 1.5rem 0;
      background: linear-gradient(90deg, #fdf2f8 0%, #ffffff 100%);
      border-radius: 0 0.5rem 0.5rem 0;
    }
    
    .invoice-total-elegant-rose {
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
      border: 2px solid #ec4899;
      border-radius: 0.75rem;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
    }
    
    .invoice-total-elegant-rose::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #ec4899, #f472b6, #be185d, #ec4899);
      background-size: 200% 100%;
      animation: shimmer 3s ease-in-out infinite;
    }
    
    .invoice-divider-elegant-rose {
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #ec4899 50%, transparent 100%);
      margin: 1rem 0;
    }
    
    /* Theme Preview Styles */
    .theme-preview-header-elegant-rose {
      background: linear-gradient(135deg, #ec4899, #be185d);
    }
    
    .theme-preview-icon-elegant-rose {
      background: rgba(255, 255, 255, 0.9);
    }
    
    .theme-preview-bar-elegant-rose {
      background: linear-gradient(90deg, #ec4899, #f472b6);
    }
    
    .theme-preview-accent-elegant-rose {
      background: #ec4899;
    }
    
    .theme-preview-color1-elegant-rose {
      background: #ec4899;
    }
    
    .theme-preview-color2-elegant-rose {
      background: #f472b6;
    }
    
    .theme-preview-color3-elegant-rose {
      background: #be185d;
    }
    
    .invoice-table-elegant-rose {
      background: linear-gradient(135deg, #ec4899, #be185d);
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .invoice-table-elegant-rose th {
      color: white;
      padding: 0.75rem;
      border: none;
    }
    
    .invoice-table-elegant-rose td {
      padding: 0.75rem;
      border-bottom: 1px solid #fce7f3;
    }
  `
};

export default elegantRoseTheme;
