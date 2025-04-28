'use client';

import { memo } from 'react';
import { KPICard as KPICardType } from '@/types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid';

interface KPICardProps extends KPICardType {
  className?: string;
}

function KPICardComponent({
  title,
  value,
  trend,
  percentage,
  description,
  className = '',
}: KPICardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    const iconClasses = 'h-4 w-4 inline-block ml-1';
    
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className={`${iconClasses} text-green-500`} />;
      case 'down':
        return <ArrowDownIcon className={`${iconClasses} text-red-500`} />;
      case 'neutral':
        return <MinusIcon className={`${iconClasses} text-gray-500`} />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-600';
    
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
    }
  };

  return (
    <Card className={`${className} hover:shadow-lg transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trend || percentage) && (
          <p className={`text-xs ${getTrendColor()}`}>
            {percentage && `${percentage > 0 ? '+' : ''}${percentage}%`}
            {getTrendIcon()}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export const KPICard = memo(KPICardComponent); 