import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/imageUploader';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const RecommendedLensForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lens, setLens] = useState({
        code: '',
        name: '',
        description: '',
        image: '',
        price: ''
    });

    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        if (!id) return;
        axios.get(`${baseUrl}/api/recommended-lenses/${id}`)
            .then(res => {
                setLens({ ...res.data });
                setErrors({});
                setSubmitStatus(null);
            })
            .catch(() => {
                setLens({ code: '', name: '', description: '', image: '', price: '' });
            });
    }, [id]);

    const validate = () => {
        const errs = {};
        if (!lens.code) errs.code = 'Code is required';
        if (!lens.name) errs.name = 'Name is required';
        if (lens.price === '' || lens.price < 0) errs.price = 'Valid price is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLens(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || '' : value
        }));
    };

    const handleImageUpload = (url) => {
        setLens(prev => ({ ...prev, image: url }));
        setErrors(prev => ({ ...prev, image: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...lens,
            name: lens.name.trim(),
            code: lens.code.trim(),
            description: lens.description.trim(),
        };


        try {
            const method = id ? 'put' : 'post';
            const url = id ? `${baseUrl}/api/recommended-lenses/${id}` : `${baseUrl}/api/recommended-lenses`;

            await axios[method](url, payload);
            setSubmitStatus('Lens saved successfully');
            if (!id) {
                setLens({ code: '', name: '', description: '', image: '', price: '' });
            }
            navigate('/recommended-lenses');
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
                <label className="block mb-1 font-medium">
                    Code <span className="text-sm text-gray-500">(must be unique)</span>
                </label>
                <p className="text-xs text-gray-500 mb-1">
                    This unique code helps distinguish between recommended lenses that may have the same name but differ in type or price.
                </p>
                <input
                    type="text"
                    name="code"
                    value={lens.code}
                    onChange={handleChange}
                    placeholder="e.g. RL123"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>


            <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                    type="text"
                    name="name"
                    value={lens.name}
                    onChange={handleChange}
                    placeholder="Lens name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">Description (optional)</label>
                <textarea
                    name="description"
                    value={lens.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">Image</label>
                {lens.image && (
                    <div className="my-4">
                        <img
                            src={lens.image}
                            alt="Preview"
                            className="max-w-full h-auto max-h-96 rounded-md border"
                        />
                    </div>
                )}
                <ImageUploader onUpload={handleImageUpload} initialImage={lens.image} />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">Price</label>
                <input
                    type="number"
                    name="price"
                    value={lens.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 199.99"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
                Save Lens
            </button>

            {submitStatus && (
                <div className="text-center text-sm mt-2 text-gray-700">{submitStatus}</div>
            )}
        </form>
    );
};

export default RecommendedLensForm;
