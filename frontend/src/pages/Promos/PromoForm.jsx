import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

const PromoForm = ({ promo, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true,
    ...promo
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (promo) {
      const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
      };

      setFormData({
        ...promo,
        startDate: formatDate(promo.startDate),
        endDate: formatDate(promo.endDate),
        usageLimit: promo.usageLimit || ''
      });
    }
  }, [promo]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        code: formData.code.trim().toUpperCase(),
        discountValue: Number(formData.discountValue),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
      };

      await onSubmit(submitData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-medium text-gray-900">
          {isEdit ? 'Edit Promo Code' : 'Create New Promo Code'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isEdit ? 'Modify the existing promo code details' : 'Fill in the details to create a new promotional offer'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 mb-6">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Promo Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g., SAVE20"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the offer"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Type <span className="text-red-500">*</span>
          </label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            required
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (£)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Value <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            {formData.discountType === 'fixed' && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">£</span>
            )}
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              min="0"
              step={formData.discountType === 'percentage' ? '1' : '0.01'}
              placeholder={formData.discountType === 'percentage' ? '20' : '10.00'}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors ${formData.discountType === 'fixed' ? 'pl-7' : ''}`}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usage Limit
          </label>
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleChange}
            min="1"
            placeholder="Leave empty for unlimited"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">Optional: Set maximum number of uses</p>
        </div>

        <div className="flex items-center pt-4">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
          <p className="text-xs text-gray-500 ml-1">
            (Inactive promos won't be available for use)
          </p>
        </div>

        <div className="lg:col-span-2 flex gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Check className="w-4 h-4" />
            )}
            {isEdit ? 'Update' : 'Create'} Promo
          </button>
          
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center gap-2 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoForm;