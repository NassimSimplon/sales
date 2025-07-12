import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  customers: {
    searchTerm: string;
    status: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
  };
  shoes: {
    searchTerm: string;
    category: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
    priceRange: [number, number];
    stockFilter: 'all' | 'inStock' | 'lowStock' | 'outOfStock';
  };
  sales: {
    searchTerm: string;
    status: string;
    dateRange: string;
    customerId: string;
    shoeId: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
  };
  global: {
    dateRange: string;
    category: string;
    status: string;
    searchTerm: string;
  };
}

const initialState: FiltersState = {
  customers: {
    searchTerm: '',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
  },
  shoes: {
    searchTerm: '',
    category: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
    priceRange: [0, 1000],
    stockFilter: 'all',
  },
  sales: {
    searchTerm: '',
    status: 'all',
    dateRange: 'all',
    customerId: '',
    shoeId: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  },
  global: {
    dateRange: 'all',
    category: 'all',
    status: 'all',
    searchTerm: '',
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    updateCustomerFilters: (state, action: PayloadAction<Partial<FiltersState['customers']>>) => {
      state.customers = { ...state.customers, ...action.payload };
    },
    updateShoeFilters: (state, action: PayloadAction<Partial<FiltersState['shoes']>>) => {
      state.shoes = { ...state.shoes, ...action.payload };
    },
    updateSaleFilters: (state, action: PayloadAction<Partial<FiltersState['sales']>>) => {
      state.sales = { ...state.sales, ...action.payload };
    },
    updateGlobalFilters: (state, action: PayloadAction<Partial<FiltersState['global']>>) => {
      state.global = { ...state.global, ...action.payload };
    },
    resetCustomerFilters: (state) => {
      state.customers = initialState.customers;
    },
    resetShoeFilters: (state) => {
      state.shoes = initialState.shoes;
    },
    resetSaleFilters: (state) => {
      state.sales = initialState.sales;
    },
    resetGlobalFilters: (state) => {
      state.global = initialState.global;
    },
    resetAllFilters: () => initialState,
    setCustomerPage: (state, action: PayloadAction<number>) => {
      state.customers.page = action.payload;
    },
    setShoePage: (state, action: PayloadAction<number>) => {
      state.shoes.page = action.payload;
    },
    setSalePage: (state, action: PayloadAction<number>) => {
      state.sales.page = action.payload;
    },
  },
});

export const {
  updateCustomerFilters,
  updateShoeFilters,
  updateSaleFilters,
  updateGlobalFilters,
  resetCustomerFilters,
  resetShoeFilters,
  resetSaleFilters,
  resetGlobalFilters,
  resetAllFilters,
  setCustomerPage,
  setShoePage,
  setSalePage,
} = filtersSlice.actions;

export default filtersSlice.reducer;