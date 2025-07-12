import { useMemo } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { Customer, Shoe, Sale } from '../types';

interface FilteredData {
  customers: Customer[];
  shoes: Shoe[];
  sales: Sale[];
}

export function useFilteredData(): FilteredData {
  const { state } = useDashboard();
  const { data, filters } = state;

  return useMemo(() => {
    let filteredCustomers = data.customers;
    let filteredShoes = data.shoes;
    let filteredSales = data.sales;

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower)
      );

      filteredShoes = filteredShoes.filter(shoe =>
        shoe.name.toLowerCase().includes(searchLower) ||
        shoe.brand.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filteredShoes = filteredShoes.filter(shoe => shoe.category === filters.category);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === filters.status);
      filteredSales = filteredSales.filter(sale => sale.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (filters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filteredSales = filteredSales.filter(sale => new Date(sale.date) >= cutoffDate);
    }

    return {
      customers: filteredCustomers,
      shoes: filteredShoes,
      sales: filteredSales
    };
  }, [data, filters]);
}