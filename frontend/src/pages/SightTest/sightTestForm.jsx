import React, { useState, useEffect } from 'react';
import { Check, X, Plus, Trash2 } from 'lucide-react';
import axiosInstance from '../../../api/axios';

const SightTestForm = ({ initialData, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    category: '',
    isActive: true,
    options: [{ name: '', price: 0 }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleAddOption = () => {
    setFormData({ ...formData, options: [...formData.options, { name: '', price: 0 }] });
  };

  const handleRemoveOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData._id) {
        await axiosInstance.put(`/api/sight-tests/${formData._id}`, formData);
      } else {
        await axiosInstance.post(`/api/sight-tests`, formData);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving sight test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 shadow-sm">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-medium text-gray-900">{formData._id ? 'Edit Category' : 'New Category'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name (e.g. NHS)</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-gray-400 focus:border-gray-400"
              placeholder="Private"
              required
            />
          </div>
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 font-medium cursor-pointer">Category Active</label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Pricing Tiers</h3>
            <button type="button" onClick={handleAddOption} className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium">
              <Plus className="w-3 h-3" /> Add Tier
            </button>
          </div>

          {formData.options.map((opt, index) => (
            <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-md border border-gray-100">
              <div className="flex-1">
                <input
                  placeholder="Tier Name (e.g. Ultimate)"
                  value={opt.name}
                  onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-1"
                  required
                />
              </div>
              <div className="w-32">
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 text-sm">£</span>
                  <input
                    type="number"
                    value={opt.price}
                    onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => handleRemoveOption(index)}
                disabled={formData.options.length === 1}
                className="text-gray-400 hover:text-red-500 mt-2 disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100 flex gap-3">
          <button type="submit" disabled={loading} className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Check className="w-4 h-4" />}
            {formData._id ? 'Update Category' : 'Create Category'}
          </button>
          <button type="button" onClick={onCancel} className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SightTestForm;