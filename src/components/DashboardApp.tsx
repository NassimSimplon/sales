import React, { useEffect } from "react";
import { AnalyticsView } from "./analytics/AnalyticsView";
import { LoadingSpinner } from "./common/LoadingSpinner";
import { FilterBar } from "./dashboard/FilterBar";
import { Overview } from "./dashboard/Overview";
import { Sidebar } from "./navigation/Sidebar";
import { CustomersTable } from "./tables/CustomersTable";
import { InventoryTable } from "./tables/InventoryTable";
import { SalesTable } from "./tables/SalesTable";
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectActiveTab, selectDashboardLoading } from '../store/selectors';
import { useGetDashboardDataQuery } from '../store/api/apiSlice';
import { setActiveTab } from '../store/slices/uiSlice';

export function DashboardApp() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab);
  const { isLoading, error } = useGetDashboardDataQuery();

  const handleTabChange = (tab: string) => {
    dispatch(setActiveTab(tab));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading dashboard</div>
          <p className="text-gray-600">Please try refreshing the page</p>
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
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      
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