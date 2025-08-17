import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Check, X } from 'lucide-react'
import ImageUploader from '../../components/imageUploader'

const baseUrl = import.meta.env.VITE_APP_BASE_URL

const AgeGroupForm = ({ onSaved, initialData, onCancel }) => {
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

    const handleCancel = () => {
        setAgeGroup({ name: '', image: '' })
        setErrors({})
        setSubmitStatus(null)
        onCancel()
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
            <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-medium text-gray-900">
                    {initialData ? 'Edit Age Group' : 'Create New Age Group'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {initialData ? 'Modify the existing age group details' : 'Fill in the details to create a new age group'}
                </p>
            </div>

            {submitStatus && (
                <div className={`mb-6 p-4 rounded-md border-l-4 ${
                    submitStatus.includes('Error') 
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
                            Age Group Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={ageGroup.name}
                            onChange={handleChange}
                            placeholder="e.g. Children, Adults"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image <span className="text-red-500">*</span>
                    </label>
                    {ageGroup.image && (
                        <div className="mb-4">
                            <img src={ageGroup.image} alt="Age Group" className="max-h-48 rounded-md border border-gray-200" />
                        </div>
                    )}
                    <ImageUploader onUpload={handleImageUpload} initialImage={ageGroup.image} />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-3">
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
                        {initialData ? 'Update' : 'Create'} Age Group
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
    )
}

export default AgeGroupForm
