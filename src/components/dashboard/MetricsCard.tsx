import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  format?: 'currency' | 'percentage' | 'number';
}

export function MetricsCard({ 
  title, 
  value, 
  change, 
  icon,
  format = 'number' 
}: MetricsCardProps) {
  const formatValue = (val: string | number) => {
    const numValue = typeof val === 'string' ? parseFloat(val) : val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(numValue);
      case 'percentage':
        return `${numValue.toFixed(1)}%`;
      default:
        return numValue.toLocaleString();
    }
  };

  const isPositiveChange = change !== undefined && change > 0;
  const isNegativeChange = change !== undefined && change < 0;

  return (
    <Card hover className="group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {isPositiveChange && (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              )}
              {isNegativeChange && (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                isPositiveChange ? 'text-green-600' : 
                isNegativeChange ? 'text-red-600' : 'text-gray-600'
              }`}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-blue-500 group-hover:text-blue-600 transition-colors">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}