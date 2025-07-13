import React from "react";
import { BarChart3, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { NavigationPage } from "../../types";

interface SidebarProps {
  currentPage: NavigationPage;
  onPageChange: (page: NavigationPage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const navigationItems = [
    {
      id: 'statistics' as NavigationPage,
      label: 'Statistics',
      icon: <BarChart3 size={20} />,
      description: 'Overview & Analytics'
    },
    {
      id: 'sales' as NavigationPage,
      label: 'Sales',
      icon: <TrendingUp size={20} />,
      description: 'Sales Transactions'
    },
    {
      id: 'customers' as NavigationPage,
      label: 'Customers',
      icon: <Users size={20} />,
      description: 'Customer Management'
    },
    {
      id: 'products' as NavigationPage,
      label: 'Products',
      icon: <Package size={20} />,
      description: 'Product Catalog'
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <ShoppingCart size={32} />
          <div className="logo-text">
            <h1>SoleStore</h1>
            <p>Analytics Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            <div className="nav-icon">{item.icon}</div>
            <div className="nav-content">
              <span className="nav-label">{item.label}</span>
              <span className="nav-description">{item.description}</span>
            </div>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="version-info">
          <p>Version 2.1.0</p>
          <p>© 2024 SoleStore</p>
        </div>
      </div>
    </aside>
  );
}; 