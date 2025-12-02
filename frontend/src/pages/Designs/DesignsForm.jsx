import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/imageUploader';
import { Check, Eye, EyeOff, Plus, X, ArrowLeft } from 'lucide-react';
import axiosInstance from '../../../api/axios';


const DesignForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [design, setDesign] = useState({
        name: '',
        image: '',
        description: '',
        price: 0,
        isVisible: true,
        lensType: '', // Changed to single selection
        recommendedLens: [], // Changed to single selection
        coatings: [],
        extras: [] // Now array of { extra: id, colors: [colorIds] }
    });

    const [lensList, setLensList] = useState([]);
    const [recommendedList, setRecommendedList] = useState([]);
    const [filteredRecommendedList, setFilteredRecommendedList] = useState([]);
    const [coatingList, setCoatingList] = useState([]);
    const [extrasList, setExtrasList] = useState([]);
    const [colorsList, setColorsList] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(null)

    const fetchOptions = async () => {
        const [lens, recommended, coatings, extras, colors] = await Promise.all([
            axiosInstance.get(`/api/lenses`),
            axiosInstance.get(`/api/recommended-lenses`),
            axiosInstance.get(`/api/coatings`),
            axiosInstance.get(`/api/extras`),
            axiosInstance.get(`/api/colors`)
        ]);
        setLensList(lens.data);
        setRecommendedList(recommended.data);
        setCoatingList(coatings.data);
        setExtrasList(extras.data);
        setColorsList(colors.data);
    };

    const loadData = async () => {
        setLoading(true);
        setLoadingError(null);

        try {
            await fetchOptions();

            if (!id) {
                setLoading(false);
                return;
            }

            const res = await axiosInstance.get(`/api/designs/${id}`);
            const data = res.data || {};

            // Process extras (handles both formats)
            let processedExtras = [];
            if (Array.isArray(data.extras)) {
                processedExtras = data.extras.map(item => {
                    // New format: { extra: {...}, colors: [...] }
                    if (item.extra && item.colors) {
                        return {
                            extra: item.extra._id || item.extra,
                            colors: item.colors.map(c => c._id || c)
                        };
                    }

                    // Old format: single ID
                    return {
                        extra: item._id || item,
                        colors: []
                    };
                });
            }

            setDesign({
                ...data,
                lensType: data.lensType?._id || data.lensType || "",
                recommendedLens: Array.isArray(data.recommendedLens)
                    ? data.recommendedLens.map(l => l._id || l)
                    : [],
                coatings: Array.isArray(data.coatings)
                    ? data.coatings.map(c => c._id || c)
                    : [],
                isVisible: data.isVisible ?? true,
                extras: processedExtras
            });

            setSubmitStatus(null);
        } catch (err) {
            console.error("Error loading design:", err);
            setLoadingError("Failed to load design.");
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        loadData();
    }, [id]);


    // Filter recommended lenses based on selected lens type
    useEffect(() => {
        if (design.lensType && lensList.length > 0) {
            const selectedLens = lensList.find(lens => lens._id === design.lensType);
            if (selectedLens && selectedLens.powerLensMap && selectedLens.powerLensMap.length > 0) {
                // Get all recommended lenses from all power ranges (they are already populated)
                const allRecommendedLenses = [];
                const seenIds = new Set();

                selectedLens.powerLensMap.forEach(powerMap => {
                    powerMap.recommendedLenses.forEach(recommendedLens => {
                        // Handle both populated objects and IDs
                        const lensId = recommendedLens._id || recommendedLens;
                        const lensIdStr = lensId.toString();

                        if (!seenIds.has(lensIdStr)) {
                            seenIds.add(lensIdStr);
                            // If it's a populated object, use it directly, otherwise find it in recommendedList
                            if (recommendedLens._id && recommendedLens.name) {
                                allRecommendedLenses.push(recommendedLens);
                            } else {
                                const foundLens = recommendedList.find(lens => lens._id.toString() === lensIdStr);
                                if (foundLens) {
                                    allRecommendedLenses.push(foundLens);
                                }
                            }
                        }
                    });
                });

                setFilteredRecommendedList(allRecommendedLenses);

                // Reset recommended lens if current selection is not valid for new lens type
                setDesign(prev => ({
                    ...prev,
                    recommendedLens: prev.recommendedLens.filter(id => seenIds.has(id.toString()))
                }));

            } else {
                setFilteredRecommendedList([]);
            }
        } else {
            setFilteredRecommendedList([]);
        }
    }, [design.lensType, lensList, recommendedList]);

    const validate = () => {
        const errs = {};
        if (!design.name) errs.name = 'Name is required';
        if (!design.lensType) errs.lensType = 'Lens type is required';
        if (isNaN(design.price) || design.price < 0) errs.price = 'Valid price is required';
        // Add this if you want to ensure isVisible is always a boolean:
        if (typeof design.isVisible !== 'boolean') errs.isVisible = 'Visibility must be set';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDesign(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const handleImageUpload = (url) => {
        setDesign(prev => ({ ...prev, image: url }));
    };

    const handleMultiToggle = (key, id) => {
        setDesign(prev => {
            const set = new Set(prev[key]);
            if (set.has(id)) set.delete(id);
            else set.add(id);
            return { ...prev, [key]: Array.from(set) };
        });
    };

    // Handle adding a new extra
    const handleAddExtra = () => {
        setDesign(prev => ({
            ...prev,
            extras: [...prev.extras, { extra: '', colors: [] }]
        }));
    };

    // Handle removing an extra
    const handleRemoveExtra = (index) => {
        setDesign(prev => ({
            ...prev,
            extras: prev.extras.filter((_, i) => i !== index)
        }));
    };

    // Handle changing the extra selection
    const handleExtraChange = (index, extraId) => {
        setDesign(prev => {
            const newExtras = [...prev.extras];
            newExtras[index] = { ...newExtras[index], extra: extraId };
            return { ...prev, extras: newExtras };
        });
    };

    // Handle toggling colors for a specific extra
    const handleColorToggle = (extraIndex, colorId) => {
        setDesign(prev => {
            const newExtras = [...prev.extras];
            const colors = new Set(newExtras[extraIndex].colors);
            if (colors.has(colorId)) {
                colors.delete(colorId);
            } else {
                colors.add(colorId);
            }
            newExtras[extraIndex] = { ...newExtras[extraIndex], colors: Array.from(colors) };
            return { ...prev, extras: newExtras };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ design });
        if (!validate()) return;

        setSubmitting(true);
        setSubmitStatus(null);

        // Filter out extras that don't have an extra selected
        const cleanedExtras = design.extras.filter(item => item.extra);
        const designToSubmit = { ...design, extras: cleanedExtras };

        const method = id ? 'put' : 'post';
        const url = id ? `/api/designs/${id}` : `/api/designs`;
        try {
            await axiosInstance[method](url, designToSubmit);
            setSubmitStatus('Design saved successfully');
            if (!id) {
                setDesign({
                    name: '',
                    image: '',
                    description: '',
                    price: 0,
                    lensType: '',
                    recommendedLens: '',
                    coatings: [],
                    extras: []
                });
            }
            navigate('/designs');
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setSubmitStatus(`Error: ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/designs');
    };

    const renderSingleSelect = (label, items, fieldKey, errorKey) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>
            <select
                name={fieldKey}
                value={design[fieldKey]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                required
            >
                <option value="">Select {label}</option>
                {items.map(item => (
                    <option key={item._id} value={item._id}>
                        {item.name}
                    </option>
                ))}
            </select>
            {errors[errorKey] && (
                <p className="text-red-500 text-sm mt-1">{errors[errorKey]}</p>
            )}
        </div>
    );

    const renderMultiSelect = (label, items, fieldKey) => (
        <div className='bg-white p-4 shadow-sm'>
            <label className="block text-xl font-medium text-gray-700 mb-4">{label}</label>
            <div className="grid grid-cols-1 gap-4 bg-gray-100 p-5">
                {items.map(item => {
                    const selected = design[fieldKey].includes(item._id);
                    return (
                        <button
                            key={item._id}
                            type="button"
                            onClick={() => handleMultiToggle(fieldKey, item._id)}
                            className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${selected
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {item.name}
                            {item.code && ` - ${item.code}`}
                            {item.price && ` - £${item.price}`}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderExtrasWithColors = () => (
        <div className='bg-white shadow-sm p-4'>
            <label className="block text-xl font-medium text-gray-700 mb-3">Extras with Colors</label>

            <div className="space-y-4">
                {design.extras.map((extraItem, index) => {
                    const selectedExtra = extrasList.find(extra => extra._id === extraItem.extra);

                    return (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center gap-3 mb-3">
                                <select
                                    value={extraItem.extra}
                                    onChange={(e) => handleExtraChange(index, e.target.value)}
                                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                                >
                                    <option value="">Select Extra</option>
                                    {extrasList.map(extra => (
                                        <option key={extra._id} value={extra._id}>
                                            {extra.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveExtra(index)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {extraItem.extra && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Colors for {selectedExtra?.name}:
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {colorsList.map(color => {
                                            const isSelected = extraItem.colors.includes(color._id);
                                            return (
                                                <button
                                                    key={color._id}
                                                    type="button"
                                                    onClick={() => handleColorToggle(index, color._id)}
                                                    className={`px-3 py-2 border rounded-md text-sm flex items-center gap-2 transition-colors ${isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {color.name}
                                                    {color.code && (
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-gray-400"
                                                            style={{ backgroundColor: color.code }}
                                                        />
                                                    )}
                                                    {isSelected && <Check size={14} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {extraItem.colors.length === 0 && (
                                        <p className="text-gray-500 text-sm mt-2">
                                            No colors selected
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {design.extras.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm">No extras added yet. Click "Add Extra" to get started.</p>
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={handleAddExtra}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
                <Plus size={16} />
                Add Extra
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        )
    }
    if (loadingError) {
        return (

            <div className="p-4 bg-red-50 border border-red-300 rounded-md mt-4">
                <p className="text-red-700">{loadingError}</p>

                <button
                    onClick={loadData}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
                    disabled={loading}
                >
                    {loading ? "Retrying..." : "Retry"}
                </button>
            </div>
        )
    }

    return (
        <div className="p-8 mb-8">
            <div className="bg-white shadow-sm border-b border-gray-100 p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-medium text-gray-900">
                            {id ? 'Edit Design' : 'Create New Design'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {id ? 'Modify the existing design details' : 'Fill in the details to create a new design'}
                        </p>
                    </div>
                    <a
                        href="/designs"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Designs
                    </a>
                </div>
            </div>

            {submitStatus && (
                <div className={`px-4 py-3 mb-6 rounded-md border-l-4 ${submitStatus.startsWith('Error')
                    ? 'bg-red-50 border-red-400 text-red-700'
                    : 'bg-green-50 border-green-400 text-green-700'
                    }`}>
                    <p className="text-sm">{submitStatus}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Design Visibility Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="text-sm font-medium text-gray-800">Design Visibility</h3>
                            <p className="text-xs text-gray-600 mt-1">
                                Control whether this design is visible to customers or used for internal configuration
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDesign(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${design.isVisible
                                ? 'bg-gray-900 text-white hover:bg-gray-800'
                                : 'bg-gray-600 text-white hover:bg-gray-700'
                                }`}
                        >
                            {design.isVisible ? (
                                <>
                                    <Eye className="w-4 h-4" />
                                    Visible
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-4 h-4" />
                                    Hidden
                                </>
                            )}
                        </button>
                    </div>

                    {!design.isVisible && (
                        <div className="mt-3 p-3 bg-gray-100 border border-gray-300 rounded-md">
                            <p className="text-sm text-gray-700">
                                <strong>⚠️ Configuration Design Mode:</strong> This design won't be shown in design step if its the only one for the lens + recommended lense pair and used only for internal configuration.
                            </p>
                        </div>
                    )}
                </div>

                {/* Design Rules Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-800 mb-2">Design Display Rules</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• If you select a specific recommended lens, this design will only appear for that lens type + recommended lens combination</li>
                        <li>• If you leave recommended lens empty, this design will appear under ALL recommended lenses for the selected lens type</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 gap-6 bg-white p-4 shadow-sm">
                    <div className='bg-gray-50 p-4'>

                        {/* Lens Type Selection */}
                        <div>
                            {renderSingleSelect('Lens Type', lensList, 'lensType', 'lensType')}
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">£</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={design.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g. 99.99"
                                    className="w-full pl-7 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                                    required
                                />
                            </div>
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={design.name}
                                onChange={handleChange}
                                placeholder="Design name"
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={design.description}
                                onChange={handleChange}
                                placeholder="Brief description of the design"
                                rows={3}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors resize-none"
                            />
                        </div>
                    </div>

                </div>

                {/* Recommended Lens Selection */}
                {design.lensType && (
                    <div>
                        {renderMultiSelect(
                            'Recommended Lens (Optional)',
                            filteredRecommendedList,
                            'recommendedLens',
                        )}
                        {design.recommendedLens.length === 0 && (
                            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-800">
                                            Design will apply to entire lens type
                                        </h3>
                                        <div className="mt-1 text-sm text-gray-600">
                                            Since no specific recommended lens is selected, this design will appear under every recommended lens option for the
                                            <strong> Selected lens type.</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Coatings Selection */}
                <div>
                    {renderMultiSelect('Coatings', coatingList, 'coatings')}
                </div>

                {/* Extras with Colors */}
                <div>
                    {renderExtrasWithColors()}
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>

                    {/* Show preview of current image */}
                    {design.image && (
                        <div className="mb-4 bg-gray-50 rounded-lg p-4">
                            <div className="relative inline-block">
                                <img
                                    src={design.image}
                                    alt="Preview"
                                    className="max-w-full h-auto max-h-64 rounded-md shadow-sm border border-gray-200"
                                />
                            </div>
                        </div>
                    )}

                    <ImageUploader onUpload={handleImageUpload} initialImage={design.image} />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                {id ? 'Update Design' : 'Create Design'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DesignForm;