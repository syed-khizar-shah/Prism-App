import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const ColorForm = ({ initialData, onColorSaved, onCancel }) => {
  const [color, setColor] = useState({ name: '', code: '' });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setColor(initialData);
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!color.name) errs.name = 'Color name is required';
    if (!color.code) errs.code = 'Color code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setColor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const method = color._id ? 'put' : 'post';
      const url = color._id
        ? `${baseUrl}/api/colors/${color._id}`
        : `${baseUrl}/api/colors`;

      await axios[method](url, color);
      setSubmitStatus('Color saved successfully');
      setColor({ name: '', code: '' });
      onColorSaved();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setSubmitStatus(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setColor({ name: '', code: '' });
    setErrors({});
    setSubmitStatus(null);
    onCancel()
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-medium text-gray-900">
          {color._id ? 'Edit Color' : 'Create New Color'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {color._id ? 'Modify the existing color details' : 'Fill in the details to create a new color'}
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
              Color Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={color.name}
              onChange={handleChange}
              placeholder="e.g. Sky Blue"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Code <span className="text-red-500">*</span>
            </label>
            <div className='space-y-2'>
              <input
                type="color"
                name="code"
                value={color.code}
                onChange={handleChange}
                className="w-26 h-10 p-1 border border-gray-300 rounded cursor-pointer"
              />
              <div className="text-sm text-gray-500 font-mono">{color.code || '#000000'}</div>
            </div>
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>
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
            {color._id ? 'Update' : 'Create'} Color
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

export default ColorForm;
