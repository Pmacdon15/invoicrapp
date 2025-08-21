import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Crown, CheckCircle, X } from "lucide-react";
import { AlertDialogCancel } from "./alert-dialog";

interface BlockingUpgradeDialogProps {
  isOpen: boolean;
  onUpgrade: () => void;
  currentUsage: number;
  limit: number;
  onClose: () => void;
}

export const BlockingUpgradeDialog: React.FC<BlockingUpgradeDialogProps> = ({
  isOpen,
  onUpgrade,
  currentUsage,
  limit,
  onClose,
}) => {
  const proFeatures = [
    "Unlimited invoices per month",
    "All premium invoice themes",
    "Advanced customization options",
    "Priority customer support",
    "Invoice analytics & insights",
    "Custom branding & fields",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-red-900">
                Invoice Limit Reached
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {currentUsage}/{limit} invoices used this month
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive font-medium mb-2">
              🚫 Cannot Save Invoice
            </p>
            <p className="text-sm text-destructive/80">
              You've reached your monthly limit of {limit} invoices. To save
              this invoice and create unlimited invoices, upgrade to Pro.
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-primary">
                Upgrade to Pro - Just $5/month
              </h4>
            </div>

            <ul className="space-y-2">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Don't worry!</strong> Your invoice data is preserved.
              Once you upgrade, you can save it immediately.
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-4 gap-2" >
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button
            onClick={onUpgrade}
            className="bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold"
            size="lg"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
