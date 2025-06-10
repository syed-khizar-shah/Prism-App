import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/imageUploader';
import { Trash, Trash2 } from 'lucide-react';

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
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 bg-white shadow rounded-xl space-y-6">
            <div>
                <label className="block mb-1">Name</label>
                <input
                    type="text"
                    name="name"
                    value={lens.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            <div>
                <label className="block mb-1">Type</label>
                <input
                    type="text"
                    name="type"
                    value={lens.type}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.type && <p className="text-red-500">{errors.type}</p>}
            </div>

            <div>
                <label className="block mb-1">Subtype Of (optional)</label>
                <select
                    name="subtypeOf"
                    value={lens.subtypeOf || ''}
                    onChange={handleSubtypeChange}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="">-- None --</option>
                    {lenses.filter(l => !id || l._id !== id).map(l => (
                        <option key={l._id} value={l._id}>{l.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1">Price</label>
                <input
                    type="number"
                    name="price"
                    value={lens.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border rounded px-3 py-2"
                />
                {errors.price && <p className="text-red-500">{errors.price}</p>}
            </div>

            <div>
                <label className="block mb-1">Image</label>
                {lens.image && <img src={lens.image} alt="Lens" className="max-h-48 mb-4" />}
                <ImageUploader onUpload={handleImageUpload} initialImage={lens.image} />
            </div>

            <div>
                <label className="block mb-1">Description</label>
                <textarea
                    name="description"
                    value={lens.description}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                />
            </div>

            <div>
                <label className="block mb-1">Age Groups</label>
                <div className="flex flex-wrap gap-3">
                    {ageGroups.map(a => {
                        // console.log({a})
                        const selected = lens.ageGroups.includes(a._id);
                        // console.log(lens.ageGroups)
                        return (
                            <button
                                key={a._id}
                                type="button"
                                onClick={() => toggleAgeGroup(a._id)}
                                className={`px-3 py-1 rounded border ${selected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                            >
                                {a.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block mb-2 font-semibold">Power Lens Map</label>
                {errors.powerLensMap && <p className="text-red-500 text-sm mb-2">{errors.powerLensMap}</p>}

                {lens.powerLensMap.map((entry, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm">
                        <div className="flex gap-4 mb-2">
                            <div className="w-1/2">
                                <label className="text-sm block mb-1">Min Power</label>
                                <input
                                    type="number"
                                    value={entry.min}
                                    onChange={(e) => handlePowerLensMapChange(index, 'min', e.target.value)}
                                    placeholder="Min"
                                    step={0.25}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-sm block mb-1">Max Power</label>
                                <input
                                    type="number"
                                    value={entry.max}
                                    onChange={(e) => handlePowerLensMapChange(index, 'max', e.target.value)}
                                    placeholder="Max"
                                    step={0.25}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm">Recommended Lenses</label>
                            <div className="flex flex-wrap gap-2">
                                {recommendedLenses.map(r => {
                                    const selected = entry.recommendedLenses.includes(r._id)
                                    return (
                                        <button
                                            key={r._id}
                                            type="button"
                                            onClick={() => toggleRecommendedLens(index, r._id)}
                                            className={`px-2 py-1 rounded border text-sm transition ${selected ? 'bg-green-500 text-white' : 'bg-white text-gray-600 border-gray-300'
                                                }`}
                                        >
                                            {r.name} - {r.code} - £{r.price}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.powerMapEntry && errors.powerMapEntry[index] && (
                                <p className="text-red-500 text-sm mt-1">{errors.powerMapEntry[index]}</p>
                            )}
                        </div>

                        <div className="text-right mt-2">
                            <button
                                type="button"
                                onClick={() => removePowerLensMap(index)}
                                className="text-red-500 text-sm flex items-center gap-1"
                            >
                                <Trash2 size={16} /> Remove
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addPowerLensMap}
                    className="text-blue-600 text-sm font-medium hover:underline"
                >
                    + Add Power Lens Map
                </button>
            </div>


            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Save Lens
            </button>

            {submitStatus && <p className="text-center mt-2 text-sm">{submitStatus}</p>}
        </form>
    );
};

export default LensForm;
