import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Palette } from "lucide-react";
import { InvoiceTheme } from "@/types/invoice";
import { getAllThemeMetadataSync, getThemeById } from "@/lib/invoice-themes";
import { useEffect, useState } from "react";

interface ThemeSelectionProps {
  selectedTheme: InvoiceTheme;
  onThemeSelect: (theme: InvoiceTheme) => void;
}

export const ThemeSelection = ({ selectedTheme, onThemeSelect }: ThemeSelectionProps) => {
  const [availableThemes, setAvailableThemes] = useState<any[]>([]);
  const [loadedThemes, setLoadedThemes] = useState<{[key: string]: InvoiceTheme}>({});

  useEffect(() => {
    // Load theme metadata for display
    const metadata = getAllThemeMetadataSync();
    setAvailableThemes(metadata);
    
    // Preload all themes for previews
    const loadAllThemes = async () => {
      const themes: {[key: string]: InvoiceTheme} = {};
      for (const meta of metadata) {
        try {
          const theme = await getThemeById(meta.id);
          if (theme) {
            themes[meta.id] = theme;
            // Inject theme CSS for previews
            const existingStyle = document.getElementById(`theme-preview-${meta.id}`);
            if (!existingStyle && theme.customCSS) {
              const styleElement = document.createElement('style');
              styleElement.id = `theme-preview-${meta.id}`;
              styleElement.textContent = theme.customCSS;
              document.head.appendChild(styleElement);
            }
          }
        } catch (error) {
          console.error(`Failed to load theme ${meta.id}:`, error);
        }
      }
      setLoadedThemes(themes);
    };
    
    loadAllThemes();
  }, []);

  const handleThemeSelect = async (themeId: string) => {
    try {
      const theme = await getThemeById(themeId);
      if (theme) {
        onThemeSelect(theme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Choose Your Invoice Theme</h2>
        </div>
        {/* <p className="text-muted-foreground">Select a professional design for your invoices</p> */}
      </div>

      <Card className="grid md:grid-cols-3 gap-6 h-[55vh] overflow-y-auto p-6 bg-muted/90 rounded-lg">
        {availableThemes.map((theme) => (
          <Card
            key={theme.id}
            className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedTheme.id === theme.id
                ? 'ring-2 ring-primary shadow-lg scale-105'
                : 'hover:shadow-md'
            }`}
            onClick={() => handleThemeSelect(theme.id)}
          >
            {selectedTheme.id === theme.id && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            
            <div className="text-center space-y-4">
              {/* Theme Preview Header */}
              <div className={`theme-preview-header-${theme.id} w-16 h-16 mx-auto rounded-lg flex items-center justify-center`}>
                <div className={`theme-preview-icon-${theme.id} w-8 h-8 rounded`} />
              </div>
              
              {/* Theme Info */}
              <div>
                <h3 className="font-semibold text-lg">{theme.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
                <p className="text-xs text-muted-foreground">v{theme.version} by {theme.author}</p>
              </div>
              
              {/* Theme Preview Bars */}
              <div className="space-y-2">
                <div className={`theme-preview-bar-${theme.id} h-3 rounded`} />
                <div className="flex gap-1">
                  <div className="h-2 bg-muted rounded flex-1" />
                  <div className={`theme-preview-accent-${theme.id} h-2 rounded flex-1`} />
                  <div className="h-2 bg-muted rounded flex-1" />
                </div>
              </div>

              {/* Color Palette Preview */}
              <div className="flex justify-center gap-1">
                <div className={`theme-preview-color1-${theme.id} w-4 h-4 rounded-full border-2 border-white shadow-sm`} />
                <div className={`theme-preview-color2-${theme.id} w-4 h-4 rounded-full border-2 border-white shadow-sm`} />
                <div className={`theme-preview-color3-${theme.id} w-4 h-4 rounded-full border-2 border-white shadow-sm`} />
              </div>
            </div>
          </Card>
        ))}
      </Card>
    </div>
  );
};