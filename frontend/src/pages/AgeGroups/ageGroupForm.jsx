import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ImageUploader from '../../components/imageUploader'

const baseUrl = import.meta.env.VITE_APP_BASE_URL

const AgeGroupForm = ({ onSaved, initialData }) => {
    const [ageGroup, setAgeGroup] = useState({ name: '', image: '' })
    const [errors, setErrors] = useState({})
    const [submitStatus, setSubmitStatus] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (initialData) {
            setAgeGroup({
                name: initialData.name || '',
                image: initialData.image || ''
            })
        }
    }, [initialData])

    const validate = () => {
        const errs = {}
        if (!ageGroup.name.trim()) errs.name = 'Name is required'
        if (!ageGroup.image) errs.image = 'Image is required'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleChange = (e) => {
        setAgeGroup((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleImageUpload = (url) => {
        setAgeGroup((prev) => ({ ...prev, image: url }))
        setErrors((prev) => ({ ...prev, image: undefined }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        setSubmitStatus(null)

        try {
            if (initialData && initialData._id) {
                // Update existing age group
                await axios.put(`${baseUrl}/api/age-groups/${initialData._id}`, ageGroup)
                setSubmitStatus('Age group updated successfully')
            } else {
                // Create new age group
                await axios.post(`${baseUrl}/api/age-groups`, ageGroup)
                setSubmitStatus('Age group saved successfully')
                setAgeGroup({ name: '', image: '' })
            }
            setAgeGroup({ name: '', image: '' })
            onSaved && onSaved()
        } catch (error) {
            const msg = error.response?.data?.message || error.message
            setSubmitStatus(`Error: ${msg}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto p-6 bg-white rounded-lg shadow-md space-y-5"
        >
            <div>
                <label className="block mb-1 font-semibold text-gray-700">Name</label>
                <input
                    type="text"
                    name="name"
                    value={ageGroup.name}
                    onChange={handleChange}
                    placeholder="e.g. Children, Adults"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block mb-2 font-semibold text-gray-700">Image</label>
                {/* Show preview of current image */}
                {ageGroup.image && (
                    <div className="my-6 bg-white overflow-hidden">
                        <div className="p-4">
                            <div className="relative inline-block">
                                <img
                                    src={ageGroup.image}
                                    alt="Preview"
                                    className="max-w-full h-auto max-h-96 rounded-md shadow-sm border border-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <ImageUploader onUpload={handleImageUpload} initialImage={ageGroup.image} />
                {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-md font-semibold transition"
            >
                {loading ? (initialData ? 'Updating...' : 'Saving...') : (initialData ? 'Update Age Group' : 'Save Age Group')}
            </button>

            {submitStatus && (
                <p className="text-center text-sm mt-3 text-gray-800">{submitStatus}</p>
            )}
        </form>
    )
}

export default AgeGroupForm
