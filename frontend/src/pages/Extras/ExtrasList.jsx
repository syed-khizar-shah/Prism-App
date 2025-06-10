import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash2 } from 'lucide-react'
import { DeletionErrorModal } from '../../components/deletionErrorModal'

const baseUrl = import.meta.env.VITE_APP_BASE_URL

const ExtrasList = () => {
  const [extras, setExtras] = useState([])
  const navigate = useNavigate()
  const [deletionError, setDeletionError] = useState(null)
  

  const fetchExtras = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/extras`)
      setExtras(res.data)
    } catch (err) {
      console.error('Failed to fetch extras', err)
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


  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <button
        onClick={handleCreateClick}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create New Extra
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {extras.map((extra) => (
          <div key={extra._id} className="p-4 border rounded space-y-3 relative">
            {extra.image && (
              <img
                src={extra.image}
                alt={extra.name}
                className="h-32 w-full object-contain rounded"
              />
            )}
            <div className="font-semibold">{extra.name}</div>
            <div className="text-sm text-gray-700">{extra.description}</div>
            <div className="text-sm font-medium">Price: {extra.price}</div>

            <button
              onClick={() => handleEditClick(extra)}
              className="absolute top-2 right-10 p-1 text-blue-600 hover:text-blue-800"
              aria-label={`Edit ${extra.name}`}
            >
              <Edit className="h-5 w-5" />
            </button>

            <button
              onClick={() => handleDelete(extra._id)}
              className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-800"
              aria-label={`Delete ${extra.name}`}
            >
              <Trash2 className="h-5 w-5" />
            </button>

          </div>
        ))}
      </div>
      <DeletionErrorModal
        isOpen={!!deletionError}
        onClose={closeDeletionError}
        errorData={deletionError}
        onReferenceClick={handleReferenceClick}
      />
    </div>
  )
}

export default ExtrasList
