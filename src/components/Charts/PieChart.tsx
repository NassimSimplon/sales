import React, { useRef, useEffect } from 'react';
import { ChartData } from '../../types';

interface PieChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  title?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 400,
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

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    // Get data from first dataset
    const dataset = data.datasets[0];
    const values = dataset.data;
    const total = values.reduce((sum, value) => sum + value, 0);

    // Default colors if not provided
    const colors = Array.isArray(dataset.backgroundColor) 
      ? dataset.backgroundColor 
      : ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

    let currentAngle = -Math.PI / 2; // Start from top

    // Draw pie slices
    values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const color = colors[index % colors.length];

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Draw slice border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    // Draw labels
    currentAngle = -Math.PI / 2;
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const labelAngle = currentAngle + sliceAngle / 2;
      const percentage = ((value / total) * 100).toFixed(1);
      
      // Position label
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;

      // Draw percentage
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`${percentage}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Draw legend
    const legendStartY = 40;
    const legendItemHeight = 20;
    
    data.labels.forEach((label, index) => {
      const color = colors[index % colors.length];
      const y = legendStartY + index * legendItemHeight;
      
      // Draw color box
      ctx.fillStyle = color;
      ctx.fillRect(20, y - 8, 12, 12);
      
      // Draw label text
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, 40, y + 2);
      
      // Draw value
      const value = values[index];
      const percentage = ((value / total) * 100).toFixed(1);
      ctx.fillText(`(${percentage}%)`, 40 + ctx.measureText(label).width + 10, y + 2);
    });

    // Draw title
    if (title) {
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, 25);
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