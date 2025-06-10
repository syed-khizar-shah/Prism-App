import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const ColorForm = ({ initialData, onColorSaved }) => {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 bg-white text-black shadow-md rounded-xl space-y-4"
    >
      <div>
        <label className="block mb-1 font-medium">Color Name</label>
        <input
          type="text"
          name="name"
          value={color.name}
          onChange={handleChange}
          placeholder="e.g. Sky Blue"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Color Code</label>
        <input
          type="color"
          name="code"
          value={color.code}
          onChange={handleChange}
          className="w-16 h-10 p-1 border border-gray-300 rounded"
        />
        {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center py-2 rounded-md transition ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
      >
        <span className="h-5 w-24 flex items-center justify-center">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Save Color'
          )}
        </span>
      </button>



      {submitStatus && (
        <div className="text-center text-sm mt-2 text-gray-700">{submitStatus}</div>
      )}
    </form>
  );
};

export default ColorForm;
