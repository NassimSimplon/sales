import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from '../types';
import { generateRandomUpdate } from '../data/mockData';

interface UseAutoRefreshOptions {
  interval?: number; // in milliseconds
  enabled?: boolean;
}

export function useAutoRefresh(
  initialData: DashboardData,
  options: UseAutoRefreshOptions = {}
) {
  const { interval = 5000, enabled = true } = options; // Default 5 seconds for testing
  
  const [data, setData] = useState<DashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshCount, setRefreshCount] = useState(0);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(enabled);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    
    // Simulate network delay
    setTimeout(() => {
      setData(prevData => generateRandomUpdate(prevData));
      setLastRefresh(new Date());
      setRefreshCount(prev => prev + 1);
      setIsRefreshing(false);
    }, 500);
  }, []);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefreshEnabled(prev => !prev);
  }, []);

  const manualRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const intervalId = setInterval(() => {
      refreshData();
    }, interval);

    return () => clearInterval(intervalId);
  }, [autoRefreshEnabled, interval, refreshData]);

  return {
    data,
    isRefreshing,
    lastRefresh,
    refreshCount,
    autoRefreshEnabled,
    toggleAutoRefresh,
    manualRefresh
  };
} 