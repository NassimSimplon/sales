import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectCustomerFilters } from '../../store/selectors';
import { useGetCustomersQuery } from '../../store/api/apiSlice';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Mail, Phone, MapPin, DollarSign } from 'lucide-react';

export function CustomersTable() {
  const filters = useAppSelector(selectCustomerFilters);
  const { data: customers = [], isLoading, error } = useGetCustomersQuery(filters);

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading customers...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading customers</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
        <span className="text-sm text-gray-500">{customers.length} customers</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Total Spent</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Last Purchase</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">ID: {customer.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {customer.location}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-lg font-semibold text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {customer.totalSpent.toFixed(2)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600">
                    {new Date(customer.lastPurchase).toLocaleDateString()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={customer.status === 'active' ? 'success' : 'warning'}>
                    {customer.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}