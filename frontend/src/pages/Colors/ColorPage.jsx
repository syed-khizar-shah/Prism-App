import React, { useEffect, useState } from 'react'
import ColorForm from './colorForm'
import { DeletionErrorModal } from '../../components/deletionErrorModal'
import { Edit, Trash2, Palette, ArrowLeft } from 'lucide-react'
import axiosInstance from '../../../api/axios'


const ColorPage = () => {
  const [colors, setColors] = useState([])
  const [editingColor, setEditingColor] = useState(null)
  const [deletionError, setDeletionError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchColors = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get(`/api/colors`)
      setColors(res.data)
    } catch (err) {
      console.error('Failed to fetch colors', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this color?')) return;
    try {
      await axiosInstance.delete(`/api/colors/${id}`);
      fetchColors();
    } catch (err) {
      if (err.response?.status === 409) {
        const { message, references } = err.response.data;
        setDeletionError({
          message: message || 'This color cannot be deleted because it is being referenced by other items.',
          references: references || [],
          objectType: 'Color'
        });
      } else {
        console.error('Failed to delete color', err);
        alert('Failed to delete color');
      }
    }
  };

  const handleReferenceClick = (reference) => {
    console.log('Reference clicked:', reference);
    window.open(`/extras/edit/${reference}`, '_blank', 'noopener,noreferrer');
  };

  const closeDeletionError = () => {
    setDeletionError(null);
  };

  const handleEditClick = (color) => {
    setEditingColor(color);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingColor(null);
  };

  useEffect(() => {
    fetchColors()
  }, [])

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
              <h1 className="text-3xl font-bold text-gray-900">Color Management</h1>
              <p className="text-sm text-gray-500 mt-2">
                Create, manage, and monitor your color palette and options
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
                  <Palette className="w-4 h-4" />
                  Add Color
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <ColorForm
            initialData={editingColor}
            onColorSaved={() => {
              setEditingColor(null)
              setShowForm(false)
              fetchColors()
            }}
            onCancel={handleCancelForm}
          />
        )}

        {/* List Section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Colors</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your color palette and options</p>
                </div>
              </div>
            </div>
          </div>

          {/* Colors Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colors.map((color) => (
                  <tr key={color._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm"
                          style={{ backgroundColor: color.code }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{color.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {color.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditClick(color)}
                          className="text-gray-400 hover:text-gray-600 p-2 rounded transition-colors"
                          title="Edit color"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(color._id)}
                          className="text-gray-400 hover:text-red-600 p-2 rounded transition-colors"
                          title="Delete color"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {colors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Palette className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-sm">No colors found</p>
                <p className="text-gray-400 text-xs mt-1">Create your first color using the form above</p>
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

export default ColorPage