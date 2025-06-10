import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { DeletionErrorModal } from '../../components/deletionErrorModal';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const LensList = () => {
  const [lenses, setLenses] = useState([]);
  const navigate = useNavigate();
  const [deletionError, setDeletionError] = useState(null);

  const fetchLenses = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/lenses`);
      setLenses(res.data);
    } catch (err) {
      console.error('Failed to fetch lenses', err);
    }
  };

  useEffect(() => {
    fetchLenses();
  }, []);

  const handleEditClick = (lens) => {
    navigate(`/lenses/edit/${lens._id}`);
  };

  const handleCreateClick = () => {
    navigate('/lenses/create');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lens?')) return;
    try {
      await axios.delete(`${baseUrl}/api/lenses/${id}`);
      fetchLenses();
    } catch (err) {
      if (err.response?.status === 409) {
        const { message, references } = err.response.data;
        setDeletionError({
          message: message || 'This lens cannot be deleted because it is being referenced by other items.',
          references: references || [],
          objectType: 'Lens'
        });
      } else {
        console.error('Failed to delete lens', err);
        alert('Failed to delete lens');
      }
    }
  };

  const handleReferenceClick = (reference) => {
    window.open(`/lenses/edit/${reference}`, '_blank', 'noopener,noreferrer');
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
        Create New Lens
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lenses.map((lens) => (
          <div key={lens._id} className="p-4 border rounded space-y-3 relative">
            {lens.image && (
              <img
                src={lens.image}
                alt={lens.name}
                className="h-32 w-full object-contain rounded"
              />
            )}
            <div className="font-semibold">{lens.name}</div>
            <div className="text-sm text-gray-700">{lens.description}</div>
            <div className="text-sm">Type: {lens.type}</div>
            <div className="text-sm font-medium">Price: £{lens.price}</div>

            <button
              onClick={() => handleEditClick(lens)}
              className="absolute top-2 right-10 p-1 text-blue-600 hover:text-blue-800"
              aria-label={`Edit ${lens.name}`}
            >
              <Edit className="h-5 w-5" />
            </button>

            <button
              onClick={() => handleDelete(lens._id)}
              className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-800"
              aria-label={`Delete ${lens.name}`}
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
  );
};

export default LensList;
