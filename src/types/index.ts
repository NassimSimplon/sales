export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  lastPurchase: string;
  status: 'active' | 'inactive';
  location: string;
}

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  category: 'running' | 'casual' | 'formal' | 'sports';
  price: number;
  cost: number;
  stock: number;
  image: string;
  sizes: number[];
}

export interface Sale {
  id: string;
  customerId: string;
  shoeId: string;
  quantity: number;
  size: number;
  totalAmount: number;
  profit: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface MonthlyStats {
  month: string;
  revenue: number;
  profit: number;
  sales: number;
  customers: number;
}

export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  categories: string[];
  brands: string[];
  customerStatus: string[];
  locations: string[];
  searchTerm: string;
  quickFilters: {
    highValueCustomers: boolean;
    lowStock: boolean;
    recentSales: boolean;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface DashboardData {
  customers: Customer[];
  shoes: Shoe[];
  sales: Sale[];
  monthlyStats: MonthlyStats[];
}

export interface KPIData {
  totalRevenue: number;
  totalProfit: number;
  totalCustomers: number;
  activeCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  totalSales: number;
  avgOrderValue: number;
  profitMargin: number;
  customerRetention: number;
}

export type NavigationPage = 'statistics' | 'sales' | 'customers' | 'products';</parameter>