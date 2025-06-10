import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check } from "lucide-react";
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
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto p-6 bg-white text-black shadow-md rounded-xl space-y-6"
        >
            <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                    type="text"
                    name="name"
                    value={extra.name}
                    onChange={handleChange}
                    placeholder="Extra name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block mb-2 font-semibold text-gray-700">Image</label>
                {/* Show preview of current image */}
                {extra.image && (
                    <div className="my-6 bg-white overflow-hidden">
                        <div className="p-4">
                            <div className="relative inline-block">
                                <img
                                    src={extra.image}
                                    alt="Preview"
                                    className="max-w-full h-auto max-h-96 rounded-md shadow-sm border border-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <ImageUploader onUpload={handleImageUpload} initialImage={extra.image} />
                {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">Description (optional)</label>
                <textarea
                    name="description"
                    value={extra.description}
                    onChange={handleChange}
                    placeholder="Brief description"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Price</label>
                <input
                    type="number"
                    name="price"
                    value={extra.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 99.99"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
                Save Extra
            </button>

            {submitStatus && (
                <div className="text-center text-sm mt-2 text-gray-700">{submitStatus}</div>
            )}
        </form>
    );
};

export default ExtrasForm;
