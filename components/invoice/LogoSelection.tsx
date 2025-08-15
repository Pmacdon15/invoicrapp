import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Upload, Check, Clock, FileText } from 'lucide-react';
import { LogoUpload } from './LogoUpload';
import { getUserLogoHistory, type UsedLogo } from '@/lib/logo-history-service';

interface LogoSelectionProps {
  logo?: string;
  onLogoChange: (logo: string | undefined) => void;
}


export const LogoSelection = ({ logo, onLogoChange }: LogoSelectionProps) => {
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);
  const [usedLogos, setUsedLogos] = useState<UsedLogo[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState("recent");

  // Load user's logo history on component mount
  useEffect(() => {
    const loadLogoHistory = async () => {
      try {
        const history = await getUserLogoHistory();
        setUsedLogos(history);
      } catch (error) {
        console.error('Failed to load logo history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadLogoHistory();
  }, []);

  const handleUsedLogoSelect = (logoUrl: string) => {
    onLogoChange(logoUrl);
    setSelectedLogoId(`used-${logoUrl}`);
  };

  const handleUploadToTab = () => {
    setActiveTab("upload");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-lg font-semibold">Company Logo</Label>
        <p className="text-sm text-muted-foreground">
          Select from your recent logos or upload a new one
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recent Logos</TabsTrigger>
          <TabsTrigger value="upload">Upload Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4">
          {/* Recent Logos Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Previously Used Logos</h3>
            </div>

            {loadingHistory ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading your logo history...
              </div>
            ) : usedLogos.length > 0 ? (
              <div className="grid grid-cols-5 gap-4 h-[40vh] overflow-y-auto p-2">
                {usedLogos.map((usedLogo, index) => (
                  <Card
                    key={`used-${index}`}
                    className={`h-60 p-4 cursor-pointer transition-all hover:shadow-md relative ${
                      selectedLogoId === `used-${usedLogo.url}` 
                        ? "ring-2 ring-primary bg-primary/5" 
                        : "bg-muted/90 hover:bg-muted/50"
                    }`}
                    onClick={() => handleUsedLogoSelect(usedLogo.url)}
                  >
                    {selectedLogoId === `used-${usedLogo.url}` && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div className="aspect-square mb-2 bg-white rounded-lg border overflow-hidden flex items-center justify-center">
                      <img 
                        src={usedLogo.url} 
                        alt="Previously used logo"
                        className="w-5/6 h-5/6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    
                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {usedLogo.invoiceCount} invoice{usedLogo.invoiceCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Last used: {new Date(usedLogo.lastUsed).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground space-y-4">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <div>
                  <p>No logos found in your invoice history</p>
                  <p className="text-xs mt-1">Upload a logo to get started</p>
                </div>
                <Button onClick={handleUploadToTab} className="mt-4">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First Logo
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="upload">
          <LogoUpload logo={logo} onLogoChange={onLogoChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
