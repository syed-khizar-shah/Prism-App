import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeletionErrorModal } from '../../components/deletionErrorModal';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const DesignsList = () => {
    const [designs, setDesigns] = useState([]);
    const [deletionError, setDeletionError] = useState(null);
    const navigate = useNavigate();

    const fetchDesigns = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/designs`);
            setDesigns(res.data);
        } catch (err) {
            console.error('Failed to fetch designs', err);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    const handleEdit = (id) => navigate(`/designs/edit/${id}`);
    const handleCreate = () => navigate(`/designs/create`);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this design?')) return;
        try {
            await axios.delete(`${baseUrl}/api/designs/${id}`);
            fetchDesigns();
        } catch (err) {
            if (err.response?.status === 409) {
                setDeletionError({
                    message: err.response.data.message || 'Cannot delete design due to references.',
                    references: err.response.data.references || [],
                    objectType: 'Design'
                });
            } else {
                alert('Failed to delete design');
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            <button
                onClick={handleCreate}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Create New Design
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {designs.map(d => (
                    <div key={d._id} className="p-4 border rounded space-y-3 relative">
                        {d.image && <img src={d.image} alt={d.name} className="h-32 w-full object-contain rounded" />}
                        <div className="font-semibold">{d.name}</div>
                        <div className="text-sm text-gray-700">{d.description}</div>
                        <div className="text-sm font-medium">Price: {d.price}</div>

                        <button onClick={() => handleEdit(d._id)}
                            className="absolute top-2 right-10 p-1 text-blue-600 hover:text-blue-800">
                            <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(d._id)}
                            className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-800">
                            <Trash2 className="h-5 w-5" />
                        </button>
                        {d.isVisible ? (
                            <>
                                <Eye className="w-4 h-4 absolute top-2 left-2" />
                                Visible
                            </>
                        ) : (
                            <>
                                <EyeOff className="w-4 h-4 absolute top-2 left-2" />
                                Hidden
                            </>
                        )}
                    </div>
                ))}
            </div>

            <DeletionErrorModal
                isOpen={!!deletionError}
                onClose={() => setDeletionError(null)}
                errorData={deletionError}
                onReferenceClick={(ref) => window.open(`/designs/edit/${ref}`, '_blank')}
            />
        </div>
    );
};

export default DesignsList;
