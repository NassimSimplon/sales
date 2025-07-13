import React, { useRef, useEffect } from 'react';
import { ChartData } from '../../types';

interface BarChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  title?: string;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 600,
  height = 400,
  title,
  horizontal = false
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

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    if (horizontal) {
      // Horizontal grid lines for horizontal bar chart
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const x = padding + (i * chartWidth) / gridLines;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
      }
    } else {
      // Vertical grid lines for vertical bar chart
      const barWidth = chartWidth / data.labels.length;
      for (let i = 0; i <= data.labels.length; i++) {
        const x = padding + i * barWidth;
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
    }

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw bars
    data.datasets.forEach((dataset, datasetIndex) => {
      const colors = Array.isArray(dataset.backgroundColor) 
        ? dataset.backgroundColor 
        : [dataset.backgroundColor || '#3b82f6'];

      dataset.data.forEach((value, index) => {
        const color = colors[index % colors.length];
        ctx.fillStyle = color;

        if (horizontal) {
          // Horizontal bars
          const barHeight = chartHeight / data.labels.length * 0.8;
          const barY = padding + index * (chartHeight / data.labels.length) + (chartHeight / data.labels.length - barHeight) / 2;
          const barWidth = (value / maxValue) * chartWidth;
          
          ctx.fillRect(padding, barY, barWidth, barHeight);
        } else {
          // Vertical bars
          const barWidth = (chartWidth / data.labels.length) * 0.8;
          const barX = padding + index * (chartWidth / data.labels.length) + (chartWidth / data.labels.length - barWidth) / 2;
          const barHeight = (value / maxValue) * chartHeight;
          const barY = height - padding - barHeight;
          
          ctx.fillRect(barX, barY, barWidth, barHeight);
        }
      });
    });

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';

    if (horizontal) {
      // Labels for horizontal bars
      ctx.textAlign = 'right';
      data.labels.forEach((label, index) => {
        const y = padding + index * (chartHeight / data.labels.length) + (chartHeight / data.labels.length) / 2 + 4;
        ctx.fillText(label, padding - 10, y);
      });

      // X-axis labels
      ctx.textAlign = 'center';
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const value = (maxValue * i) / gridLines;
        const x = padding + (i * chartWidth) / gridLines;
        ctx.fillText(value.toLocaleString(), x, height - padding + 20);
      }
    } else {
      // Labels for vertical bars
      ctx.textAlign = 'center';
      data.labels.forEach((label, index) => {
        const x = padding + index * (chartWidth / data.labels.length) + (chartWidth / data.labels.length) / 2;
        const y = height - padding + 20;
        ctx.fillText(label, x, y);
      });

      // Y-axis labels
      ctx.textAlign = 'right';
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const value = maxValue * (gridLines - i) / gridLines;
        const y = padding + (i * chartHeight) / gridLines + 4;
        ctx.fillText(value.toLocaleString(), padding - 10, y);
      }
    }

    // Draw title
    if (title) {
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, 30);
    }
  }, [data, width, height, title, horizontal]);

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