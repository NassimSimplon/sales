import { useReducer, useMemo } from 'react';
import { FilterState, DashboardData, Customer, Sale, Shoe } from '../types';

const initialFilterState: FilterState = {
  dateRange: {
    start: '',
    end: ''
  },
  categories: [],
  brands: [],
  customerStatus: [],
  locations: [],
  searchTerm: '',
  quickFilters: {
    highValueCustomers: false,
    lowStock: false,
    recentSales: false
  }
};

type FilterAction = 
  | { type: 'SET_DATE_RANGE'; payload: { start: string; end: string } }
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'SET_BRANDS'; payload: string[] }
  | { type: 'SET_CUSTOMER_STATUS'; payload: string[] }
  | { type: 'SET_LOCATIONS'; payload: string[] }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_QUICK_FILTER'; payload: { key: keyof FilterState['quickFilters']; value: boolean } }
  | { type: 'RESET_FILTERS' };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_BRANDS':
      return { ...state, brands: action.payload };
    case 'SET_CUSTOMER_STATUS':
      return { ...state, customerStatus: action.payload };
    case 'SET_LOCATIONS':
      return { ...state, locations: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_QUICK_FILTER':
      return {
        ...state,
        quickFilters: {
          ...state.quickFilters,
          [action.payload.key]: action.payload.value
        }
      };
    case 'RESET_FILTERS':
      return initialFilterState;
    default:
      return state;
  }
}

export function useFilters(data: DashboardData) {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

  const filteredData = useMemo(() => {
    let filteredCustomers = [...data.customers];
    let filteredSales = [...data.sales];
    let filteredShoes = [...data.shoes];

    // Apply search term filter
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

    // Apply customer status filter
    if (filters.customerStatus.length > 0) {
      filteredCustomers = filteredCustomers.filter(customer =>
        filters.customerStatus.includes(customer.status)
      );
    }

    // Apply location filter
    if (filters.locations.length > 0) {
      filteredCustomers = filteredCustomers.filter(customer =>
        filters.locations.includes(customer.location)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filteredShoes = filteredShoes.filter(shoe =>
        filters.categories.includes(shoe.category)
      );
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      filteredShoes = filteredShoes.filter(shoe =>
        filters.brands.includes(shoe.brand)
      );
    }

    // Apply date range filter to sales
    if (filters.dateRange.start && filters.dateRange.end) {
      filteredSales = filteredSales.filter(sale => {
        const saleDate = new Date(sale.date);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return saleDate >= startDate && saleDate <= endDate;
      });
    }

    // Apply quick filters
    if (filters.quickFilters.highValueCustomers) {
      filteredCustomers = filteredCustomers.filter(customer => customer.totalSpent > 500);
    }

    if (filters.quickFilters.lowStock) {
      filteredShoes = filteredShoes.filter(shoe => shoe.stock < 20);
    }

    if (filters.quickFilters.recentSales) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filteredSales = filteredSales.filter(sale => new Date(sale.date) >= thirtyDaysAgo);
    }

    // Filter sales based on filtered customers and shoes
    const customerIds = new Set(filteredCustomers.map(c => c.id));
    const shoeIds = new Set(filteredShoes.map(s => s.id));
    
    filteredSales = filteredSales.filter(sale =>
      customerIds.has(sale.customerId) && shoeIds.has(sale.shoeId)
    );

    return {
      customers: filteredCustomers,
      sales: filteredSales,
      shoes: filteredShoes,
      monthlyStats: data.monthlyStats
    };
  }, [data, filters]);

  return {
    filters,
    filteredData,
    dispatch
  };
} 