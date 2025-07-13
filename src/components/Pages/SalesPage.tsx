import React, { useMemo } from "react";
import { Calendar, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { DashboardData } from "../../types";
import { BarChart } from "../Charts/BarChart";
import { LineChart } from "../Charts/LineChart";
import { DataTable } from "../DataTable/DataTable";

interface SalesPageProps {
  data: DashboardData;
}

export const SalesPage: React.FC<SalesPageProps> = ({ data }) => {
  const salesKPIs = useMemo(() => {
    const totalRevenue = data.sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = data.sales.reduce((sum, sale) => sum + sale.profit, 0);
    const totalSales = data.sales.length;
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const completedSales = data.sales.filter(s => s.status === 'completed').length;
    const pendingSales = data.sales.filter(s => s.status === 'pending').length;

    return {
      totalRevenue,
      totalProfit,
      totalSales,
      avgOrderValue,
      completedSales,
      pendingSales
    };
  }, [data.sales]);

  const dailySalesData = useMemo(() => {
    const salesByDate = data.sales.reduce((acc, sale) => {
      const date = sale.date;
      acc[date] = (acc[date] || 0) + sale.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const sortedDates = Object.keys(salesByDate).sort();
    
    return {
      labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
      datasets: [{
        label: 'Daily Sales',
        data: sortedDates.map(date => salesByDate[date]),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6'
      }]
    };
  }, [data.sales]);

  const topProductsData = useMemo(() => {
    const productSales = data.sales.reduce((acc, sale) => {
      const shoe = data.shoes.find(s => s.id === sale.shoeId);
      if (shoe) {
        acc[shoe.name] = (acc[shoe.name] || 0) + sale.totalAmount;
      }
      return acc;
    }, {} as Record<string, number>);

    const sortedProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedProducts.map(([name]) => name),
      datasets: [{
        label: 'Revenue',
        data: sortedProducts.map(([, revenue]) => revenue),
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
      }]
    };
  }, [data.sales, data.shoes]);

  const salesColumns = [
    { key: 'date', label: 'Date', sortable: true },
    { 
      key: 'customerId', 
      label: 'Customer', 
      render: (value: string) => {
        const customer = data.customers.find(c => c.id === value);
        return customer?.name || 'Unknown';
      }
    },
    { 
      key: 'shoeId', 
      label: 'Product', 
      render: (value: string) => {
        const shoe = data.shoes.find(s => s.id === value);
        return shoe?.name || 'Unknown';
      }
    },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'size', label: 'Size', sortable: true },
    { 
      key: 'totalAmount', 
      label: 'Total', 
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      key: 'profit', 
      label: 'Profit', 
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => (
        <span className={`status-badge ${value}`}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="sales-page">
      <div className="page-header">
        <h1>Sales Management</h1>
        <p>Track and analyze your sales performance</p>
      </div>

      {/* Sales KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Revenue</h3>
            <p className="kpi-value">${salesKPIs.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon profit">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Profit</h3>
            <p className="kpi-value">${salesKPIs.totalProfit.toFixed(2)}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon sales">
            <ShoppingCart size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Sales</h3>
            <p className="kpi-value">{salesKPIs.totalSales}</p>
            <p className="kpi-subtitle">{salesKPIs.completedSales} completed</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon avg-order">
            <Calendar size={24} />
          </div>
          <div className="kpi-content">
            <h3>Avg Order Value</h3>
            <p className="kpi-value">${salesKPIs.avgOrderValue.toFixed(2)}</p>
            <p className="kpi-subtitle">{salesKPIs.pendingSales} pending</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="charts-header">
          <h2>Sales Analytics</h2>
          <div className="auto-refresh-indicator">
            <div className="refresh-dot"></div>
            <span>Live data</span>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card large">
            <h3>Daily Sales Trend</h3>
            <LineChart 
              data={dailySalesData} 
              width={800} 
              height={400}
            />
          </div>

          <div className="chart-card">
            <h3>Top Products by Revenue</h3>
            <BarChart 
              data={topProductsData} 
              width={400} 
              height={300}
              horizontal={true}
            />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="table-section">
        <DataTable
          data={data.sales}
          columns={salesColumns}
          title="Sales Transactions"
          searchable={true}
          pageSize={10}
        />
      </div>
    </div>
  );
}; 