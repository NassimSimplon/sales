import React, { useMemo } from 'react';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { DashboardData } from '../../types';

interface ChartsSectionProps {
  data: DashboardData;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ data }) => {
  const revenueChartData = useMemo(() => {
    return {
      labels: data.monthlyStats.map(stat => stat.month.split(' ')[0]),
      datasets: [
        {
          label: 'Revenue',
          data: data.monthlyStats.map(stat => stat.revenue),
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Profit',
          data: data.monthlyStats.map(stat => stat.profit),
          borderColor: '#10b981',
          backgroundColor: '#10b981'
        }
      ]
    };
  }, [data.monthlyStats]);

  const topProductsData = useMemo(() => {
    const productSales = data.sales.reduce((acc, sale) => {
      const shoe = data.shoes.find(s => s.id === sale.shoeId);
      if (shoe) {
        acc[shoe.name] = (acc[shoe.name] || 0) + sale.quantity;
      }
      return acc;
    }, {} as Record<string, number>);

    const sortedProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedProducts.map(([name]) => name),
      datasets: [{
        label: 'Units Sold',
        data: sortedProducts.map(([, quantity]) => quantity),
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
      }]
    };
  }, [data.sales, data.shoes]);

  const customerStatusData = useMemo(() => {
    const statusCounts = data.customers.reduce((acc, customer) => {
      acc[customer.status] = (acc[customer.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'Customer Status',
        data: Object.values(statusCounts),
        backgroundColor: ['#10b981', '#ef4444']
      }]
    };
  }, [data.customers]);

  const categoryPerformanceData = useMemo(() => {
    const categoryRevenue = data.sales.reduce((acc, sale) => {
      const shoe = data.shoes.find(s => s.id === sale.shoeId);
      if (shoe) {
        acc[shoe.category] = (acc[shoe.category] || 0) + sale.totalAmount;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(categoryRevenue),
      datasets: [{
        label: 'Revenue by Category',
        data: Object.values(categoryRevenue),
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']
      }]
    };
  }, [data.sales, data.shoes]);

  return (
    <div className="charts-section">
      <div className="charts-header">
        <h2>Analytics Dashboard</h2>
        <div className="auto-refresh-indicator">
          <div className="refresh-dot"></div>
          <span>Auto-refreshing</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card large">
          <h3>Revenue & Profit Trends</h3>
          <LineChart 
            data={revenueChartData} 
            width={800} 
            height={400}
          />
        </div>

        <div className="chart-card">
          <h3>Top Selling Products</h3>
          <BarChart 
            data={topProductsData} 
            width={400} 
            height={300}
            horizontal={true}
          />
        </div>

        <div className="chart-card">
          <h3>Customer Status Distribution</h3>
          <PieChart 
            data={customerStatusData} 
            width={350} 
            height={300}
          />
        </div>

        <div className="chart-card">
          <h3>Revenue by Category</h3>
          <BarChart 
            data={categoryPerformanceData} 
            width={400} 
            height={300}
          />
        </div>
      </div>
    </div>
  );
};