import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { DashboardData, DashboardMetrics, Customer, Shoe, Sale } from '../types';
import dashboardData from '../data/dashboard-data.json';

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
    searchTerm: ''
  }
};

const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
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

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      dispatch({ type: 'SET_DATA', payload: dashboardData as DashboardData });
    }, 1000);
  }, []);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
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