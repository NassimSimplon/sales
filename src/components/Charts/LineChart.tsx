import React, { useRef, useEffect } from 'react';
import { ChartData } from '../../types';

interface LineChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 600,
  height = 400,
  title
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up dimensions
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Find max value for scaling
    const allValues = data.datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues, 0);
    const valueRange = maxValue - minValue;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Vertical grid lines
    const xStep = chartWidth / (data.labels.length - 1);
    for (let i = 0; i < data.labels.length; i++) {
      const x = padding + i * xStep;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Horizontal grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (i * chartHeight) / gridLines;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw data lines
    data.datasets.forEach((dataset, datasetIndex) => {
      ctx.strokeStyle = dataset.borderColor || '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();

      dataset.data.forEach((value, index) => {
        const x = padding + index * xStep;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw data points
      ctx.fillStyle = dataset.borderColor || '#3b82f6';
      dataset.data.forEach((value, index) => {
        const x = padding + index * xStep;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    });

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    // X-axis labels
    data.labels.forEach((label, index) => {
      const x = padding + index * xStep;
      const y = height - padding + 20;
      ctx.fillText(label, x, y);
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= gridLines; i++) {
      const value = minValue + (valueRange * (gridLines - i)) / gridLines;
      const y = padding + (i * chartHeight) / gridLines + 4;
      ctx.fillText(value.toLocaleString(), padding - 10, y);
    }

    // Draw title
    if (title) {
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, 30);
    }

    // Draw legend
    if (data.datasets.length > 1) {
      const legendY = height - 20;
      let legendX = padding;
      
      data.datasets.forEach((dataset) => {
        ctx.fillStyle = dataset.borderColor || '#3b82f6';
        ctx.fillRect(legendX, legendY - 8, 12, 12);
        
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(dataset.label, legendX + 20, legendY);
        
        legendX += ctx.measureText(dataset.label).width + 40;
      });
    }
  }, [data, width, height, title]);

  return (
    <div className="chart-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="chart-canvas"
      />
    </div>
  );
};