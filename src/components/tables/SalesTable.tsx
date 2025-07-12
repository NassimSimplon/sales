import React from 'react';
import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectSaleFilters, selectGlobalFilters } from '../../store/selectors';
import { useGetSalesQuery, useGetDashboardDataQuery, useDeleteSaleMutation } from '../../store/api/apiSlice';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { DollarSign, Calendar, Package, Edit, Trash2, Plus } from 'lucide-react';
import { SaleModal } from '../modals/SaleModal';

export function SalesTable() {
  const filters = useAppSelector(selectSaleFilters);
  const globalFilters = useAppSelector(selectGlobalFilters);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const { data: sales = [], isLoading: salesLoading, error: salesError } = useGetSalesQuery({
    ...filters,
    dateRange: globalFilters.dateRange !== 'all' ? globalFilters.dateRange : filters.dateRange,
  });
  const { data } = useGetDashboardDataQuery();
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();

  const getCustomerName = (customerId: string) => {
    const customer = data?.customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getShoeName = (shoeId: string) => {
    const shoe = data?.shoes.find(s => s.id === shoeId);
    return shoe?.name || 'Unknown Product';
  };

  const handleEdit = (sale: any) => {
    setSelectedSale(sale);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSale(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleDelete = async (saleId: string) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await deleteSale(saleId).unwrap();
      } catch (error) {
        console.error('Failed to delete sale:', error);
      }
    }
  };
  if (salesLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sales...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (salesError) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading sales</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{sales.length} transactions</span>
          <Button onClick={handleCreate} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Sale
          </Button>
        </div>
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
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
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
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(sale)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sale.id)}
                      loading={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <SaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sale={selectedSale}
        mode={modalMode}
      />
    </Card>
  );
}