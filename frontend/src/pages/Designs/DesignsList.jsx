import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Eye, EyeOff, Trash2, Plus, Calendar, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeletionErrorModal } from '../../components/deletionErrorModal';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const DesignsList = () => {
    const [designs, setDesigns] = useState([]);
    const [filteredDesigns, setFilteredDesigns] = useState([]);
    const [deletionError, setDeletionError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibilityFilter, setVisibilityFilter] = useState('all');
    const [sortBy, setSortBy] = useState('updatedAt');
    const navigate = useNavigate();

    const fetchDesigns = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseUrl}/api/designs`);
            const sortedDesigns = res.data.sort((a, b) => {
                if (sortBy === 'updatedAt') {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                }
                if (sortBy === 'createdAt') {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                if (sortBy === 'name') {
                    return a.name.localeCompare(b.name);
                }
                return 0;
            });
            setDesigns(sortedDesigns);
        } catch (err) {
            console.error('Failed to fetch designs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, [sortBy]);

    useEffect(() => {
        let filtered = designs;
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(design => 
                design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                design.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Visibility filter
        if (visibilityFilter !== 'all') {
            filtered = filtered.filter(design => 
                visibilityFilter === 'visible' ? design.isVisible : !design.isVisible
            );
        }
        
        setFilteredDesigns(filtered);
    }, [designs, searchTerm, visibilityFilter]);

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-12 bg-gray-200 rounded-lg w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Design Collection</h1>
                        <p className="text-gray-600 mt-1">{filteredDesigns.length} designs found</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        Create New Design
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search designs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Visibility Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <select
                                value={visibilityFilter}
                                onChange={(e) => setVisibilityFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Designs</option>
                                <option value="visible">Visible Only</option>
                                <option value="hidden">Hidden Only</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="updatedAt">Recently Updated</option>
                                <option value="createdAt">Recently Created</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Designs Grid */}
            {filteredDesigns.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🎨</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No designs found</h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm || visibilityFilter !== 'all' 
                            ? "Try adjusting your search or filters" 
                            : "Get started by creating your first design"}
                    </p>
                    {!searchTerm && visibilityFilter === 'all' && (
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Create Your First Design
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDesigns.map(design => (
                        <div 
                            key={design._id} 
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gray-100">
                                {design.image ? (
                                    <img 
                                        src={design.image} 
                                        alt={design.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">🎨</div>
                                            <div className="text-sm">No Image</div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Visibility Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                        design.isVisible 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {design.isVisible ? (
                                            <>
                                                <Eye className="w-3 h-3" />
                                                Visible
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="w-3 h-3" />
                                                Hidden
                                            </>
                                        )}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(design._id)}
                                        className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-50 text-blue-600 transition-colors"
                                        title="Edit design"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(design._id)}
                                        className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 text-red-600 transition-colors"
                                        title="Delete design"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                                    {design.name}
                                </h3>
                                
                                {design.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {design.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-bold text-gray-900">
                                        {formatPrice(design.price)}
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                                    {design.updatedAt && (
                                        <div>Updated: {formatDate(design.updatedAt)}</div>
                                    )}
                                    {design.createdAt && (
                                        <div>Created: {formatDate(design.createdAt)}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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