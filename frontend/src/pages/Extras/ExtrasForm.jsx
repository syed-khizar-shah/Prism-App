import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Check, X } from "lucide-react";
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/imageUploader';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const ExtrasForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [extra, setExtra] = useState({
        name: '',
        image: '',
        description: '',
        price: '',
    });
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (!id) return;
        axios.get(`${baseUrl}/api/extras/${id}`)
            .then(res => {
                const data = res.data;
                setExtra({
                    ...data,
                });
                setErrors({});
                setSubmitStatus(null);
            })
            .catch(() => {
                setExtra({
                    name: '',
                    image: '',
                    description: '',
                    price: '',
                });
            });
    }, [id]);

    const validate = () => {
        const errs = {};
        if (!extra.name) errs.name = 'Name is required';
        if (extra.price === '' || extra.price < 0) errs.price = 'Valid price is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExtra(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || '' : value
        }));
    };

    const handleImageUpload = (url) => {
        setExtra((prev) => ({ ...prev, image: url }))
        setErrors((prev) => ({ ...prev, image: undefined }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setSubmitStatus(null);

        // Trim strings
        const payload = {
            ...extra,
            name: extra.name.trim(),
            description: extra.description.trim(),
        };

        try {
            const method = id ? 'put' : 'post';
            const url = id ? `${baseUrl}/api/extras/${id}` : `${baseUrl}/api/extras`;

            await axios[method](url, payload);
            setSubmitStatus('Extra saved successfully');
            if (!id) {
                setExtra({ name: '', image: '', description: '', price: '' });
            }
            navigate('/extras');
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            setSubmitStatus(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/extras');
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
            <div className="border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-medium text-gray-900">
                            {id ? 'Edit Extra' : 'Create New Extra'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                        {id ? 'Modify the existing extra details' : 'Fill in the details to create a new extra'}
                        </p>
                    </div>
                    <a
                        href="/extras"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Extras
                    </a>
                </div>
            </div>
            
            {submitStatus && (
                <div className={`px-4 py-3 mb-6 rounded-md border-l-4 ${
                    submitStatus.startsWith('Error') 
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
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={extra.name}
                            onChange={handleChange}
                            placeholder="Extra name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">£</span>
                            <input
                                type="number"
                                name="price"
                                value={extra.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="e.g. 99.99"
                                className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                                required
                            />
                        </div>
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={extra.description}
                            onChange={handleChange}
                            placeholder="Brief description of the extra"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: Provide additional details about this extra</p>
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image
                        </label>
                        
                        {/* Show preview of current image */}
                        {extra.image && (
                            <div className="mb-4 bg-gray-50 rounded-lg p-4">
                                <div className="relative inline-block">
                                    <img
                                        src={extra.image}
                                        alt="Preview"
                                        className="max-w-full h-auto max-h-64 rounded-md shadow-sm border border-gray-200"
                                    />
                                </div>
                            </div>
                        )}

                        <ImageUploader onUpload={handleImageUpload} initialImage={extra.image} />
                        {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                    </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100">
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
                        {id ? 'Update' : 'Create'} Extra
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

export default ExtrasForm;
