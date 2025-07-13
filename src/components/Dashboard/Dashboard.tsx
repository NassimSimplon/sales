import React, { useState } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { FilterPanel } from '../FilterPanel/FilterPanel';
import { ExportPanel } from '../ExportPanel/ExportPanel';
import { AutoRefreshIndicator } from '../AutoRefreshIndicator/AutoRefreshIndicator';
import { TestingPanel } from '../TestingPanel/TestingPanel';
import { StatisticsPage } from '../Pages/StatisticsPage';
import { SalesPage } from '../Pages/SalesPage';
import { CustomersPage } from '../Pages/CustomersPage';
import { ProductsPage } from '../Pages/ProductsPage';
import { useFilters } from '../../hooks/useFilters';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { mockData } from '../../data/mockData';
import { NavigationPage } from '../../types';

export const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('statistics');
  const [showTestingPanel, setShowTestingPanel] = useState(false);
  
  const {
    data,
    isRefreshing,
    lastRefresh,
    refreshCount,
    autoRefreshEnabled,
    toggleAutoRefresh,
    manualRefresh
  } = useAutoRefresh(mockData, { interval: 5000, enabled: true });

  const { filters, filteredData, dispatch } = useFilters(data);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'statistics':
        return <StatisticsPage data={filteredData} />;
      case 'sales':
        return <SalesPage data={filteredData} />;
      case 'customers':
        return <CustomersPage data={filteredData} />;
      case 'products':
        return <ProductsPage data={filteredData} />;
      default:
        return <StatisticsPage data={filteredData} />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="page-title">
              <h1>{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h1>
            </div>
            
            <div className="header-controls">
              <AutoRefreshIndicator
                isRefreshing={isRefreshing}
                lastRefresh={lastRefresh}
                refreshCount={refreshCount}
                autoRefreshEnabled={autoRefreshEnabled}
                onToggleAutoRefresh={toggleAutoRefresh}
                onManualRefresh={manualRefresh}
              />
              
              <button
                className={`testing-toggle ${showTestingPanel ? 'active' : ''}`}
                onClick={() => setShowTestingPanel(!showTestingPanel)}
              >
                Testing Panel
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <aside className="dashboard-sidebar">
            <FilterPanel
              filters={filters}
              data={data}
              currentPage={currentPage}
              onFilterChange={dispatch}
            />
            
            <ExportPanel data={filteredData} currentPage={currentPage} />
            
            {showTestingPanel && (
              <TestingPanel
                refreshCount={refreshCount}
                lastRefresh={lastRefresh}
                autoRefreshEnabled={autoRefreshEnabled}
                isRefreshing={isRefreshing}
              />
            )}
          </aside>

          <main className="main-content">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </div>
  );
}; 