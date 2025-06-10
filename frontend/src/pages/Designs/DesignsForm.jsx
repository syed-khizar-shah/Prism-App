import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/imageUploader';
import { Check, Eye, EyeOff, Plus, X } from 'lucide-react';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const DesignForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [design, setDesign] = useState({
        name: '',
        image: '',
        description: '',
        price: '',
        isVisible: true,
        lensType: '', // Changed to single selection
        recommendedLens: [], // Changed to single selection
        coating: [],
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

    const fetchOptions = async () => {
        const [lens, recommended, coating, extras, colors] = await Promise.all([
            axios.get(`${baseUrl}/api/lenses`),
            axios.get(`${baseUrl}/api/recommended-lenses`),
            axios.get(`${baseUrl}/api/coatings`),
            axios.get(`${baseUrl}/api/extras`),
            axios.get(`${baseUrl}/api/colors`)
        ]);
        setLensList(lens.data);
        setRecommendedList(recommended.data);
        setCoatingList(coating.data);
        setExtrasList(extras.data);
        setColorsList(colors.data);
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchOptions();
            if (id) {
                const res = await axios.get(`${baseUrl}/api/designs/${id}`);

                // Handle the new extras structure
                let processedExtras = [];
                if (res.data.extras && Array.isArray(res.data.extras)) {
                    processedExtras = res.data.extras.map(extraItem => {
                        if (extraItem.extra && extraItem.colors) {
                            // New format - already structured correctly
                            return {
                                extra: extraItem.extra._id || extraItem.extra,
                                colors: extraItem.colors.map(color => color._id || color)
                            };
                        } else {
                            // Old format - convert single ID to new structure
                            return {
                                extra: extraItem._id || extraItem,
                                colors: []
                            };
                        }
                    });
                }
                console.log("here 1 ")
                console.log(res.data)

                setDesign({
                    ...res.data,
                    lensType: res.data.lensType?._id || res.data.lensType || '',
                    recommendedLens: Array.isArray(res.data.recommendedLens)
                        ? res.data.recommendedLens.map(l => l._id || l)
                        : [],
                    coating: res.data.coating?.map(item => item._id || item) || [],
                    isVisible: res.data.isVisible, // Add this line
                    extras: processedExtras
                });

                setSubmitStatus(null);
            }
        };
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
        if (design.price === '' || design.price < 0) errs.price = 'Valid price is required';
        // Add this if you want to ensure isVisible is always a boolean:
        if (typeof design.isVisible !== 'boolean') errs.isVisible = 'Visibility must be set';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDesign(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || '' : value
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

        // Filter out extras that don't have an extra selected
        const cleanedExtras = design.extras.filter(item => item.extra);
        const designToSubmit = { ...design, extras: cleanedExtras };

        const method = id ? 'put' : 'post';
        const url = id ? `${baseUrl}/api/designs/${id}` : `${baseUrl}/api/designs`;
        try {
            await axios[method](url, designToSubmit);
            setSubmitStatus('Design saved successfully');
            if (!id) {
                setDesign({
                    name: '',
                    image: '',
                    description: '',
                    price: '',
                    lensType: '',
                    recommendedLens: '',
                    coating: [],
                    extras: []
                });
            }
            navigate('/designs');
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setSubmitStatus(`Error: ${msg}`);
        }
    };

    const renderSingleSelect = (label, items, fieldKey, errorKey) => (
        <div>
            <label className="block mb-1 font-medium">{label}</label>
            <select
                name={fieldKey}
                value={design[fieldKey]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
            >
                <option value="">Select {label}</option>
                {items.map(item => (
                    <option key={item._id} value={item._id}>
                        {item.name}
                    </option>
                ))}
            </select>
            {errors[errorKey] && (
                <p className="text-red-500 text-sm">{errors[errorKey]}</p>
            )}
        </div>
    );

    const renderMultiSelect = (label, items, fieldKey) => (
        <div>
            <label className="block mb-1 font-medium">{label}</label>
            <div className="flex flex-wrap gap-3">
                {items.map(item => {
                    const selected = design[fieldKey].includes(item._id);
                    return (
                        <button
                            key={item._id}
                            type="button"
                            onClick={() => handleMultiToggle(fieldKey, item._id)}
                            className={`px-3 py-1 border rounded ${selected ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
                        >
                            {item.name} 
                            {item.code &&
                            <>
                            - {item.code}
                            </>
                            }
                             - £{item.price}

                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderExtrasWithColors = () => (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label className="block font-medium">Extras with Colors</label>
            </div>

            <div className="space-y-4">
                {design.extras.map((extraItem, index) => {
                    const selectedExtra = extrasList.find(extra => extra._id === extraItem.extra);

                    return (
                        <div key={index} className="border rounded p-4 bg-gray-50">
                            <div className="flex items-center gap-3 mb-3">
                                <select
                                    value={extraItem.extra}
                                    onChange={(e) => handleExtraChange(index, e.target.value)}
                                    className="flex-1 border rounded px-3 py-2"
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
                                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {extraItem.extra && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
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
                                                    className={`px-3 py-1 border rounded text-sm flex items-center gap-1 ${isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {color.name}
                                                    {color.code && (
                                                        <div
                                                            className="w-3 h-3 rounded-full border border-gray-400"
                                                            style={{ backgroundColor: color.code }}
                                                        />
                                                    )}
                                                    {isSelected && <Check size={12} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {extraItem.colors.length === 0 && (
                                        <p className="text-gray-500 text-sm mt-2">
                                            No colors selected - this extra will be available in default color only
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {design.extras.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No extras added yet. Click "Add Extra" to get started.</p>
                    </div>
                )}
            </div>
            <div className='my-2'>
                             <button
                    type="button"
                    onClick={handleAddExtra}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    <Plus size={16} />
                    Add Extra
                </button>
            </div>
        </div>
    );

    // Get the selected lens type name for the naming convention info
    const selectedLensTypeName = lensList.find(lens => lens._id === design.lensType)?.name || '';

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white text-black shadow-md rounded-xl space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-blue-800 text-sm mb-2">
                    <strong>Design Display Rules:</strong>
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li>• If you select a specific recommended lens, this design will only appear for that lens type + recommended lens combination</li>
                    <li>• If you leave recommended lens empty, this design will appear under ALL recommended lenses for the selected lens type</li>
                </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-amber-800 text-sm font-semibold">Design Visibility</p>
                    <button
                        type="button"
                        onClick={() =>
                            setDesign(prev => ({ ...prev, isVisible: !prev.isVisible }))
                        }
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white text-sm rounded hover:bg-amber-600"
                        title="Toggle visibility"
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
                <ul className="text-amber-700 text-sm space-y-1 pl-4 list-disc">
                    <li>
                        <strong>Configuration Designs:</strong> Set visibility to false to hide from customers
                    </li>
                    <li>
                        <strong>Purpose:</strong> Hidden designs define available extras for the selected lens type
                    </li>
                </ul>
            </div>
            <div>

                {!design.isVisible && (
                    <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded">
                        <p className="text-orange-800 text-sm">
                            <strong>⚠️ Configuration Design Mode:</strong> This design will be hidden from customers. It will only be used to provide extras as options. The name and other fields would not be visible to user.
                        </p>
                    </div>
                )}
            </div>

            {renderSingleSelect('Lens Type', lensList, 'lensType', 'lensType')}

            {design.lensType && (
                <div>
                    {renderMultiSelect(
                        'Recommended Lens (Optional)',
                        filteredRecommendedList,
                        'recommendedLens',
                    )}
                    {!design.recommendedLens && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Design will apply to entire lens type
                                    </h3>
                                    <div className="mt-1 text-sm text-yellow-700">
                                        Since no specific recommended lens is selected, this design will appear under every recommended lens option for the
                                        <strong>
                                            {' '}{selectedLensTypeName} lens type.
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div>
                <label className="block mb-1 font-medium">Name</label>
                <div className="flex gap-2">
                    <input type="text" name="name" value={design.name} onChange={handleChange}
                        className="flex-1 border rounded px-3 py-2" />
                </div>
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            </div>


            <div>
                <label className="block mb-2 font-semibold">Image</label>
                {design.image && (
                    <div className="my-4">
                        <img src={design.image} alt="Preview" className="max-h-96 rounded border" />
                    </div>
                )}
                <ImageUploader onUpload={handleImageUpload} initialImage={design.image} />
            </div>

            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea name="description" value={design.description} onChange={handleChange}
                    className="w-full border rounded px-3 py-2" rows={3} />
            </div>

            <div>
                <label className="block mb-1 font-medium">Price</label>
                <input type="number" name="price" value={design.price} onChange={handleChange}
                    className="w-full border rounded px-3 py-2" />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

            {renderMultiSelect('Coatings', coatingList, 'coating')}
            {renderExtrasWithColors()}

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Design</button>
            {submitStatus && <div className="text-center text-sm mt-2">{submitStatus}</div>}
        </form>
    );
};

export default DesignForm;