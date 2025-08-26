// Global type declarations

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, any>
    ) => void;

    // Add other analytics services as needed
    fbq?: (...args: any[]) => void;
    twq?: (...args: any[]) => void;
    _paq?: any[];
  }
}

export {};
