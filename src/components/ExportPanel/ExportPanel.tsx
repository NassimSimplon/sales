import React from "react";
import { Download, File, FileSpreadsheet, FileText } from "lucide-react";
import { DashboardData, NavigationPage } from "../../types";

interface ExportPanelProps {
  data: DashboardData;
  currentPage: NavigationPage;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ data, currentPage }) => {
  const generateCSV = (exportData: any[], filename: string) => {
    if (exportData.length === 0) return;
    
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generateJSON = (exportData: any, filename: string) => {
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const reportContent = `
SHOE STORE BUSINESS REPORT - ${currentPage.toUpperCase()}
Generated on: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
==================
Total Customers: ${data.customers.length}
Active Customers: ${data.customers.filter(c => c.status === 'active').length}
Total Products: ${data.shoes.length}
Total Sales: ${data.sales.length}
Total Revenue: $${data.sales.reduce((sum, sale) => sum + sale.totalAmount, 0).toFixed(2)}
Total Profit: $${data.sales.reduce((sum, sale) => sum + sale.profit, 0).toFixed(2)}

${currentPage === 'customers' ? `
TOP CUSTOMERS
=============
${data.customers
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 5)
  .map((customer, index) => `${index + 1}. ${customer.name} - $${customer.totalSpent.toFixed(2)}`)
  .join('\n')}
` : ''}

${currentPage === 'products' ? `
LOW STOCK ALERTS
================
${data.shoes
  .filter(shoe => shoe.stock < 20)
  .map(shoe => `${shoe.name} - ${shoe.stock} units remaining`)
  .join('\n')}
` : ''}

${currentPage === 'sales' ? `
RECENT SALES
============
${data.sales
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 10)
  .map(sale => {
    const customer = data.customers.find(c => c.id === sale.customerId);
    const shoe = data.shoes.find(s => s.id === sale.shoeId);
    return `${sale.date} - ${customer?.name} - ${shoe?.name} - $${sale.totalAmount.toFixed(2)}`;
  })
  .join('\n')}
` : ''}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentPage}-report.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getExportOptions = () => {
    const baseOptions = [
      {
        label: `Export ${currentPage} (JSON)`,
        icon: <File size={16} />,
        action: () => {
          switch (currentPage) {
            case 'customers':
              generateJSON(data.customers, 'customers.json');
              break;
            case 'sales':
              generateJSON(data.sales, 'sales.json');
              break;
            case 'products':
              generateJSON(data.shoes, 'products.json');
              break;
            case 'statistics':
              generateJSON(data, 'dashboard-data.json');
              break;
          }
        },
        description: `${currentPage} data in JSON format`
      },
      {
        label: `Export ${currentPage} (CSV)`,
        icon: <FileSpreadsheet size={16} />,
        action: () => {
          switch (currentPage) {
            case 'customers':
              generateCSV(data.customers, 'customers.csv');
              break;
            case 'sales':
              generateCSV(data.sales, 'sales.csv');
              break;
            case 'products':
              generateCSV(data.shoes, 'products.csv');
              break;
            case 'statistics':
              generateCSV(data.monthlyStats, 'monthly-stats.csv');
              break;
          }
        },
        description: `${currentPage} data in CSV format`
      },
      {
        label: `Generate ${currentPage} Report`,
        icon: <FileText size={16} />,
        action: generateReport,
        description: `Comprehensive ${currentPage} report`
      }
    ];

    return baseOptions;
  };

  const exportOptions = getExportOptions();

  const getDataSummary = () => {
    switch (currentPage) {
      case 'customers':
        return {
          total: data.customers.length,
          active: data.customers.filter(c => c.status === 'active').length,
          type: 'customers'
        };
      case 'sales':
        return {
          total: data.sales.length,
          completed: data.sales.filter(s => s.status === 'completed').length,
          type: 'sales'
        };
      case 'products':
        return {
          total: data.shoes.length,
          lowStock: data.shoes.filter(s => s.stock < 20).length,
          type: 'products'
        };
      case 'statistics':
        return {
          total: data.monthlyStats.length,
          months: data.monthlyStats.length,
          type: 'statistics'
        };
      default:
        return { total: 0, type: 'items' };
    }
  };

  const summary = getDataSummary();

  return (
    <div className="export-panel">
      <div className="export-header">
        <h2>
          <Download size={20} />
          Export {currentPage}
        </h2>
      </div>

      <div className="export-options">
        {exportOptions.map((option, index) => (
          <button
            key={index}
            className="export-option"
            onClick={option.action}
          >
            <div className="export-icon">
              {option.icon}
            </div>
            <div className="export-content">
              <span className="export-label">{option.label}</span>
              <span className="export-description">{option.description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="export-info">
        <p>
          <strong>Data Summary:</strong>
        </p>
        <ul>
          <li>{summary.total} total {summary.type}</li>
          {summary.active && <li>{summary.active} active</li>}
          {summary.completed && <li>{summary.completed} completed</li>}
          {summary.lowStock && <li>{summary.lowStock} low stock</li>}
          {summary.months && <li>{summary.months} months of data</li>}
        </ul>
      </div>
    </div>
  );
}; 