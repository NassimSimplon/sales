import React, { useState } from "react";
import { AnalyticsView } from "./components/analytics/AnalyticsView";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { FilterBar } from "./components/dashboard/FilterBar";
import { Overview } from "./components/dashboard/Overview";
import { Sidebar } from "./components/navigation/Sidebar";
import { CustomersTable } from "./components/tables/CustomersTable";
import { InventoryTable } from "./components/tables/InventoryTable";
import { SalesTable } from "./components/tables/SalesTable";
import { DashboardProvider, useDashboard } from "./contexts/DashboardContext";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const { state } = useDashboard();

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'sales':
        return <SalesTable />;
      case 'customers':
        return <CustomersTable />;
      case 'inventory':
        return <InventoryTable />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === 'overview' && 'Monitor your shoe sales performance and key metrics'}
                {activeTab === 'sales' && 'Track and manage all sales transactions'}
                {activeTab === 'customers' && 'Manage customer relationships and data'}
                {activeTab === 'inventory' && 'Monitor product stock and inventory levels'}
                {activeTab === 'analytics' && 'Deep dive into sales analytics and trends'}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <FilterBar />
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export default App;