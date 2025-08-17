import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/imageUploader';
import { Trash, Trash2, Check, X, ArrowLeft } from 'lucide-react';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const LensForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lens, setLens] = useState({
        name: '',
        type: '',
        price: '',
        image: '',
        description: '',
        ageGroups: [],
        powerLensMap: [],
        subtypeOf: null,
    });
    const [ageGroups, setAgeGroups] = useState([]);
    const [recommendedLenses, setRecommendedLenses] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lenses, setLenses] = useState([]); // for subtypeOf options

    useEffect(() => {
        axios.get(`${baseUrl}/api/age-groups`).then(res => setAgeGroups(res.data));
        axios.get(`${baseUrl}/api/recommended-lenses`).then(res => setRecommendedLenses(res.data));
        axios.get(`${baseUrl}/api/lenses`).then(res => setLenses(res.data));
    }, []);

    useEffect(() => {
        if (!id) return;
        axios.get(`${baseUrl}/api/lenses/${id}`).then(res => setLens({
            ...res.data,
            price: res.data.price ?? '',
            subtypeOf: res.data.subtypeOf || null,
        }));
    }, [id]);

    const validate = () => {
        const errs = {};
        const powerMapErrors = {};

        if (!lens.name) errs.name = 'Name is required';
        if (!lens.type) errs.type = 'Type is required';
        if (lens.price === '' || lens.price < 0) errs.price = 'Valid price is required';

        if (lens.powerLensMap.length < 1) {
            errs.powerLensMap = "At least 1 Power to Lens Mapping is required";
        } else {
            lens.powerLensMap.forEach((entry, index) => {
                if (!entry.recommendedLenses || entry.recommendedLenses.length < 1) {
                    powerMapErrors[index] = 'At least 1 Recommended Lens is required';
                }
            });
            if (Object.keys(powerMapErrors).length > 0) {
                errs.powerMapEntry = powerMapErrors;
            }
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubtypeChange = (e) => {
        const val = e.target.value;
        setLens(prev => ({
            ...prev,
            subtypeOf: val === '' ? null : val
        }));
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

    const toggleAgeGroup = (id) => {
        setLens(prev => {
            const setIds = new Set(prev.ageGroups);
            if (setIds.has(id)) setIds.delete(id);
            else setIds.add(id);
            return { ...prev, ageGroups: Array.from(setIds) };
        });
    };

    const handlePowerLensMapChange = (index, field, value) => {
        const updated = [...lens.powerLensMap];
        if (field === 'recommendedLenses') {
            updated[index][field] = Array.from(new Set(value));
        } else {
            updated[index][field] = field === 'min' || field === 'max' ? parseFloat(value) : value;
        }
        setLens(prev => ({ ...prev, powerLensMap: updated }));
    };

    const addPowerLensMap = () => {
        setLens(prev => ({
            ...prev,
            powerLensMap: [...prev.powerLensMap, { min: 0, max: 0, recommendedLenses: [] }]
        }));
    };

    const removePowerLensMap = (index) => {
        setLens(prev => {
            const updated = [...prev.powerLensMap];
            updated.splice(index, 1);
            return { ...prev, powerLensMap: updated };
        });
    };

    const toggleRecommendedLens = (index, lensId) => {
        const mapEntry = lens.powerLensMap[index];
        const updated = new Set(mapEntry.recommendedLenses);
        if (updated.has(lensId)) updated.delete(lensId);
        else updated.add(lensId);
        handlePowerLensMapChange(index, 'recommendedLenses', Array.from(updated));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setSubmitStatus(null);

        const payload = {
            ...lens,
            name: lens.name.trim(),
            type: lens.type.trim(),
            description: lens.description.trim(),
            subtypeOf: lens.subtypeOf || null,
        };

        try {
            const method = id ? 'put' : 'post';
            const url = id ? `${baseUrl}/api/lenses/${id}` : `${baseUrl}/api/lenses`;

            await axios[method](url, payload);
            setSubmitStatus('Lens saved successfully');
            if (!id) {
                setLens({
                    name: '',
                    type: '',
                    price: '',
                    image: '',
                    description: '',
                    ageGroups: [],
                    powerLensMap: [],
                    subtypeOf: null,
                });
            }
            navigate('/lenses');
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setSubmitStatus(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/lenses');
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">

            <div className="border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-medium text-gray-900">
                        {id ? 'Edit Lens' : 'Create New Lens'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                        {id ? 'Modify the existing lens details' : 'Fill in the details to create a new lens'}
                        </p>
                    </div>
                    <a
                        href="/lenses"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Lens
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
                            value={lens.name}
                            onChange={handleChange}
                            placeholder="Lens name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="type"
                            value={lens.type}
                            onChange={handleChange}
                            placeholder="Lens type"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                            required
                        />
                        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
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
                                value={lens.price}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subtype Of
                        </label>
                        <select
                            name="subtypeOf"
                            value={lens.subtypeOf || ''}
                            onChange={handleSubtypeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        >
                            <option value="">-- None --</option>
                            {lenses.filter(l => !id || l._id !== id).map(l => (
                                <option key={l._id} value={l._id}>{l.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Age Groups
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {ageGroups.map(a => {
                                const selected = lens.ageGroups.includes(a._id);
                                return (
                                    <button
                                        key={a._id}
                                        type="button"
                                        onClick={() => toggleAgeGroup(a._id)}
                                        className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                                            selected 
                                                ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {a.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={lens.description}
                            onChange={handleChange}
                            placeholder="Brief description of the lens"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: Provide additional details about this lens</p>
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image
                        </label>
                        
                        {/* Show preview of current image */}
                        {lens.image && (
                            <div className="mb-4 bg-gray-50 rounded-lg p-4">
                                <div className="relative inline-block">
                                    <img
                                        src={lens.image}
                                        alt="Preview"
                                        className="max-w-full h-auto max-h-64 rounded-md shadow-sm border border-gray-200"
                                    />
                                </div>
                            </div>
                        )}

                        <ImageUploader onUpload={handleImageUpload} initialImage={lens.image} />
                        {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        Power Lens Map <span className="text-red-500">*</span>
                    </label>
                    {errors.powerLensMap && <p className="text-red-500 text-sm mb-4">{errors.powerLensMap}</p>}

                    {lens.powerLensMap.map((entry, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50 shadow-sm relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Min Power</label>
                                    <input
                                        type="number"
                                        value={entry.min}
                                        onChange={(e) => handlePowerLensMapChange(index, 'min', e.target.value)}
                                        placeholder="Min"
                                        step={0.25}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">Max Power</label>
                                    <input
                                        type="number"
                                        value={entry.max}
                                        onChange={(e) => handlePowerLensMapChange(index, 'max', e.target.value)}
                                        placeholder="Max"
                                        step={0.25}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Recommended Lenses</label>
                                <div className="flex flex-wrap gap-2">
                                    {recommendedLenses.map(r => {
                                        const selected = entry.recommendedLenses.includes(r._id)
                                        return (
                                            <button
                                                key={r._id}
                                                type="button"
                                                onClick={() => toggleRecommendedLens(index, r._id)}
                                                className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                                                    selected 
                                                        ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {r.name} - {r.code} - £{r.price}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.powerMapEntry && errors.powerMapEntry[index] && (
                                    <p className="text-red-500 text-sm mt-2">{errors.powerMapEntry[index]}</p>
                                )}
                            </div>

                            {/* Remove button moved to bottom right, absolute positioning */}
                            <div className="absolute bottom-4 right-4">
                                <button
                                    type="button"
                                    onClick={() => removePowerLensMap(index)}
                                    className="text-red-500 text-sm font-medium hover:text-red-600 flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 size={16} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add button moved to bottom right of the section */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={addPowerLensMap}
                            className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                        >
                            + Add Power Lens Map
                        </button>
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
                        {id ? 'Update' : 'Create'} Lens
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

export default LensForm;
