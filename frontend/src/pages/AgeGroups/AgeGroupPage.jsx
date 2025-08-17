import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AgeGroupForm from './ageGroupForm'
import { Edit, Trash2, Users, ArrowLeft } from 'lucide-react'

const baseUrl = import.meta.env.VITE_APP_BASE_URL

const AgeGroupPage = () => {
  const [ageGroups, setAgeGroups] = useState([])
  const [editingAgeGroup, setEditingAgeGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchAgeGroups = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${baseUrl}/api/age-groups`)
      setAgeGroups(res.data)
    } catch (err) {
      console.error('Failed to fetch age groups', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgeGroups()
  }, [])

  const handleEditClick = (ageGroup) => {
    setEditingAgeGroup(ageGroup)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaved = () => {
    setEditingAgeGroup(null)
    setShowForm(false)
    fetchAgeGroups()
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingAgeGroup(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this age group?')) return
    try {
      await axios.delete(`${baseUrl}/api/age-groups/${id}`)
      fetchAgeGroups()
    } catch (err) {
      console.error('Failed to delete age group', err)
      alert('Failed to delete age group')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Age Group Management</h1>
              <p className="text-sm text-gray-500 mt-2">
                Create, manage, and monitor your age group categories and images
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </a>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Add Age Group
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <AgeGroupForm
            initialData={editingAgeGroup}
            onSaved={handleSaved}
            onCancel={handleCancelForm}
          />
        )}

        {/* List Section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Age Groups</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your age group categories and images</p>
                </div>
              </div>
            </div>
          </div>

          {/* Age Groups Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ageGroups.map((ageGroup) => (
                  <tr key={ageGroup._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {ageGroup.image ? (
                          <img
                            src={ageGroup.image}
                            alt={ageGroup.name}
                            className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ageGroup.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditClick(ageGroup)}
                          className="text-gray-400 hover:text-gray-600 p-2 rounded transition-colors"
                          title="Edit age group"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ageGroup._id)}
                          className="text-gray-400 hover:text-red-600 p-2 rounded transition-colors"
                          title="Delete age group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {ageGroups.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Users className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-sm">No age groups found</p>
                <p className="text-gray-400 text-xs mt-1">Create your first age group using the form above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgeGroupPage
