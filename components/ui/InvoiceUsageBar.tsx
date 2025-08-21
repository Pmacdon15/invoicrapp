import React from 'react';
import { Progress } from './progress';
import { Badge } from './badge';
import { Crown, Zap } from 'lucide-react';

interface InvoiceUsageBarProps {
  current: number;
  limit: number;
  planType: 'free' | 'pro';
  className?: string;
}

export const InvoiceUsageBar: React.FC<InvoiceUsageBarProps> = ({
  current,
  limit,
  planType,
  className = ''
}) => {
  if (planType === 'pro') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <Crown className="w-3 h-3 mr-1" />
          Pro Plan
        </Badge>
        <span className="text-sm text-muted-foreground">Unlimited invoices</span>
      </div>
    );
  }

  const percentage = Math.min(100, (current / limit) * 100);
  const remaining = Math.max(0, limit - current);
  
  // Color logic based on usage
  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <Zap className="w-3 h-3 mr-1" />
        Free Plan
      </Badge>
      
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="flex-1 min-w-[200px]">
          <Progress 
            value={percentage} 
            className="h-2"
            // Custom progress bar color
            style={{
              '--progress-background': getProgressColor()
            } as React.CSSProperties}
          />
        </div>
        
        <div className="flex items-center gap-1 text-sm whitespace-nowrap">
          <span className={getTextColor()}>
            {current}/{limit}
          </span>
          <span className="text-muted-foreground">
            invoices
          </span>
        </div>
      </div>
      
      {remaining <= 2 && remaining > 0 && (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
          {remaining} left
        </Badge>
      )}
      
      {remaining === 0 && (
        <Badge variant="destructive" className="text-xs">
          Limit reached
        </Badge>
      )}
    </div>
  );
};
