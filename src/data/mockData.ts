import { DashboardData } from '../types';

export const mockData: DashboardData = {
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
      phone: "+1 (555) 234-5678",
      totalSpent: 1250.00,
      lastPurchase: "2024-12-14",
      status: "active",
      location: "Los Angeles, CA"
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "+1 (555) 345-6789",
      totalSpent: 320.00,
      lastPurchase: "2024-11-28",
      status: "inactive",
      location: "Chicago, IL"
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 456-7890",
      totalSpent: 890.00,
      lastPurchase: "2024-12-10",
      status: "active",
      location: "Houston, TX"
    },
    {
      id: "5",
      name: "Robert Brown",
      email: "robert.brown@email.com",
      phone: "+1 (555) 567-8901",
      totalSpent: 675.50,
      lastPurchase: "2024-12-12",
      status: "active",
      location: "Phoenix, AZ"
    },
    {
      id: "6",
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      phone: "+1 (555) 678-9012",
      totalSpent: 1100.25,
      lastPurchase: "2024-12-11",
      status: "active",
      location: "Philadelphia, PA"
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
      name: "Classic Comfort",
      brand: "WalkEasy",
      category: "casual",
      price: 89.99,
      cost: 45.00,
      stock: 12,
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
      sizes: [6, 7, 8, 9, 10, 11]
    },
    {
      id: "3",
      name: "Executive Elite",
      brand: "BusinessStep",
      category: "formal",
      price: 199.99,
      cost: 100.00,
      stock: 28,
      image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
      sizes: [7, 8, 9, 10, 11, 12, 13]
    },
    {
      id: "4",
      name: "Sport Master",
      brand: "AthleteGear",
      category: "sports",
      price: 159.99,
      cost: 80.00,
      stock: 8,
      image: "https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg",
      sizes: [6, 7, 8, 9, 10, 11, 12]
    },
    {
      id: "5",
      name: "Urban Walker",
      brand: "CityStep",
      category: "casual",
      price: 79.99,
      cost: 40.00,
      stock: 35,
      image: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg",
      sizes: [6, 7, 8, 9, 10, 11]
    },
    {
      id: "6",
      name: "Marathon Elite",
      brand: "SoleMax",
      category: "running",
      price: 179.99,
      cost: 90.00,
      stock: 22,
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
      sizes: [7, 8, 9, 10, 11, 12, 13]
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
      date: "2024-12-14",
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
      date: "2024-12-10",
      status: "completed"
    },
    {
      id: "4",
      customerId: "3",
      shoeId: "4",
      quantity: 1,
      size: 11,
      totalAmount: 159.99,
      profit: 79.99,
      date: "2024-11-28",
      status: "completed"
    },
    {
      id: "5",
      customerId: "2",
      shoeId: "1",
      quantity: 4,
      size: 9,
      totalAmount: 519.96,
      profit: 259.96,
      date: "2024-12-12",
      status: "completed"
    },
    {
      id: "6",
      customerId: "5",
      shoeId: "5",
      quantity: 2,
      size: 10,
      totalAmount: 159.98,
      profit: 79.98,
      date: "2024-12-13",
      status: "completed"
    },
    {
      id: "7",
      customerId: "6",
      shoeId: "6",
      quantity: 1,
      size: 9,
      totalAmount: 179.99,
      profit: 89.99,
      date: "2024-12-11",
      status: "pending"
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
      sales: 92,
      customers: 48
    },
    {
      month: "March 2024",
      revenue: 13800,
      profit: 6900,
      sales: 88,
      customers: 45
    },
    {
      month: "April 2024",
      revenue: 15600,
      profit: 7800,
      sales: 98,
      customers: 52
    },
    {
      month: "May 2024",
      revenue: 16900,
      profit: 8450,
      sales: 105,
      customers: 58
    },
    {
      month: "June 2024",
      revenue: 18200,
      profit: 9100,
      sales: 112,
      customers: 62
    },
    {
      month: "July 2024",
      revenue: 19500,
      profit: 9750,
      sales: 118,
      customers: 65
    },
    {
      month: "August 2024",
      revenue: 17800,
      profit: 8900,
      sales: 108,
      customers: 59
    },
    {
      month: "September 2024",
      revenue: 16200,
      profit: 8100,
      sales: 95,
      customers: 54
    },
    {
      month: "October 2024",
      revenue: 18900,
      profit: 9450,
      sales: 115,
      customers: 63
    },
    {
      month: "November 2024",
      revenue: 20100,
      profit: 10050,
      sales: 122,
      customers: 68
    },
    {
      month: "December 2024",
      revenue: 21500,
      profit: 10750,
      sales: 128,
      customers: 72
    }
  ]
};

// Function to simulate real-time data updates
export const generateRandomUpdate = (data: DashboardData): DashboardData => {
  const updatedData = JSON.parse(JSON.stringify(data)); // Deep clone
  
  // Update monthly stats with small random variations
  updatedData.monthlyStats = updatedData.monthlyStats.map((stat:any) => ({
    ...stat,
    revenue: Math.max(0, stat.revenue + Math.floor(Math.random() * 200 - 100)),
    profit: Math.max(0, stat.profit + Math.floor(Math.random() * 100 - 50)),
    sales: Math.max(0, stat.sales + Math.floor(Math.random() * 10 - 5)),
    customers: Math.max(0, stat.customers + Math.floor(Math.random() * 6 - 3))
  }));

  // Randomly update customer spending
  updatedData.customers = updatedData.customers.map((customer:any) => ({
    ...customer,
    totalSpent: Math.max(0, customer.totalSpent + Math.floor(Math.random() * 50 - 25))
  }));

  // Randomly update stock levels
  updatedData.shoes = updatedData.shoes.map((shoe) => ({
    ...shoe,
    stock: Math.max(0, shoe.stock + Math.floor(Math.random() * 6 - 3))
  }));

  return updatedData;
}; 