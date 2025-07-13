import React from "react";
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { useDashboard } from "../../contexts/DashboardContext";
import { useDashboardMetrics } from "../../hooks/useDashboardMetrics";
import { BarChart } from "../charts/BarChart";
import { LineChart } from "../charts/LineChart";
import { Card } from "../common/Card";
import { MetricsCard } from "./MetricsCard";

export function Overview() {
  const metrics = useDashboardMetrics();
  const { state } = useDashboard();
  const { data } = state;
  const monthlyRevenueData = data.monthlyStats.slice(-6).map(stat => ({
    label: stat.month.split(' ')[0],
    value: stat.revenue
  }));

  const monthlySalesData = data.monthlyStats.slice(-6).map(stat => ({
    label: stat.month.split(' ')[0],
    value: stat.sales
  }));

  const categoryData = React.useMemo(() => {
    const categories = data.shoes.reduce((acc, shoe) => {
      acc[shoe.category] = (acc[shoe.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = {
      running: '#3B82F6',
      casual: '#14B8A6',
      formal: '#F97316',
      sports: '#8B5CF6'
    };

    return Object.entries(categories).map(([category, count]) => ({
      label: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
      color: colors[category as keyof typeof colors]
    }));
  }, [data.shoes]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          change={metrics.monthlyGrowth}
          format="currency"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <MetricsCard
          title="Total Sales"
          value={metrics.totalSales}
          change={15.2}
          icon={<ShoppingBag className="w-6 h-6" />}
        />
        <MetricsCard
          title="Total Customers"
          value={metrics.totalCustomers}
          change={8.1}
          icon={<Users className="w-6 h-6" />}
        />
        <MetricsCard
          title="Profit Margin"
          value={metrics.profitMargin}
          change={2.3}
          format="percentage"
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <LineChart data={monthlyRevenueData} color="#3B82F6" />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales</h3>
          <LineChart data={monthlySalesData} color="#14B8A6" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shoes by Category</h3>
          <BarChart data={categoryData} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">Top Selling Shoe</span>
              <span className="text-sm text-blue-700">{metrics.topSellingShoe}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-900">Average Order Value</span>
              <span className="text-sm text-green-700">
                ${metrics.averageOrderValue.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-orange-900">Total Profit</span>
              <span className="text-sm text-orange-700">
                ${metrics.totalProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}