import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUploader from '../../components/imageUploader';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const CoatingForm = ({ onCoatingSaved, initialCoating = null }) => {
  const [coating, setCoating] = useState({ name: '', image: '', price: '' });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (initialCoating) setCoating(initialCoating);
  }, [initialCoating]);

  const validate = () => {
    const errs = {};
    if (!coating.name) errs.name = 'Name is required';
    if (coating.price === '' || coating.price < 0) errs.price = 'Valid price is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoating((prev) => ({ ...prev, [name]: name === "price" ? parseFloat(value) || '' : value }));
  };

  const handleImageUpload = (url) => {
        setCoating(prev => ({ ...prev, image: url }));
        setErrors(prev => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const url = initialCoating
        ? `${baseUrl}/api/coatings/${initialCoating._id}`
        : `${baseUrl}/api/coatings`;
      const method = initialCoating ? 'put' : 'post';

      await axios[method](url, coating);
      setSubmitStatus('Coating saved successfully');
      setCoating({ name: '', image: '', price: '' });
      onCoatingSaved();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setSubmitStatus(`Error: ${msg}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-6 bg-white text-black shadow-md rounded-xl space-y-6"
    >
      <div>
        <label className="block mb-1 font-medium">Coating Name</label>
        <input
          type="text"
          name="name"
          value={coating.name}
          onChange={handleChange}
          placeholder="e.g. Anti-Glare"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

            <div>
                <label className="block mb-1">Image</label>
                {coating.image && <img src={coating.image} alt="Coating" className="max-h-48 mb-4" />}
                <ImageUploader onUpload={handleImageUpload} initialImage={coating.image} />
            </div>

      <div>
        <label className="block mb-1 font-medium">Price</label>
        <input
          type="number"
          name="price"
          value={coating.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="e.g. 199.99"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {initialCoating ? 'Update Coating' : 'Save Coating'}
      </button>

      {submitStatus && (
        <div className="text-center text-sm mt-2 text-gray-700">{submitStatus}</div>
      )}
    </form>
  );
};

export default CoatingForm;
