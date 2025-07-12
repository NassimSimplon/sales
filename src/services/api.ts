import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  category: string;
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
  status: 'completed' | 'pending' | 'canceled';
}

export interface MonthlyStat {
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
  monthlyStats: MonthlyStat[];
}

export interface FilterRule {
  entity: 'customers' | 'shoes' | 'sales' | 'monthlyStats';
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'in' | 'notEquals';
  value: string | number | boolean | string[] | number[] | boolean[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['Customers', 'Shoes', 'Sales', 'MonthlyStats'],
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      query: () => '/dashboard',
      providesTags: ['Customers', 'Shoes', 'Sales', 'MonthlyStats'],
    }),
    getFilteredData: builder.query<DashboardData, FilterRule[]>({
      query: (filters) => ({
        url: '/filter',
        method: 'POST',
        body: { filters },
      }),
    }),
    getCustomers: builder.query<Customer[], void>({
      query: () => '/customers',
      providesTags: ['Customers'],
    }),
    getShoes: builder.query<Shoe[], void>({
      query: () => '/shoes',
      providesTags: ['Shoes'],
    }),
    getSales: builder.query<Sale[], void>({
      query: () => '/sales',
      providesTags: ['Sales'],
    }),
    getMonthlyStats: builder.query<MonthlyStat[], void>({
      query: () => '/monthlyStats',
      providesTags: ['MonthlyStats'],
    }),
    addCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (body) => ({
        url: '/customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Customers'],
    }),
    updateCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: ({ id, ...body }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Customers'],
    }),
    addShoe: builder.mutation<Shoe, Partial<Shoe>>({
      query: (body) => ({
        url: '/shoes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Shoes'],
    }),
    updateShoe: builder.mutation<Shoe, Partial<Shoe>>({
      query: ({ id, ...body }) => ({
        url: `/shoes/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Shoes'],
    }),
    addSale: builder.mutation<Sale, Partial<Sale>>({
      query: (body) => ({
        url: '/sales',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Sales', 'Customers'],
    }),
    updateSale: builder.mutation<Sale, Partial<Sale>>({
      query: ({ id, ...body }) => ({
        url: `/sales/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Sales'],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetFilteredDataQuery,
  useGetCustomersQuery,
  useGetShoesQuery,
  useGetSalesQuery,
  useGetMonthlyStatsQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useAddShoeMutation,
  useUpdateShoeMutation,
  useAddSaleMutation,
  useUpdateSaleMutation,
} = api;