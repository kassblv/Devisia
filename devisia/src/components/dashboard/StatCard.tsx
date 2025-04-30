"use client";

import { ReactNode } from 'react';
import { Card } from '@/components/ui';
import { useTheme } from '@/styles/theme/useTheme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

/**
 * Carte de statistiques utilisant le système de thème
 */
export const StatCard = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-primary-100',
  iconColor = 'text-primary-600'
}: StatCardProps) => {
  const theme = useTheme();
  
  return (
    <Card className="h-full" hover>
      <div className="flex items-center">
        <div className={`${iconBgColor} ${iconColor} p-3 rounded-full`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
