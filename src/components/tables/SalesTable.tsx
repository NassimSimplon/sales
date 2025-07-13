import React from "react";
import { Calendar, DollarSign, Package } from "lucide-react";
import { useDashboard } from "../../contexts/DashboardContext";
import { Badge } from "../common/Badge";
import { Card } from "../common/Card";

export function SalesTable() {
  const { filteredSales, state } = useDashboard();
  const { data } = state;

  const getCustomerName = (customerId: string) => {
    const customer = data.customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getShoeName = (shoeId: string) => {
    const shoe = data.shoes.find(s => s.id === shoeId);
    if (!shoe) return 'Unknown Product';
    
    // Combine brand and model to create a display name
    const brand = shoe.brand || '';
    const model = shoe.model || '';
    
    if (brand && model) {
      return `${brand} ${model}`;
    } else if (brand) {
      return brand;
    } else if (model) {
      return model;
    } else {
      return 'Unknown Product';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
        <span className="text-sm text-gray-500">{filteredSales.length} transactions</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Sale ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Total Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Profit</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-mono text-sm text-gray-600">#{sale.id}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="font-medium text-gray-900">{getCustomerName(sale.customerId)}</span>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{getShoeName(sale.shoeId)}</p>
                    <p className="text-sm text-gray-500">Size {sale.size}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-1" />
                    {sale.quantity}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-lg font-semibold text-gray-900">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {sale.totalAmount.toFixed(2)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-lg font-semibold text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {sale.profit.toFixed(2)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(sale.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={
                    sale.status === 'completed' ? 'success' :
                    sale.status === 'pending' ? 'warning' : 'error'
                  }>
                    {sale.status}
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