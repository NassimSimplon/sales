import React, { useState, useEffect } from 'react';
import { useCreateSaleMutation, useUpdateSaleMutation, useGetDashboardDataQuery } from '../../store/api/apiSlice';
import { Button } from '../common/Button';
import { X } from 'lucide-react';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale?: any;
  mode: 'create' | 'edit';
}

export function SaleModal({ isOpen, onClose, sale, mode }: SaleModalProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    shoeId: '',
    quantity: 1,
    size: 8,
  });

  const { data } = useGetDashboardDataQuery();
  const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();
  const [updateSale, { isLoading: isUpdating }] = useUpdateSaleMutation();

  useEffect(() => {
    if (sale && mode === 'edit') {
      setFormData({
        customerId: sale.customerId,
        shoeId: sale.shoeId,
        quantity: sale.quantity,
        size: sale.size,
      });
    } else {
      setFormData({
        customerId: '',
        shoeId: '',
        quantity: 1,
        size: 8,
      });
    }
  }, [sale, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'create') {
        await createSale(formData).unwrap();
      } else {
        await updateSale({ id: sale.id, ...formData }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save sale:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const selectedShoe = data?.shoes.find(s => s.id === formData.shoeId);
  const totalAmount = selectedShoe ? selectedShoe.price * formData.quantity : 0;
  const profit = selectedShoe ? (selectedShoe.price - selectedShoe.cost) * formData.quantity : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'New Sale' : 'Edit Sale'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a customer</option>
              {data?.customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              name="shoeId"
              value={formData.shoeId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a product</option>
              {data?.shoes.map(shoe => (
                <option key={shoe.id} value={shoe.id}>
                  {shoe.name} - ${shoe.price}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                max={selectedShoe?.stock || 999}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {selectedShoe?.sizes.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                )) || <option value={8}>8</option>}
              </select>
            </div>
          </div>

          {selectedShoe && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Sale Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span>${selectedShoe.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{formData.quantity}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Profit:</span>
                  <span>${profit.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isCreating || isUpdating}
              className="flex-1"
              disabled={!formData.customerId || !formData.shoeId}
            >
              {mode === 'create' ? 'Create Sale' : 'Update Sale'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}