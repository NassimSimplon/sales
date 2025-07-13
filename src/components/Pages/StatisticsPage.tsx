import React, { useMemo } from "react";
import { DollarSign, Package, ShoppingCart, Target, TrendingUp, Users } from "lucide-react";
import { DashboardData, KPIData } from "../../types";
import { BarChart } from "../Charts/BarChart";
import { LineChart } from "../Charts/LineChart";
import { PieChart } from "../Charts/PieChart";

interface StatisticsPageProps {
  data: DashboardData;
}

export const StatisticsPage: React.FC<StatisticsPageProps> = ({ data }) => {
  const kpis: KPIData = useMemo(() => {
    const totalRevenue = data.sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = data.sales.reduce((sum, sale) => sum + sale.profit, 0);
    const totalCustomers = data.customers.length;
    const activeCustomers = data.customers.filter(c => c.status === 'active').length;
    const totalProducts = data.shoes.length;
    const lowStockProducts = data.shoes.filter(s => s.stock < 20).length;
    const totalSales = data.sales.length;
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const customerRetention = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0;

    return {
      totalRevenue,
      totalProfit,
      totalCustomers,
      activeCustomers,
      totalProducts,
      lowStockProducts,
      totalSales,
      avgOrderValue,
      profitMargin,
      customerRetention
    };
  }, [data]);

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

  const customerStatusData = useMemo(() => {
    const statusCounts = data.customers.reduce((acc, customer) => {
      acc[customer.status] = (acc[customer.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(statusCounts).map(status => status.charAt(0).toUpperCase() + status.slice(1)),
      datasets: [{
        label: 'Customer Status',
        data: Object.values(statusCounts),
        backgroundColor: ['#10b981', '#ef4444']
      }]
    };
  }, [data.customers]);

  return (
    <div className="statistics-page">
      <div className="page-header">
        <h1>Business Statistics</h1>
        <p>Comprehensive overview of your business performance</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Revenue</h3>
            <p className="kpi-value">${kpis.totalRevenue.toFixed(2)}</p>
            <p className="kpi-change positive">+12.5% from last month</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon profit">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Profit</h3>
            <p className="kpi-value">${kpis.totalProfit.toFixed(2)}</p>
            <p className="kpi-subtitle">{kpis.profitMargin.toFixed(1)}% margin</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon customers">
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <h3>Active Customers</h3>
            <p className="kpi-value">{kpis.activeCustomers}/{kpis.totalCustomers}</p>
            <p className="kpi-subtitle">{kpis.customerRetention.toFixed(1)}% retention</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon products">
            <Package size={24} />
          </div>
          <div className="kpi-content">
            <h3>Products</h3>
            <p className="kpi-value">{kpis.totalProducts}</p>
            <p className="kpi-subtitle">{kpis.lowStockProducts} low stock</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon sales">
            <ShoppingCart size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Sales</h3>
            <p className="kpi-value">{kpis.totalSales}</p>
            <p className="kpi-subtitle">transactions</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon avg-order">
            <Target size={24} />
          </div>
          <div className="kpi-content">
            <h3>Avg Order Value</h3>
            <p className="kpi-value">${kpis.avgOrderValue.toFixed(2)}</p>
            <p className="kpi-change positive">+8.3% from last month</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="charts-header">
          <h2>Performance Analytics</h2>
          <div className="auto-refresh-indicator">
            <div className="refresh-dot"></div>
            <span>Live data</span>
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
            <h3>Revenue by Category</h3>
            <BarChart 
              data={categoryPerformanceData} 
              width={400} 
              height={300}
            />
          </div>

          <div className="chart-card">
            <h3>Customer Status</h3>
            <PieChart 
              data={customerStatusData} 
              width={350} 
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 