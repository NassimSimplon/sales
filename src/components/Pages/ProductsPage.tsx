import React, { useMemo } from 'react';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { DataTable } from '../DataTable/DataTable';
import { BarChart } from '../Charts/BarChart';
import { PieChart } from '../Charts/PieChart';
import { DashboardData, Shoe } from '../../types';

interface ProductsPageProps {
  data: DashboardData;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ data }) => {
  const productKPIs = useMemo(() => {
    const totalProducts = data.shoes.length;
    const lowStockProducts = data.shoes.filter(s => s.stock < 20).length;
    const outOfStockProducts = data.shoes.filter(s => s.stock === 0).length;
    const totalInventoryValue = data.shoes.reduce((sum, shoe) => sum + (shoe.price * shoe.stock), 0);
    const avgPrice = data.shoes.reduce((sum, shoe) => sum + shoe.price, 0) / totalProducts;
    const totalStock = data.shoes.reduce((sum, shoe) => sum + shoe.stock, 0);

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalInventoryValue,
      avgPrice,
      totalStock
    };
  }, [data.shoes]);

  const categoryDistributionData = useMemo(() => {
    const categoryCounts = data.shoes.reduce((acc, shoe) => {
      acc[shoe.category] = (acc[shoe.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(categoryCounts).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
      datasets: [{
        label: 'Products by Category',
        data: Object.values(categoryCounts),
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']
      }]
    };
  }, [data.shoes]);

  const brandDistributionData = useMemo(() => {
    const brandCounts = data.shoes.reduce((acc, shoe) => {
      acc[shoe.brand] = (acc[shoe.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(brandCounts),
      datasets: [{
        label: 'Products by Brand',
        data: Object.values(brandCounts),
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
      }]
    };
  }, [data.shoes]);

  const stockLevelsData = useMemo(() => {
    const sortedShoes = [...data.shoes].sort((a, b) => a.stock - b.stock).slice(0, 6);
    
    return {
      labels: sortedShoes.map(shoe => shoe.name),
      datasets: [{
        label: 'Stock Level',
        data: sortedShoes.map(shoe => shoe.stock),
        backgroundColor: sortedShoes.map(shoe => 
          shoe.stock < 10 ? '#ef4444' : 
          shoe.stock < 20 ? '#f59e0b' : '#10b981'
        )
      }]
    };
  }, [data.shoes]);

  const productColumns = [
    { 
      key: 'image', 
      label: 'Image',
      render: (value: string, row: Shoe) => (
        <img src={value} alt={row.name} className="product-image" />
      )
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true },
    { 
      key: 'category', 
      label: 'Category', 
      sortable: true,
      render: (value: string) => (
        <span className={`category-badge ${value}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'price', 
      label: 'Price', 
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      key: 'cost', 
      label: 'Cost', 
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      key: 'stock', 
      label: 'Stock', 
      sortable: true,
      render: (value: number) => (
        <span className={`stock-level ${value < 10 ? 'critical' : value < 20 ? 'low' : 'good'}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'sizes', 
      label: 'Sizes',
      render: (value: number[]) => (
        <div className="sizes-list">
          {value.map(size => (
            <span key={size} className="size-badge">{size}</span>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Product Management</h1>
        <p>Manage your product catalog and inventory</p>
      </div>

      {/* Product KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon products">
            <Package size={24} />
          </div>
          <div className="kpi-content">
            <h3>Total Products</h3>
            <p className="kpi-value">{productKPIs.totalProducts}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon warning">
            <AlertTriangle size={24} />
          </div>
          <div className="kpi-content">
            <h3>Low Stock Items</h3>
            <p className="kpi-value">{productKPIs.lowStockProducts}</p>
            <p className="kpi-subtitle">{productKPIs.outOfStockProducts} out of stock</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <h3>Inventory Value</h3>
            <p className="kpi-value">${productKPIs.totalInventoryValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon avg-price">
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <h3>Average Price</h3>
            <p className="kpi-value">${productKPIs.avgPrice.toFixed(2)}</p>
            <p className="kpi-subtitle">{productKPIs.totalStock} total units</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="charts-header">
          <h2>Product Analytics</h2>
          <div className="auto-refresh-indicator">
            <div className="refresh-dot"></div>
            <span>Live data</span>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Products by Category</h3>
            <PieChart 
              data={categoryDistributionData} 
              width={350} 
              height={300}
            />
          </div>

          <div className="chart-card">
            <h3>Products by Brand</h3>
            <BarChart 
              data={brandDistributionData} 
              width={400} 
              height={300}
            />
          </div>

          <div className="chart-card">
            <h3>Stock Levels (Lowest First)</h3>
            <BarChart 
              data={stockLevelsData} 
              width={400} 
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="table-section">
        <DataTable
          data={data.shoes}
          columns={productColumns}
          title="Product Catalog"
          searchable={true}
          pageSize={10}
        />
      </div>
    </div>
  );
}; 