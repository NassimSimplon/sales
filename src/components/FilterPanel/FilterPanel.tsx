import React from "react";
import { Filter, MapPin, Package, Users, Zap } from "lucide-react";
import { DashboardData, FilterState, NavigationPage } from "../../types";
import { CalendarFilter } from "./CalendarFilter";
import { CheckboxFilter } from "./CheckboxFilter";
import { ComboFilter } from "./ComboFilter";
import { ListboxFilter } from "./ListboxFilter";

interface FilterPanelProps {
  filters: FilterState;
  data: DashboardData;
  currentPage: NavigationPage;
  onFilterChange: (action: any) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  data,
  currentPage,
  onFilterChange
}) => {
  const categories = [...new Set(data.shoes.map(shoe => shoe.category))];
  const brands = [...new Set(data.shoes.map(shoe => shoe.brand))];
  const locations = [...new Set(data.customers.map(customer => customer.location))];
  const customerNames = data.customers.map(customer => customer.name);
  const productNames = data.shoes.map(shoe => shoe.name);

  const quickFilterOptions = [
    {
      key: 'highValueCustomers',
      label: 'High-value customers',
      description: 'Customers with >$500 total spent'
    },
    {
      key: 'lowStock',
      label: 'Low stock items',
      description: 'Products with <20 units in stock'
    },
    {
      key: 'recentSales',
      label: 'Recent sales',
      description: 'Sales from last 30 days'
    }
  ];

  const getPageSpecificFilters = () => {
    switch (currentPage) {
      case 'statistics':
        return (
          <>
            <CalendarFilter
              startDate={filters.dateRange.start}
              endDate={filters.dateRange.end}
              onDateRangeChange={(start, end) =>
                onFilterChange({ type: 'SET_DATE_RANGE', payload: { start, end } })
              }
            />
            <CheckboxFilter
              label="Quick Filters"
              options={quickFilterOptions}
              selectedValues={filters.quickFilters}
              onSelectionChange={(key, value) =>
                onFilterChange({ 
                  type: 'SET_QUICK_FILTER', 
                  payload: { key: key as keyof FilterState['quickFilters'], value } 
                })
              }
              icon={<Zap size={16} />}
            />
          </>
        );
      
      case 'sales':
        return (
          <>
            <CalendarFilter
              startDate={filters.dateRange.start}
              endDate={filters.dateRange.end}
              onDateRangeChange={(start, end) =>
                onFilterChange({ type: 'SET_DATE_RANGE', payload: { start, end } })
              }
            />
            <ComboFilter
              label="Search Customers"
              options={customerNames}
              value={filters.searchTerm}
              onValueChange={(value) =>
                onFilterChange({ type: 'SET_SEARCH_TERM', payload: value })
              }
              placeholder="Search customers..."
              icon={<Users size={16} />}
            />
            <ListboxFilter
              label="Product Categories"
              options={categories}
              selectedValues={filters.categories}
              onSelectionChange={(values) =>
                onFilterChange({ type: 'SET_CATEGORIES', payload: values })
              }
              icon={<Package size={16} />}
            />
          </>
        );
      
      case 'customers':
        return (
          <>
            <ComboFilter
              label="Search Customers"
              options={customerNames}
              value={filters.searchTerm}
              onValueChange={(value) =>
                onFilterChange({ type: 'SET_SEARCH_TERM', payload: value })
              }
              placeholder="Search customers..."
              icon={<Users size={16} />}
            />
            <ListboxFilter
              label="Customer Status"
              options={['active', 'inactive']}
              selectedValues={filters.customerStatus}
              onSelectionChange={(values) =>
                onFilterChange({ type: 'SET_CUSTOMER_STATUS', payload: values })
              }
              icon={<Users size={16} />}
            />
            <ListboxFilter
              label="Locations"
              options={locations}
              selectedValues={filters.locations}
              onSelectionChange={(values) =>
                onFilterChange({ type: 'SET_LOCATIONS', payload: values })
              }
              icon={<MapPin size={16} />}
            />
            <CheckboxFilter
              label="Quick Filters"
              options={[quickFilterOptions[0]]} // Only high-value customers for customer page
              selectedValues={filters.quickFilters}
              onSelectionChange={(key, value) =>
                onFilterChange({ 
                  type: 'SET_QUICK_FILTER', 
                  payload: { key: key as keyof FilterState['quickFilters'], value } 
                })
              }
              icon={<Zap size={16} />}
            />
          </>
        );
      
      case 'products':
        return (
          <>
            <ComboFilter
              label="Search Products"
              options={productNames}
              value={filters.searchTerm}
              onValueChange={(value) =>
                onFilterChange({ type: 'SET_SEARCH_TERM', payload: value })
              }
              placeholder="Search products..."
              icon={<Package size={16} />}
            />
            <ListboxFilter
              label="Categories"
              options={categories}
              selectedValues={filters.categories}
              onSelectionChange={(values) =>
                onFilterChange({ type: 'SET_CATEGORIES', payload: values })
              }
              icon={<Package size={16} />}
            />
            <ListboxFilter
              label="Brands"
              options={brands}
              selectedValues={filters.brands}
              onSelectionChange={(values) =>
                onFilterChange({ type: 'SET_BRANDS', payload: values })
              }
              icon={<Package size={16} />}
            />
            <CheckboxFilter
              label="Quick Filters"
              options={[quickFilterOptions[1]]} // Only low stock for products page
              selectedValues={filters.quickFilters}
              onSelectionChange={(key, value) =>
                onFilterChange({ 
                  type: 'SET_QUICK_FILTER', 
                  payload: { key: key as keyof FilterState['quickFilters'], value } 
                })
              }
              icon={<Zap size={16} />}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>
          <Filter size={20} />
          Filters
        </h2>
        <button
          className="reset-filters-btn"
          onClick={() => onFilterChange({ type: 'RESET_FILTERS' })}
        >
          Reset All
        </button>
      </div>

      <div className="filter-content">
        {getPageSpecificFilters()}
      </div>
    </div>
  );
};  