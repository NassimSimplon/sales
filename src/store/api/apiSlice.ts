import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Customer,
  Shoe,
  Sale,
  MonthlyStats,
  DashboardData,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CreateShoeRequest,
  UpdateShoeRequest,
  CreateSaleRequest,
  UpdateSaleRequest,
  FilterParams,
  PaginationParams,
} from '../types';

// Mock data for development
const mockData: DashboardData = {
  customers: [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      totalSpent: 450.00,
      lastPurchase: "2024-12-15",
      status: "active",
      location: "New York, NY"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 987-6543",
      totalSpent: 680.00,
      lastPurchase: "2024-12-10",
      status: "active",
      location: "Los Angeles, CA"
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "+1 (555) 456-7890",
      totalSpent: 320.00,
      lastPurchase: "2024-11-28",
      status: "inactive",
      location: "Chicago, IL"
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 234-5678",
      totalSpent: 890.00,
      lastPurchase: "2024-12-18",
      status: "active",
      location: "Houston, TX"
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 (555) 345-6789",
      totalSpent: 1200.00,
      lastPurchase: "2024-12-20",
      status: "active",
      location: "Phoenix, AZ"
    }
  ],
  shoes: [
    {
      id: "1",
      name: "Air Runner Pro",
      brand: "SoleMax",
      category: "running",
      price: 129.99,
      cost: 65.00,
      stock: 45,
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
      sizes: [7, 8, 9, 10, 11, 12]
    },
    {
      id: "2",
      name: "Classic Leather",
      brand: "Heritage",
      category: "casual",
      price: 89.99,
      cost: 45.00,
      stock: 32,
      image: "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg",
      sizes: [6, 7, 8, 9, 10, 11]
    },
    {
      id: "3",
      name: "Business Elite",
      brand: "Executive",
      category: "formal",
      price: 199.99,
      cost: 100.00,
      stock: 28,
      image: "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg",
      sizes: [7, 8, 9, 10, 11, 12]
    },
    {
      id: "4",
      name: "Court Master",
      brand: "SportTech",
      category: "sports",
      price: 149.99,
      cost: 75.00,
      stock: 38,
      image: "https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg",
      sizes: [6, 7, 8, 9, 10, 11, 12]
    },
    {
      id: "5",
      name: "Urban Walker",
      brand: "CityStep",
      category: "casual",
      price: 79.99,
      cost: 40.00,
      stock: 52,
      image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg",
      sizes: [6, 7, 8, 9, 10, 11]
    }
  ],
  sales: [
    {
      id: "1",
      customerId: "1",
      shoeId: "1",
      quantity: 2,
      size: 10,
      totalAmount: 259.98,
      profit: 129.98,
      date: "2024-12-15",
      status: "completed"
    },
    {
      id: "2",
      customerId: "2",
      shoeId: "3",
      quantity: 1,
      size: 8,
      totalAmount: 199.99,
      profit: 99.99,
      date: "2024-12-10",
      status: "completed"
    },
    {
      id: "3",
      customerId: "4",
      shoeId: "2",
      quantity: 3,
      size: 9,
      totalAmount: 269.97,
      profit: 134.97,
      date: "2024-12-18",
      status: "completed"
    },
    {
      id: "4",
      customerId: "5",
      shoeId: "4",
      quantity: 1,
      size: 11,
      totalAmount: 149.99,
      profit: 74.99,
      date: "2024-12-20",
      status: "completed"
    },
    {
      id: "5",
      customerId: "3",
      shoeId: "5",
      quantity: 2,
      size: 10,
      totalAmount: 159.98,
      profit: 79.98,
      date: "2024-11-28",
      status: "completed"
    }
  ],
  monthlyStats: [
    {
      month: "January 2024",
      revenue: 12500,
      profit: 6250,
      sales: 85,
      customers: 42
    },
    {
      month: "February 2024",
      revenue: 14200,
      profit: 7100,
      sales: 96,
      customers: 48
    },
    {
      month: "March 2024",
      revenue: 13800,
      profit: 6900,
      sales: 92,
      customers: 45
    },
    {
      month: "April 2024",
      revenue: 15600,
      profit: 7800,
      sales: 104,
      customers: 52
    },
    {
      month: "May 2024",
      revenue: 18200,
      profit: 9100,
      sales: 118,
      customers: 59
    },
    {
      month: "June 2024",
      revenue: 16800,
      profit: 8400,
      sales: 112,
      customers: 56
    },
    {
      month: "July 2024",
      revenue: 19500,
      profit: 9750,
      sales: 125,
      customers: 62
    },
    {
      month: "August 2024",
      revenue: 21200,
      profit: 10600,
      sales: 138,
      customers: 68
    },
    {
      month: "September 2024",
      revenue: 20800,
      profit: 10400,
      sales: 135,
      customers: 65
    },
    {
      month: "October 2024",
      revenue: 22500,
      profit: 11250,
      sales: 145,
      customers: 72
    },
    {
      "month": "November 2024",
      "revenue": 24100,
      "profit": 12050,
      "sales": 156,
      "customers": 78
    },
    {
      "month": "December 2024",
      "revenue": 26800,
      "profit": 13400,
      "sales": 168,
      "customers": 84
    }
  ]
};

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Customer', 'Shoe', 'Sale', 'MonthlyStats', 'Dashboard'],
  endpoints: (builder) => ({
    // Dashboard endpoints
    getDashboardData: builder.query<DashboardData, void>({
      queryFn: async () => {
        await delay(800);
        return { data: mockData };
      },
      providesTags: ['Dashboard'],
    }),

    // Customer endpoints
    getCustomers: builder.query<Customer[], FilterParams & PaginationParams>({
      queryFn: async (params) => {
        await delay(300);
        let customers = [...mockData.customers];
        
        if (params.searchTerm) {
          const search = params.searchTerm.toLowerCase();
          customers = customers.filter(c => 
            c.name.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search)
          );
        }
        
        if (params.status && params.status !== 'all') {
          customers = customers.filter(c => c.status === params.status);
        }
        
        return { data: customers };
      },
      providesTags: ['Customer'],
    }),

    getCustomer: builder.query<Customer, string>({
      queryFn: async (id) => {
        await delay(200);
        const customer = mockData.customers.find(c => c.id === id);
        if (!customer) {
          return { error: { status: 404, data: { message: 'Customer not found' } } };
        }
        return { data: customer };
      },
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),

    createCustomer: builder.mutation<Customer, CreateCustomerRequest>({
      queryFn: async (newCustomer) => {
        await delay(500);
        const customer: Customer = {
          ...newCustomer,
          id: String(Date.now()),
          totalSpent: 0,
          lastPurchase: new Date().toISOString().split('T')[0],
          status: 'active',
        };
        mockData.customers.push(customer);
        return { data: customer };
      },
      invalidatesTags: ['Customer', 'Dashboard'],
    }),

    updateCustomer: builder.mutation<Customer, UpdateCustomerRequest>({
      queryFn: async ({ id, ...updates }) => {
        await delay(400);
        const index = mockData.customers.findIndex(c => c.id === id);
        if (index === -1) {
          return { error: { status: 404, data: { message: 'Customer not found' } } };
        }
        mockData.customers[index] = { ...mockData.customers[index], ...updates };
        return { data: mockData.customers[index] };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Customer', id },
        'Dashboard',
      ],
    }),

    deleteCustomer: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay(300);
        const index = mockData.customers.findIndex(c => c.id === id);
        if (index === -1) {
          return { error: { status: 404, data: { message: 'Customer not found' } } };
        }
        mockData.customers.splice(index, 1);
        return { data: undefined };
      },
      invalidatesTags: ['Customer', 'Dashboard'],
    }),

    // Shoe endpoints
    getShoes: builder.query<Shoe[], FilterParams & PaginationParams>({
      queryFn: async (params) => {
        await delay(300);
        let shoes = [...mockData.shoes];
        
        if (params.searchTerm) {
          const search = params.searchTerm.toLowerCase();
          shoes = shoes.filter(s => 
            s.name.toLowerCase().includes(search) ||
            s.brand.toLowerCase().includes(search)
          );
        }
        
        if (params.category && params.category !== 'all') {
          shoes = shoes.filter(s => s.category === params.category);
        }
        
        return { data: shoes };
      },
      providesTags: ['Shoe'],
    }),

    getShoe: builder.query<Shoe, string>({
      queryFn: async (id) => {
        await delay(200);
        const shoe = mockData.shoes.find(s => s.id === id);
        if (!shoe) {
          return { error: { status: 404, data: { message: 'Shoe not found' } } };
        }
        return { data: shoe };
      },
      providesTags: (result, error, id) => [{ type: 'Shoe', id }],
    }),

    createShoe: builder.mutation<Shoe, CreateShoeRequest>({
      queryFn: async (newShoe) => {
        await delay(500);
        const shoe: Shoe = {
          ...newShoe,
          id: String(Date.now()),
        };
        mockData.shoes.push(shoe);
        return { data: shoe };
      },
      invalidatesTags: ['Shoe', 'Dashboard'],
    }),

    updateShoe: builder.mutation<Shoe, UpdateShoeRequest>({
      queryFn: async ({ id, ...updates }) => {
        await delay(400);
        const index = mockData.shoes.findIndex(s => s.id === id);
        if (index === -1) {
          return { error: { status: 404, data: { message: 'Shoe not found' } } };
        }
        mockData.shoes[index] = { ...mockData.shoes[index], ...updates };
        return { data: mockData.shoes[index] };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Shoe', id },
        'Dashboard',
      ],
    }),

    deleteShoe: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay(300);
        const index = mockData.shoes.findIndex(s => s.id === id);
        if (index === -1) {
          return { error: { status: 404, data: { message: 'Shoe not found' } } };
        }
        mockData.shoes.splice(index, 1);
        return { data: undefined };
      },
      invalidatesTags: ['Shoe', 'Dashboard'],
    }),

    // Sale endpoints
    getSales: builder.query<Sale[], FilterParams & PaginationParams>({
      queryFn: async (params) => {
        await delay(300);
        let sales = [...mockData.sales];
        
        if (params.status && params.status !== 'all') {
          sales = sales.filter(s => s.status === params.status);
        }
        
        if (params.dateRange && params.dateRange !== 'all') {
          const now = new Date();
          const cutoffDate = new Date();
          
          switch (params.dateRange) {
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
          
          sales = sales.filter(s => new Date(s.date) >= cutoffDate);
        }
        
        return { data: sales };
      },
      providesTags: ['Sale'],
    }),

    getSale: builder.query<Sale, string>({
      queryFn: async (id) => {
        await delay(200);
        const sale = mockData.sales.find(s => s.id === id);
        if (!sale) {
          return { error: { status: 404, data: { message: 'Sale not found' } } };
        }
        return { data: sale };
      },
      providesTags: (result, error, id) => [{ type: 'Sale', id }],
    }),

    createSale: builder.mutation<Sale, CreateSaleRequest>({
      queryFn: async (newSale) => {
        await delay(500);
        
        // Find shoe to calculate total and profit
        const shoe = mockData.shoes.find(s => s.id === newSale.shoeId);
        if (!shoe) {
          return { error: { status: 404, data: { message: 'Shoe not found' } } };
        }
        
        const totalAmount = shoe.price * newSale.quantity;
        const profit = (shoe.price - shoe.cost) * newSale.quantity;
        
        const sale: Sale = {
          ...newSale,
          id: String(Date.now()),
          totalAmount,
          profit,
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
        };
        
        mockData.sales.push(sale);
        
        // Update shoe stock
        shoe.stock -= newSale.quantity;
        
        // Update customer total spent
        const customer = mockData.customers.find(c => c.id === newSale.customerId);
        if (customer) {
          customer.totalSpent += totalAmount;
          customer.lastPurchase = sale.date;
        }
        
        return { data: sale };
      },
      invalidatesTags: ['Sale', 'Customer', 'Shoe', 'Dashboard'],
    }),

    updateSale: builder.mutation<Sale, UpdateSaleRequest>({
      queryFn: async ({ id, ...updates }) => {
        await delay(400);
        const index = mockData.sales.findIndex(s => s.id === id);
        if (index === -1) {
          return { error: { status: 404, data: { message: 'Sale not found' } } };
        }
        mockData.sales[index] = { ...mockData.sales[index], ...updates };
        return { data: mockData.sales[index] };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Sale', id },
        'Dashboard',
      ],
    }),

    deleteSale: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay(300);
        const index = mockData.sales.findIndex(s => s.id === id);
        if (index === -1) {
          return { error: { status: 404, data: { message: 'Sale not found' } } };
        }
        mockData.sales.splice(index, 1);
        return { data: undefined };
      },
      invalidatesTags: ['Sale', 'Dashboard'],
    }),

    // Monthly stats endpoint
    getMonthlyStats: builder.query<MonthlyStats[], void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockData.monthlyStats };
      },
      providesTags: ['MonthlyStats'],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetShoesQuery,
  useGetShoeQuery,
  useCreateShoeMutation,
  useUpdateShoeMutation,
  useDeleteShoeMutation,
  useGetSalesQuery,
  useGetSaleQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
  useGetMonthlyStatsQuery,
} = api;