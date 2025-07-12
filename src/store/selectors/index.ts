import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { DashboardMetrics } from '../types';

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// UI selectors
export const selectUi = (state: RootState) => state.ui;
export const selectActiveTab = (state: RootState) => state.ui.activeTab;
export const selectSidebarCollapsed = (state: RootState) => state.ui.sidebarCollapsed;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectModals = (state: RootState) => state.ui.modals;
export const selectUiLoading = (state: RootState) => state.ui.loading;

// Notification selectors
export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(n => !n.read)
);

export const selectNotificationCount = createSelector(
  [selectUnreadNotifications],
  (unreadNotifications) => unreadNotifications.length
);

// Filter selectors
export const selectFilters = (state: RootState) => state.filters;
export const selectCustomerFilters = (state: RootState) => state.filters.customers;
export const selectShoeFilters = (state: RootState) => state.filters.shoes;
export const selectSaleFilters = (state: RootState) => state.filters.sales;
export const selectGlobalFilters = (state: RootState) => state.filters.global;

// API data selectors
export const selectApiState = (state: RootState) => state.api;

// Dashboard metrics selector
export const selectDashboardMetrics = createSelector(
  [(state: RootState) => state.api.queries],
  (queries): DashboardMetrics | null => {
    const dashboardQuery = Object.values(queries).find(
      query => query?.endpointName === 'getDashboardData'
    );
    
    if (!dashboardQuery?.data) return null;
    
    const data = dashboardQuery.data as any;
    
    const totalRevenue = data.sales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);
    const totalProfit = data.sales.reduce((sum: number, sale: any) => sum + sale.profit, 0);
    const totalSales = data.sales.length;
    const totalCustomers = data.customers.length;
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Find top selling shoe
    const shoesSales = data.sales.reduce((acc: Record<string, number>, sale: any) => {
      acc[sale.shoeId] = (acc[sale.shoeId] || 0) + sale.quantity;
      return acc;
    }, {});

    const topSellingShoeId = Object.entries(shoesSales).reduce((a, b) => 
      shoesSales[a[0]] > shoesSales[b[0]] ? a : b
    )?.[0];

    const topSellingShoe = data.shoes.find((shoe: any) => shoe.id === topSellingShoeId)?.name || '';

    // Calculate monthly growth
    const lastTwoMonths = data.monthlyStats.slice(-2);
    const monthlyGrowth = lastTwoMonths.length === 2
      ? ((lastTwoMonths[1].revenue - lastTwoMonths[0].revenue) / lastTwoMonths[0].revenue) * 100
      : 0;

    return {
      totalRevenue,
      totalProfit,
      totalSales,
      totalCustomers,
      averageOrderValue,
      profitMargin,
      topSellingShoe,
      monthlyGrowth,
    };
  }
);

// Filtered data selectors
export const selectFilteredCustomers = createSelector(
  [(state: RootState) => state.api.queries, selectCustomerFilters],
  (queries, filters) => {
    const customersQuery = Object.values(queries).find(
      query => query?.endpointName === 'getCustomers'
    );
    
    return customersQuery?.data || [];
  }
);

export const selectFilteredShoes = createSelector(
  [(state: RootState) => state.api.queries, selectShoeFilters],
  (queries, filters) => {
    const shoesQuery = Object.values(queries).find(
      query => query?.endpointName === 'getShoes'
    );
    
    return shoesQuery?.data || [];
  }
);

export const selectFilteredSales = createSelector(
  [(state: RootState) => state.api.queries, selectSaleFilters],
  (queries, filters) => {
    const salesQuery = Object.values(queries).find(
      query => query?.endpointName === 'getSales'
    );
    
    return salesQuery?.data || [];
  }
);

// Loading selectors
export const selectIsLoading = createSelector(
  [(state: RootState) => state.api.queries],
  (queries) => {
    return Object.values(queries).some(query => query?.status === 'pending');
  }
);

export const selectDashboardLoading = createSelector(
  [(state: RootState) => state.api.queries],
  (queries) => {
    const dashboardQuery = Object.values(queries).find(
      query => query?.endpointName === 'getDashboardData'
    );
    
    return dashboardQuery?.status === 'pending';
  }
);

// Error selectors
export const selectApiErrors = createSelector(
  [(state: RootState) => state.api.queries],
  (queries) => {
    return Object.values(queries)
      .filter(query => query?.status === 'rejected')
      .map(query => query.error);
  }
);