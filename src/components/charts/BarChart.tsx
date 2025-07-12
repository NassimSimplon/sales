import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  showValues?: boolean;
}

export function BarChart({ 
  data, 
  height = 200,
  showValues = true 
}: BarChartProps) {
  if (!data.length) return null;

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full">
      <div className="flex items-end justify-between" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          const color = item.color || '#3B82F6';
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              <div className="relative group">
                {showValues && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}
                  </div>
                )}
                <div
                  className="w-full rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer"
                  style={{
                    height: barHeight,
                    backgroundColor: color,
                    minHeight: '8px'
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center truncate w-full">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}