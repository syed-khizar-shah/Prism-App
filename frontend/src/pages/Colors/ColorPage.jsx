import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ColorForm from './colorForm'
import { DeletionErrorModal } from '../../components/deletionErrorModal'

const baseUrl = import.meta.env.VITE_APP_BASE_URL

const ColorPage = () => {
  const [colors, setColors] = useState([])
  const [editingColor, setEditingColor] = useState(null)
  const [deletionError, setDeletionError] = useState(null)


  const fetchColors = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/colors`)
      setColors(res.data)
    } catch (err) {
      console.error('Failed to fetch colors', err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this color?')) return;
    try {
      await axios.delete(`${baseUrl}/api/colors/${id}`);
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

  useEffect(() => {
    fetchColors()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <ColorForm
        initialData={editingColor}
        onColorSaved={() => {
          setEditingColor(null)
          fetchColors()
        }}
      />

      <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <div key={color._id} className="flex items-center justify-between p-3 border rounded">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded" style={{ backgroundColor: color.code }}></div>
              <div>
                <div className="font-medium">{color.name}</div>
                <div className="text-sm text-gray-600">{color.code}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <button
                onClick={() => setEditingColor(color)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(color._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deletion Error Modal */}
      <DeletionErrorModal
        isOpen={!!deletionError}
        onClose={closeDeletionError}
        errorData={deletionError}
        onReferenceClick={handleReferenceClick}
      />
    </div>
  )
}

export default ColorPage