import { InvoiceTheme } from '../types/invoice';

export const elegantGreenTheme: InvoiceTheme = {
  id: "elegant-green",
  name: "Elegant Green",
  color: "green",
  description: "Sophisticated with green highlights",
  version: "1.0.0",
  author: "Invoicr",
  preview: {
    primary: "#10b981",
    secondary: "#d1fae5",
    accent: "#047857"
  },
  styles: {
    primary: "text-invoice-green",
    primaryLight: "bg-invoice-green-light",
    text: "text-invoice-green",
    background: "bg-invoice-green-light",
    border: "border-invoice-green"
  },
  layout: {
    headerStyle: "elegant",
    footerStyle: "detailed",
    spacing: "relaxed",
    typography: {
      headerFont: "font-bold",
      bodyFont: "font-light",
      accentFont: "font-semibold"
    }
  },
  customCSS: `
    .invoice-header-elegant-green {
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      color: white;
      position: relative;
    }
    
    .invoice-total-elegant-green {
      background: #dcfce7;
      border: 2px solid #16a34a;
      border-radius: 0.5rem;
      padding: 1rem;
      position: relative;
    }
    
    .invoice-total-elegant-green::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #16a34a, #22c55e);
      border-radius: 2px;
    }
    
    .theme-preview-header-elegant-green {
      background: linear-gradient(135deg, #16a34a, #15803d);
    }
    
    .theme-preview-icon-elegant-green {
      background: rgba(255, 255, 255, 0.9);
    }
    
    .theme-preview-bar-elegant-green {
      background: linear-gradient(90deg, #16a34a, #22c55e);
    }
    
    .theme-preview-accent-elegant-green {
      background: #16a34a;
    }
    
    .theme-preview-color1-elegant-green {
      background: #16a34a;
    }
    
    .theme-preview-color2-elegant-green {
      background: #22c55e;
    }
    
    .theme-preview-color3-elegant-green {
      background: #15803d;
    }
    
    .invoice-table-elegant-green {
      background: linear-gradient(135deg, #16a34a, #15803d);
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .invoice-table-elegant-green th {
      color: white;
      padding: 0.75rem;
      border: none;
    }
    
    .invoice-table-elegant-green td {
      padding: 0.75rem;
      border-bottom: 1px solid #dcfce7;
    }
    
    .invoice-section-elegant-green {
      border-left: 3px solid #10b981;
      border-bottom: 1px solid #d1fae5;
      padding: 1.5rem;
      margin: 1.5rem 0;
      background: linear-gradient(90deg, #f0fdf4 0%, #ffffff 100%);
    }
    
    .invoice-total-elegant-green {
      background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
      border: 2px solid #10b981;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.1);
    }
  `
};

export default elegantGreenTheme;
