import React, { useEffect, useState } from 'react'
import SightTestForm from './sightTestForm'
import { DeletionErrorModal } from '../../components/deletionErrorModal'
import { Edit, Trash2, Eye, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import axiosInstance from '../../../api/axios'

const SightTestPage = () => {
  const [tests, setTests] = useState([])
  const [editingTest, setEditingTest] = useState(null)
  const [deletionError, setDeletionError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const fetchTests = async () => {
    try {
      setLoading(true)
      // Use the admin route to see all (active and inactive)
      const res = await axiosInstance.get(`/api/sight-tests/admin`)
      setTests(res.data)
    } catch (err) {
      console.error('Failed to fetch sight tests', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this sight test category?')) return;
    try {
      await axiosInstance.delete(`/api/sight-tests/${id}`);
      fetchTests();
    } catch (err) {
      // Reusing your error logic
      if (err.response?.status === 409) {
        setDeletionError({
          message: err.response.data.message || 'Cannot delete: referenced by orders.',
          references: err.response.data.references || [],
          objectType: 'Sight Test'
        });
      } else {
        alert('Failed to delete sight test');
      }
    }
  };

  const handleEditClick = (test) => {
    setEditingTest(test);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    fetchTests()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Sight Test Pricing</h1>
              <p className="text-sm text-gray-500 mt-2">Manage eye test categories, tiers, and pricing</p>
            </div>
            <div className="flex gap-3">
              <a href="/" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </a>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                  <Eye className="w-4 h-4" /> Add Category
                </button>
              )}
            </div>
          </div>
        </div>

        {showForm && (
          <SightTestForm
            initialData={editingTest}
            onSaved={() => {
              setEditingTest(null)
              setShowForm(false)
              fetchTests()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingTest(null)
            }}
          />
        )}

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiers & Prices</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tests.map((test) => (
                <tr key={test._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {test.isActive ? 
                      <span className="flex items-center text-green-600 text-xs font-medium"><CheckCircle2 className="w-4 h-4 mr-1"/> Active</span> : 
                      <span className="flex items-center text-gray-400 text-xs font-medium"><XCircle className="w-4 h-4 mr-1"/> Inactive</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{test.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {test.options.map((opt, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {opt.name}: £{opt.price}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-1">
                      <button onClick={() => handleEditClick(test)} className="text-gray-400 hover:text-gray-600 p-2"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(test._id)} className="text-gray-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DeletionErrorModal isOpen={!!deletionError} onClose={() => setDeletionError(null)} errorData={deletionError} />
    </div>
  )
}

export default SightTestPage