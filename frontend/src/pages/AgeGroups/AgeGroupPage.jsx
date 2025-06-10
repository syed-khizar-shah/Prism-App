import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AgeGroupForm from './ageGroupForm'
import { Edit } from 'lucide-react'

const baseUrl = import.meta.env.VITE_APP_BASE_URL

const AgeGroupPage = () => {
  const [ageGroups, setAgeGroups] = useState([])
  const [editingAgeGroup, setEditingAgeGroup] = useState(null)

  const fetchAgeGroups = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/age-groups`)
      setAgeGroups(res.data)
    } catch (err) {
      console.error('Failed to fetch age groups', err)
    }
  }

  useEffect(() => {
    fetchAgeGroups()
  }, [])

  const handleEditClick = (ageGroup) => {
    setEditingAgeGroup(ageGroup)
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll to form on edit
  }

  const handleSaved = () => {
    setEditingAgeGroup(null)
    fetchAgeGroups()
  }

  const handleCancelEdit = () => {
    setEditingAgeGroup(null)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <AgeGroupForm
        initialData={editingAgeGroup}
        onSaved={handleSaved}
      />

      {editingAgeGroup && (
        <div className="text-right">
          <button
            onClick={handleCancelEdit}
            className="text-sm text-red-600 hover:underline"
            type="button"
          >
            Cancel Edit
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {ageGroups.map(({ _id, name, image }) => (
          <div key={_id} className="relative flex items-center space-x-4 p-4 border rounded shadow-sm">
            <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-300 flex-shrink-0">
              {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{name}</h3>
            </div>
            <button
              onClick={() => handleEditClick({ _id, name, image })}
              className="absolute top-2 right-2 p-1 text-blue-600 hover:text-blue-800"
              aria-label={`Edit ${name}`}
            >
              <Edit className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AgeGroupPage
