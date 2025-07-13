import { useMemo } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { DashboardMetrics } from '../types';

export function useDashboardMetrics(): DashboardMetrics {
  const { state } = useDashboard();
  const { data } = state;

  return useMemo(() => {
    const totalRevenue = data.sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = data.sales.reduce((sum, sale) => sum + sale.profit, 0);
    const totalSales = data.sales.length;
    const totalCustomers = data.customers.length;
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Find top selling shoe
    const shoesSales = data.sales.reduce((acc, sale) => {
      acc[sale.shoeId] = (acc[sale.shoeId] || 0) + sale.quantity;
      return acc;
    }, {} as Record<string, number>);

    const topSellingShoeId = Object.entries(shoesSales).reduce((a, b) => 
      shoesSales[a[0]] > shoesSales[b[0]] ? a : b
    )?.[0];

    const topSellingShoe = data.shoes.find(shoe => shoe.id === topSellingShoeId)?.name || '';

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
      monthlyGrowth
    };
  }, [data]);
}