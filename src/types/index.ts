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

export interface DashboardData {
  customers: Customer[];
  shoes: any[];
  sales: any[];
  monthlyStats: MonthlyStats[];
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalProfit: number;
  totalSales: number;
  totalCustomers: number;
  averageOrderValue: number;
  profitMargin: number;
  topSellingShoe: string;
  monthlyGrowth: number;
}