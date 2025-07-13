import React, { useMemo } from 'react';
import { Users, UserCheck, UserX, DollarSign } from 'lucide-react';
import { DataTable } from '../DataTable/DataTable';
import { BarChart } from '../Charts/BarChart';
import { PieChart } from '../Charts/PieChart';
import { DashboardData } from '../../types';

interface CustomersPageProps {
  data: DashboardData;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ data }) => {
  const customerKPIs = useMemo(() => {
    const totalCustomers = data.customers.length;
    const activeCustomers = data.customers.filter(c => c.status === 'active').length;
    const inactiveCustomers = data.customers.filter(c => c.status === 'inactive').length;
    const totalSpent = data.customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const avgSpentPerCustomer = totalCustomers > 0 ? totalSpent / totalCustomers : 0;
    const highValueCustomers = data.customers.filter(c => c.totalSpent > 500).length;

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      totalSpent,
      avgSpentPerCustomer,
      highValueCustomers
    };
  }, [data.customers]);

  const customerSpendingData = useMemo(() => {
    const topCustomers = data.customers
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    return {
      labels: topCustomers.map(customer => customer.name),
      datasets: [{
        label: 'Total Spent',
        data: topCustomers.map(customer => customer.totalSpent),
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
      }]
    };
  }, [data.customers]);

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

  const locationData = useMemo(() => {
    const locationCounts = data.customers.reduce((acc, customer) => {
      const city = customer.location.split(',')[0]; // Get city part
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedLocations.map(([city]) => city),
      datasets: [{
        label: 'Customers by City',
        data: sortedLocations.map(([, count]) => count),
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
      }]
    };
  }, [data.customers]);

  const customerColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { 
      key: 'totalSpent', 
      label: 'Total Spent', 
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { key: 'lastPurchase', label: 'Last Purchase', sortable: true },
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
    <div className="customers-page">
      <div className="page-header">
        <h1>Customer Management</h1>
        <p>Manage and analyze your customer base</p>
      </div>

      {/* Customer KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon customers">
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Customers</h3>
            <p className="kpi-value">{customerKPIs.totalCustomers}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon active">
            <UserCheck size={24} />
          </div>
          <div className="kpi-content">
            <h3>Active Customers</h3>
            <p className="kpi-value">{customerKPIs.activeCustomers}</p>
            <p className="kpi-subtitle">{((customerKPIs.activeCustomers / customerKPIs.totalCustomers) * 100).toFixed(1)}% of total</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon inactive">
            <UserX size={24} />
          </div>
          <div className="kpi-content">
            <h3>Inactive Customers</h3>
            <p className="kpi-value">{customerKPIs.inactiveCustomers}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <h3>Avg Spent per Customer</h3>
            <p className="kpi-value">${customerKPIs.avgSpentPerCustomer.toFixed(2)}</p>
            <p className="kpi-subtitle">{customerKPIs.highValueCustomers} high-value</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="charts-header">
          <h2>Customer Analytics</h2>
          <div className="auto-refresh-indicator">
            <div className="refresh-dot"></div>
            <span>Live data</span>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Top Customers by Spending</h3>
            <BarChart 
              data={customerSpendingData} 
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
            <h3>Customers by Location</h3>
            <BarChart 
              data={locationData} 
              width={400} 
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="table-section">
        <DataTable
          data={data.customers}
          columns={customerColumns}
          title="Customer Directory"
          searchable={true}
          pageSize={10}
        />
      </div>
    </div>
  );
}; 