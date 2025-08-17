import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash2, Plus, Search, Package, ArrowLeft } from 'lucide-react'
import { DeletionErrorModal } from '../../components/deletionErrorModal'

const baseUrl = import.meta.env.VITE_APP_BASE_URL

const ExtrasList = () => {
  const [extras, setExtras] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [deletionError, setDeletionError] = useState(null)
  

  const fetchExtras = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${baseUrl}/api/extras`)
      setExtras(res.data)
    } catch (err) {
      console.error('Failed to fetch extras', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExtras()
  }, [])

  const handleEditClick = (extra) => {
    navigate(`/extras/edit/${extra._id}`)
  }

  const handleCreateClick = () => {
    navigate('/extras/create')
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this extra?')) return;
    try {
      await axios.delete(`${baseUrl}/api/extras/${id}`);
      fetchExtras();
    } catch (err) {
      if (err.response?.status === 409) {
        const { message, references } = err.response.data;
        setDeletionError({
          message: message || 'This extra cannot be deleted because it is being referenced by other items.',
          references: references || [],
          objectType: 'Extra'
        });
      } else {
        console.error('Failed to delete extra', err);
        alert('Failed to delete extra');
      }
    }
  };

  const handleReferenceClick = (reference) => {
    console.log('Reference clicked:', reference);
    window.open(`/designs/edit/${reference}`, '_blank', 'noopener,noreferrer');
  };

  const closeDeletionError = () => {
    setDeletionError(null);
  };

  const filteredExtras = extras.filter(extra =>
    extra.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (extra.description && extra.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Extras Management</h1>
              <p className="text-sm text-gray-500 mt-2">
                Create, manage, and monitor additional extras and add-ons for your products
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
              <button
                onClick={handleCreateClick}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Extra
              </button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search extras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Extras</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage additional extras and add-ons for your products</p>
                </div>
              </div>
            </div>
          </div>

          {/* Extras Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExtras.map((extra) => (
                  <tr key={extra._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {extra.image ? (
                        <img
                          src={extra.image}
                          alt={extra.name}
                          className="h-16 w-16 object-contain rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{extra.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {extra.description || <span className="text-gray-400 italic">No description</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">£{extra.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditClick(extra)}
                          className="text-gray-400 hover:text-gray-600 p-2 rounded transition-colors"
                          title="Edit extra"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(extra._id)}
                          className="text-gray-400 hover:text-red-600 p-2 rounded transition-colors"
                          title="Delete extra"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredExtras.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Package className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-sm">No extras found</p>
                <p className="text-gray-400 text-xs mt-1">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first extra to get started'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Deletion Error Modal */}
        <DeletionErrorModal
          isOpen={!!deletionError}
          onClose={closeDeletionError}
          errorData={deletionError}
          onReferenceClick={handleReferenceClick}
        />
      </div>
    </div>
  )
}

export default ExtrasList
