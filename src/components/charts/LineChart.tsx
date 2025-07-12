import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
}

export function LineChart({ 
  data, 
  height = 200, 
  color = '#3B82F6',
  showGrid = true 
}: LineChartProps) {
  if (!data.length) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: ((maxValue - point.value) / range) * 80 + 10
  }));

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox="0 0 100 100" className="overflow-visible">
        {showGrid && (
          <g className="grid">
            {[20, 40, 60, 80].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="0.5"
              />
            ))}
          </g>
        )}
        
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="transition-all duration-500"
        />

        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={color}
            className="hover:r-4 transition-all duration-200 cursor-pointer"
          >
            <title>{`${data[index].label}: ${data[index].value}`}</title>
          </circle>
        ))}
      </svg>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((point, index) => (
          <span key={index} className="truncate">
            {point.label.split(' ')[0]}
          </span>
        ))}
      </div>
    </div>
  );
}