import React from 'react';
import { useGetDashboardDataQuery, useGetMonthlyStatsQuery } from '../../store/api/apiSlice';
import { Card } from '../common/Card';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';

export function AnalyticsView() {
  const { data, isLoading, error } = useGetDashboardDataQuery();
  const { data: monthlyStats } = useGetMonthlyStatsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading analytics data</p>
      </div>
    );
  }

  const monthlyData = data.monthlyStats.map(stat => ({
    label: stat.month,
    value: stat.revenue
  }));

  const profitData = data.monthlyStats.map(stat => ({
    label: stat.month,
    value: stat.profit
  }));

  const salesGrowthData = data.monthlyStats.map((stat, index) => {
    if (index === 0) return { label: stat.month, value: 0 };
    const previousSales = data.monthlyStats[index - 1].sales;
    const growth = ((stat.sales - previousSales) / previousSales) * 100;
    return { label: stat.month, value: Math.round(growth * 10) / 10 };
  });

  const customerGrowthData = data.monthlyStats.map((stat, index) => {
    if (index === 0) return { label: stat.month, value: 0 };
    const previousCustomers = data.monthlyStats[index - 1].customers;
    const growth = ((stat.customers - previousCustomers) / previousCustomers) * 100;
    return { label: stat.month, value: Math.round(growth * 10) / 10 };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (12 Months)</h3>
          <LineChart data={monthlyData} height={250} color="#3B82F6" />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Analysis</h3>
          <LineChart data={profitData} height={250} color="#14B8A6" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Growth Rate (%)</h3>
          <BarChart data={salesGrowthData} height={250} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth Rate (%)</h3>
          <BarChart data={customerGrowthData} height={250} />
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Monthly Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Month</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Profit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Sales</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Customers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyStats.map((stat, index) => {
                const profitMargin = (stat.profit / stat.revenue) * 100;
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">{stat.month}</td>
                    <td className="py-4 px-4 text-green-600 font-semibold">
                      ${stat.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-blue-600 font-semibold">
                      ${stat.profit.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">{stat.sales}</td>
                    <td className="py-4 px-4">{stat.customers}</td>
                    <td className="py-4 px-4 text-purple-600 font-medium">
                      {profitMargin.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}