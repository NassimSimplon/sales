import React from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Package, DollarSign, TrendingUp } from 'lucide-react';

export function InventoryTable() {
  const { shoes } = useFilteredData();

  const getStockStatus = (stock: number) => {
    if (stock > 30) return { variant: 'success' as const, label: 'In Stock' };
    if (stock > 10) return { variant: 'warning' as const, label: 'Low Stock' };
    return { variant: 'error' as const, label: 'Critical' };
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
        <span className="text-sm text-gray-500">{shoes.length} products</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Cost</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Profit Margin</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {shoes.map((shoe) => {
              const profitMargin = ((shoe.price - shoe.cost) / shoe.price) * 100;
              const stockStatus = getStockStatus(shoe.stock);
              
              return (
                <tr key={shoe.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img
                        src={shoe.image}
                        alt={shoe.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{shoe.name}</p>
                        <p className="text-sm text-gray-500">{shoe.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="info">
                      {shoe.category}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-lg font-semibold text-gray-900">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {shoe.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {shoe.cost.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {profitMargin.toFixed(1)}%
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-sm font-medium">
                      <Package className="w-4 h-4 mr-2 text-gray-400" />
                      {shoe.stock} units
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={stockStatus.variant}>
                      {stockStatus.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}