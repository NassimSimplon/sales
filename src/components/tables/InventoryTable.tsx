import React from 'react';
import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectShoeFilters, selectGlobalFilters } from '../../store/selectors';
import { useGetShoesQuery, useDeleteShoeMutation } from '../../store/api/apiSlice';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Package, DollarSign, TrendingUp, Edit, Trash2, Plus } from 'lucide-react';
import { ShoeModal } from '../modals/ShoeModal';

export function InventoryTable() {
  const filters = useAppSelector(selectShoeFilters);
  const globalFilters = useAppSelector(selectGlobalFilters);
  const [selectedShoe, setSelectedShoe] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const { data: shoes = [], isLoading, error } = useGetShoesQuery({
    ...filters,
    searchTerm: globalFilters.searchTerm || filters.searchTerm,
    category: globalFilters.category !== 'all' ? globalFilters.category : filters.category,
  });
  
  const [deleteShoe, { isLoading: isDeleting }] = useDeleteShoeMutation();

  const getStockStatus = (stock: number) => {
    if (stock > 30) return { variant: 'success' as const, label: 'In Stock' };
    if (stock > 10) return { variant: 'warning' as const, label: 'Low Stock' };
    return { variant: 'error' as const, label: 'Critical' };
  };

  const handleEdit = (shoe: any) => {
    setSelectedShoe(shoe);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedShoe(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleDelete = async (shoeId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteShoe(shoeId).unwrap();
      } catch (error) {
        console.error('Failed to delete shoe:', error);
      }
    }
  };
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading inventory</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{shoes.length} products</span>
          <Button onClick={handleCreate} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
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
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
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
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(shoe)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(shoe.id)}
                        loading={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <ShoeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shoe={selectedShoe}
        mode={modalMode}
      />
    </Card>
  );
}