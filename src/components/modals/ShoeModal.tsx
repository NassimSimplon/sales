import React, { useState, useEffect } from 'react';
import { useCreateShoeMutation, useUpdateShoeMutation } from '../../store/api/apiSlice';
import { Button } from '../common/Button';
import { X } from 'lucide-react';

interface ShoeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoe?: any;
  mode: 'create' | 'edit';
}

export function ShoeModal({ isOpen, onClose, shoe, mode }: ShoeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'casual' as 'running' | 'casual' | 'formal' | 'sports',
    price: 0,
    cost: 0,
    stock: 0,
    image: '',
    sizes: [] as number[],
  });

  const [createShoe, { isLoading: isCreating }] = useCreateShoeMutation();
  const [updateShoe, { isLoading: isUpdating }] = useUpdateShoeMutation();

  useEffect(() => {
    if (shoe && mode === 'edit') {
      setFormData({
        name: shoe.name,
        brand: shoe.brand,
        category: shoe.category,
        price: shoe.price,
        cost: shoe.cost,
        stock: shoe.stock,
        image: shoe.image,
        sizes: shoe.sizes,
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        category: 'casual',
        price: 0,
        cost: 0,
        stock: 0,
        image: '',
        sizes: [],
      });
    }
  }, [shoe, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'create') {
        await createShoe(formData).unwrap();
      } else {
        await updateShoe({ id: shoe.id, ...formData }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save shoe:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSizesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sizes = e.target.value.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s));
    setFormData(prev => ({ ...prev, sizes }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Add New Product' : 'Edit Product'}
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
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="casual">Casual</option>
              <option value="running">Running</option>
              <option value="formal">Formal</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost ($)
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Sizes (comma-separated)
            </label>
            <input
              type="text"
              value={formData.sizes.join(', ')}
              onChange={handleSizesChange}
              placeholder="6, 7, 8, 9, 10, 11, 12"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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
            >
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}