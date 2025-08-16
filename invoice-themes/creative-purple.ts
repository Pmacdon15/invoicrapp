import { InvoiceTheme } from '../types/invoice';

export const creativePurpleTheme: InvoiceTheme = {
  id: "creative-purple",
  name: "Creative Purple",
  color: "purple",
  description: "Bold and creative with purple theme",
  version: "1.0.0",
  author: "Invoicr",
  preview: {
    primary: "#8b5cf6",
    secondary: "#ede9fe",
    accent: "#7c3aed"
  },
  styles: {
    primary: "text-invoice-purple",
    primaryLight: "bg-invoice-purple-light",
    text: "text-invoice-purple",
    background: "bg-invoice-purple-light",
    border: "border-invoice-purple"
  },
  layout: {
    headerStyle: "creative",
    footerStyle: "artistic",
    spacing: "dynamic",
    typography: {
      headerFont: "font-extrabold",
      bodyFont: "font-normal",
      accentFont: "font-bold"
    }
  },
  customCSS: `
    .invoice-header-creative-purple {
      background: linear-gradient(45deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }
    
    .invoice-header-creative-purple::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 3s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 0.8; }
    }
    
    .invoice-section-creative-purple {
      border-left: 5px solid #8b5cf6;
      border-image: linear-gradient(45deg, #8b5cf6, #7c3aed) 1;
      padding: 1.5rem;
      margin: 1.5rem 0;
      background: linear-gradient(135deg, #faf5ff 0%, #ffffff 100%);
      border-radius: 0 0.5rem 0.5rem 0;
    }
    
    .invoice-total-creative-purple {
      background: linear-gradient(135deg, #a855f7, #7c3aed);
      border: 2px solid #a855f7;
      border-radius: 0.75rem;
      padding: 1rem;
      color: white;
      animation: pulse 2s infinite;
    }
    
    /* Theme Preview Styles */
    .theme-preview-header-creative-purple {
      background: linear-gradient(135deg, #a855f7, #7c3aed);
      animation: pulse 2s infinite;
    }
    
    .theme-preview-icon-creative-purple {
      background: rgba(255, 255, 255, 0.9);
    }
    
    .theme-preview-bar-creative-purple {
      background: linear-gradient(90deg, #a855f7, #c084fc);
    }
    
    .theme-preview-accent-creative-purple {
      background: #a855f7;
    }
    
    .theme-preview-color1-creative-purple {
      background: #a855f7;
    }
    
    .theme-preview-color2-creative-purple {
      background: #c084fc;
    }
    
    .theme-preview-color3-creative-purple {
      background: #7c3aed;
    }
    
    .invoice-table-creative-purple {
      background: linear-gradient(135deg, #a855f7, #7c3aed);
      border-collapse: separate;
      border-spacing: 0;
    }
    
    .invoice-table-creative-purple th {
      color: white;
      padding: 0.75rem;
      border: none;
      animation: pulse 2s infinite;
    }
    
    .invoice-table-creative-purple td {
      padding: 0.75rem;
      border-bottom: 1px solid #f3e8ff;
    }
    
    .invoice-total-creative-purple::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #8b5cf6, #7c3aed, #6d28d9, #8b5cf6);
      border-radius: 1rem 1rem 0 0;
    }
  `
};

export default creativePurpleTheme;
