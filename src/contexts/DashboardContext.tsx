import React, { ReactNode, createContext, useContext, useEffect, useMemo, useReducer } from "react";
import dashboardData from "../data/dashboard-data.json";
import { Customer, DashboardData, DashboardMetrics, Sale, Shoe } from "../types";

interface DashboardState {
  data: DashboardData;
  metrics: DashboardMetrics;
  loading: boolean;
  error: string | null;
  filters: {
    dateRange: string;
    category: string;
    status: string;
    searchTerm: string;
    searchType: string; // Added search type filter
  };
}

type DashboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: DashboardData }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'UPDATE_FILTERS'; payload: Partial<DashboardState['filters']> }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_SHOE'; payload: Shoe };

const initialState: DashboardState = {
  data: {
    customers: [],
    shoes: [],
    sales: [],
    monthlyStats: []
  },
  metrics: {
    totalRevenue: 0,
    totalProfit: 0,
    totalSales: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    profitMargin: 0,
    topSellingShoe: '',
    monthlyGrowth: 0
  },
  loading: true,
  error: null,
  filters: {
    dateRange: 'all',
    category: 'all',
    status: 'all',
    searchTerm: '',
    searchType: 'all' // Default to search all
  }
};

const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  filteredSales: Sale[];
  filteredCustomers: Customer[];
  filteredShoes: Shoe[];
} | null>(null);

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_SALE':
      return {
        ...state,
        data: {
          ...state.data,
          sales: [...state.data.sales, action.payload]
        }
      };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        data: {
          ...state.data,
          customers: state.data.customers.map(customer =>
            customer.id === action.payload.id ? action.payload : customer
          )
        }
      };
    case 'UPDATE_SHOE':
      return {
        ...state,
        data: {
          ...state.data,
          shoes: state.data.shoes.map(shoe =>
            shoe.id === action.payload.id ? action.payload : shoe
          )
        }
      };
    default:
      return state;
  }
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Filter customers based on search term and search type
  const filteredCustomers = useMemo(() => {
    if (!state.filters.searchTerm) return state.data.customers;
    
    // If search type is not 'all' and not 'customer', return all customers
    if (state.filters.searchType !== 'all' && state.filters.searchType !== 'customer') {
      return state.data.customers;
    }
    
    const searchTerm = state.filters.searchTerm.toLowerCase();
    return state.data.customers.filter(customer =>
      (customer.name && customer.name.toLowerCase().includes(searchTerm)) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm)) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm))
    );
  }, [state.data.customers, state.filters.searchTerm, state.filters.searchType]);

  // Filter shoes based on search term and search type
  const filteredShoes = useMemo(() => {
    if (!state.filters.searchTerm) return state.data.shoes;
    
    // If search type is not 'all' and not 'shoe', return all shoes
    if (state.filters.searchType !== 'all' && state.filters.searchType !== 'shoe') {
      return state.data.shoes;
    }
    
    const searchTerm = state.filters.searchTerm.toLowerCase();
    return state.data.shoes.filter(shoe =>
      (shoe.model && shoe.model.toLowerCase().includes(searchTerm)) ||
      (shoe.brand && shoe.brand.toLowerCase().includes(searchTerm)) ||
      (shoe.category && shoe.category.toLowerCase().includes(searchTerm))
    );
  }, [state.data.shoes, state.filters.searchTerm, state.filters.searchType]);

  // Filter sales based on search term and search type
  const filteredSales = useMemo(() => {
    if (!state.filters.searchTerm) return state.data.sales;
    
    const searchTerm = state.filters.searchTerm.toLowerCase();
    const searchType = state.filters.searchType;
    
    return state.data.sales.filter(sale => {
      // Search by shoe name/brand/model only
      if (searchType === 'shoe') {
        const shoe = state.data.shoes.find(s => s.id === sale.shoeId);
        return shoe && (
          (shoe.model && shoe.model.toLowerCase().includes(searchTerm)) ||
          (shoe.brand && shoe.brand.toLowerCase().includes(searchTerm))
        );
      }
      
      // Search by customer only
      if (searchType === 'customer') {
        const customer = state.data.customers.find(c => c.id === sale.customerId);
        return customer && customer.name && customer.name.toLowerCase().includes(searchTerm);
      }
      
      // Search by sale ID only
      if (searchType === 'sale') {
        return sale.id && sale.id.toLowerCase().includes(searchTerm);
      }
      
      // Search all fields (default behavior)
      if (searchType === 'all') {
        // Search by sale ID
        if (sale.id && sale.id.toLowerCase().includes(searchTerm)) return true;
        
        // Search by customer name
        const customer = state.data.customers.find(c => c.id === sale.customerId);
        if (customer && customer.name && customer.name.toLowerCase().includes(searchTerm)) return true;
        
        // Search by shoe model/brand
        const shoe = state.data.shoes.find(s => s.id === sale.shoeId);
        if (shoe && (
          (shoe.model && shoe.model.toLowerCase().includes(searchTerm)) ||
          (shoe.brand && shoe.brand.toLowerCase().includes(searchTerm))
        )) return true;
        
        // Search by sale amount
        if (sale.amount && sale.amount.toString().includes(searchTerm)) return true;
        
        // Search by sale status
        if (sale.status && sale.status.toLowerCase().includes(searchTerm)) return true;
      }
      
      return false;
    });
  }, [state.data.sales, state.data.customers, state.data.shoes, state.filters.searchTerm, state.filters.searchType]);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      dispatch({ type: 'SET_DATA', payload: dashboardData as DashboardData });
    }, 1000);
  }, []);

  return (
    <DashboardContext.Provider value={{ 
      state, 
      dispatch, 
      filteredSales, 
      filteredCustomers, 
      filteredShoes 
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}