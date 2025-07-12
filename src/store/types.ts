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
  shoes: Shoe[];
  sales: Sale[];
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

export interface ApiError {
  status: number;
  data: {
    message: string;
    details?: string;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  searchTerm?: string;
  category?: string;
  status?: string;
  dateRange?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: string;
}

export interface CreateShoeRequest {
  name: string;
  brand: string;
  category: Shoe['category'];
  price: number;
  cost: number;
  stock: number;
  image: string;
  sizes: number[];
}

export interface UpdateShoeRequest extends Partial<CreateShoeRequest> {
  id: string;
}

export interface CreateSaleRequest {
  customerId: string;
  shoeId: string;
  quantity: number;
  size: number;
}

export interface UpdateSaleRequest extends Partial<CreateSaleRequest> {
  id: string;
  status?: Sale['status'];
}