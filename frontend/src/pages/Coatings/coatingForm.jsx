import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import ImageUploader from '../../components/imageUploader';
import axiosInstance from '../../../api/axios';


const CoatingForm = ({ onCoatingSaved, initialCoating = null, onCancel }) => {
  const [coating, setCoating] = useState({ name: '', image: '', price: 0 });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log({initialCoating})
    if (initialCoating) setCoating(initialCoating);
  }, [initialCoating]);

  const validate = () => {
    const errs = {};
    if (!coating.name) errs.name = 'Coating name is required';
    if (coating.price < 0 || isNaN(coating.price)) errs.price = 'Valid price is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoating((prev) => ({ ...prev, [name]: name === "price" ? parseFloat(value) || 0 : value }));
  };

  const handleImageUpload = (url) => {
    setCoating(prev => ({ ...prev, image: url }));
    setErrors(prev => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = initialCoating
        ? `/api/coatings/${initialCoating._id}`
        : `/api/coatings`;
      const method = initialCoating ? 'put' : 'post';

      await axiosInstance[method](url, coating);
      setSubmitStatus('Coating saved successfully');
      setCoating({ name: '', image: '', price: '' });
      onCoatingSaved();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setSubmitStatus(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCoating({ name: '', image: '', price: '' });
    setErrors({});
    setSubmitStatus(null);
    onCancel()
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-medium text-gray-900">
          {initialCoating ? 'Edit Coating' : 'Create New Coating'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {initialCoating ? 'Modify the existing coating details' : 'Fill in the details to create a new coating'}
        </p>
      </div>

      {submitStatus && (
        <div className={`mb-6 p-4 rounded-md border-l-4 ${
          submitStatus.includes('Error') 
            ? 'bg-red-50 border-red-400 text-red-700'
            : 'bg-green-50 border-green-400 text-green-700'
        }`}>
          <p className="text-sm">{submitStatus}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coating Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={coating.name}
              onChange={handleChange}
              placeholder="e.g. Anti-Glare"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={coating.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g. 199.99"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              required
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          {coating.image && (
            <div className="mb-4">
              <img src={coating.image} alt="Coating" className="max-h-48 rounded-md border border-gray-200" />
            </div>
          )}
          <ImageUploader onUpload={handleImageUpload} initialImage={coating.image} />
        </div>

        <div className="pt-6 border-t border-gray-100 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Check className="w-4 h-4" />
            )}
            {initialCoating ? 'Update' : 'Create'} Coating
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center gap-2 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoatingForm;
