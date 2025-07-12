import React from 'react';
import { useGetDashboardDataQuery, useGetMonthlyStatsQuery } from '../../store/api/apiSlice';
import { useAppSelector } from '../../store/hooks';
import { selectDashboardMetrics } from '../../store/selectors';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';
import { MetricsCard } from '../dashboard/MetricsCard';
import { DollarSign, TrendingUp, Users, ShoppingBag } from 'lucide-react';

export function AnalyticsView() {
  const { data, isLoading, error } = useGetDashboardDataQuery();
  const { data: monthlyStats } = useGetMonthlyStatsQuery();
  const metrics = useAppSelector(selectDashboardMetrics);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
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

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
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
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          change={metrics.monthlyGrowth}
          format="currency"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <MetricsCard
          title="Total Profit"
          value={metrics.totalProfit}
          change={15.2}
          format="currency"
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <MetricsCard
          title="Average Order Value"
          value={metrics.averageOrderValue}
          change={8.1}
          format="currency"
          icon={<ShoppingBag className="w-6 h-6" />}
        />
        <MetricsCard
          title="Profit Margin"
          value={metrics.profitMargin}
          change={2.3}
          format="percentage"
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>

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

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {data.shoes.slice(0, 5).map((shoe, index) => {
              const shoesSales = data.sales.filter(s => s.shoeId === shoe.id);
              const totalSold = shoesSales.reduce((sum, sale) => sum + sale.quantity, 0);
              const revenue = shoesSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
              
              return (
                <div key={shoe.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{shoe.name}</p>
                      <p className="text-sm text-gray-500">{totalSold} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${revenue.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
          <div className="space-y-3">
            {data.customers
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((customer, index) => {
                const customerSales = data.sales.filter(s => s.customerId === customer.id);
                const totalOrders = customerSales.length;
                
                return (
                  <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{totalOrders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>

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