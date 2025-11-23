import React, { useState, useEffect } from 'react';
import { Edit, Eye, EyeOff, Trash2, Plus, Calendar, Search, Filter, ArrowLeft, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeletionErrorModal } from '../../components/deletionErrorModal';
import axiosInstance from '../../../api/axios';

const DesignsList = () => {
    const [designs, setDesigns] = useState([]);
    const [filteredDesigns, setFilteredDesigns] = useState([]);
    const [deletionError, setDeletionError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibilityFilter, setVisibilityFilter] = useState('all');
    const [lensFilter, setLensFilter] = useState('all');
    const [sortBy, setSortBy] = useState('updatedAt');
    const [lenses, setLenses] = useState([]);
    const [lensesLoading, setLensesLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDesigns = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/api/designs`);
            console.log({res})
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

    const fetchLenses = async () => {
        try {
            setLensesLoading(true);
            const res = await axiosInstance.get(`/api/lenses`);
            setLenses(res.data);
        } catch (err) {
            console.error('Failed to fetch lenses', err);
        } finally {
            setLensesLoading(false);
        }
    };

    useEffect(() => {
        fetchDesigns();
        fetchLenses();
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

        // Lens filter
        if (lensFilter !== 'all') {
            filtered = filtered.filter(design => 
                design.lensType && design.lensType._id && design.lensType._id === lensFilter
            );
        }
        
        setFilteredDesigns(filtered);
    }, [designs, searchTerm, visibilityFilter, lensFilter]);

    const handleEdit = (id) => navigate(`/designs/edit/${id}`);
    const handleCreate = () => navigate(`/designs/create`);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this design?')) return;
        try {
            await axiosInstance.delete(`/api/designs/${id}`);
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

    const handleReferenceClick = (reference) => {
        console.log('Reference clicked:', reference);
        window.open(`/designs/edit/${reference}`, '_blank', 'noopener,noreferrer');
    };

    const closeDeletionError = () => {
        setDeletionError(null);
    };

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
                            <h1 className="text-3xl font-bold text-gray-900">Design Collection</h1>
                            <p className="text-sm text-gray-500 mt-2">
                                Create, manage, and monitor design configurations for your lens products
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
                                onClick={handleCreate}
                                className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create Design
                            </button>
                        </div>
                    </div>
                </div>

                {/* Admin Information Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div>
                            <h3 className="text-sm font-medium text-gray-800">About Designs</h3>
                            <p className="text-xs text-gray-600 mt-1">
                                Designs are product configurations that map lens types, coatings, and extras together.
                            </p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-2">Customer-Facing Designs</h4>
                                <p className="text-sm text-gray-600">
                                    Visible to customers and available for purchase. These represent complete lens solutions.
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-2">Configuration Designs</h4>
                                <p className="text-sm text-gray-600">
                                    Internal templates used for setup and configuration. Not visible to customers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search designs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                            />
                        </div>

                        {/* Visibility Filter */}
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <select
                                value={visibilityFilter}
                                onChange={(e) => setVisibilityFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                            >
                                <option value="all">All Designs</option>
                                <option value="visible">Visible Only</option>
                                <option value="hidden">Hidden Only</option>
                            </select>
                        </div>

                        {/* Lens Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <select
                                value={lensFilter}
                                onChange={(e) => setLensFilter(e.target.value)}
                                disabled={lensesLoading}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="all">All Lenses</option>
                                {lensesLoading ? (
                                    <option value="loading" disabled>Loading Lenses...</option>
                                ) : (
                                    lenses.map(lens => (
                                        <option key={lens._id} value={lens._id}>{lens.name}</option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                            >
                                <option value="updatedAt">Recently Updated</option>
                                <option value="createdAt">Recently Created</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="bg-white border border-gray-200 rounded-lg mb-8">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900">Customer-Facing Designs</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {filteredDesigns.filter(d => d.isVisible).length} visible designs • These designs are available to customers
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visible Designs Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDesigns.filter(d => d.isVisible).map((design) => (
                                    <tr key={design._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {design.image ? (
                                                <img
                                                    src={design.image}
                                                    alt={design.name}
                                                    className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{design.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs">
                                                {design.description || <span className="text-gray-400 italic">No description</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{formatPrice(design.price)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <Eye className="w-3 h-3" />
                                                Visible
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {design.updatedAt ? formatDate(design.updatedAt) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleEdit(design._id)}
                                                    className="text-gray-400 hover:text-gray-600 p-2 rounded transition-colors"
                                                    title="Edit design"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(design._id)}
                                                    className="text-gray-400 hover:text-red-600 p-2 rounded transition-colors"
                                                    title="Delete design"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredDesigns.filter(d => d.isVisible).length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-2">
                                    <Package className="w-12 h-12 mx-auto" />
                                </div>
                                <p className="text-gray-500 text-sm">No visible designs found</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {searchTerm || visibilityFilter !== 'all' || lensFilter !== 'all'
                                        ? "Try adjusting your search or filters" 
                                        : "Create your first visible design to get started"}
                                </p>
                                {!searchTerm && visibilityFilter === 'all' && lensFilter === 'all' && (
                                    <button
                                        onClick={handleCreate}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors mt-3"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Your First Design
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Configuration Designs Section */}
                <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-medium text-gray-900">Configuration Designs</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {filteredDesigns.filter(d => !d.isVisible).length} configuration designs • These designs are used for internal configuration and are not visible to customers
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuration Designs Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDesigns.filter(d => !d.isVisible).map((design) => (
                                    <tr key={design._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {design.image ? (
                                                <img
                                                    src={design.image}
                                                    alt={design.name}
                                                    className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{design.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs">
                                                {design.description || <span className="text-gray-400 italic">No description</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{formatPrice(design.price)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                <EyeOff className="w-3 h-3" />
                                                Configuration
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {design.updatedAt ? formatDate(design.updatedAt) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleEdit(design._id)}
                                                    className="text-gray-400 hover:text-gray-600 p-2 rounded transition-colors"
                                                    title="Edit design"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(design._id)}
                                                    className="text-gray-400 hover:text-red-600 p-2 rounded transition-colors"
                                                    title="Delete design"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredDesigns.filter(d => !d.isVisible).length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-2">
                                    <Package className="w-12 h-12 mx-auto" />
                                </div>
                                <p className="text-gray-500 text-sm">No configuration designs found</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {searchTerm || visibilityFilter !== 'all' || lensFilter !== 'all'
                                        ? "Try adjusting your search or filters" 
                                        : "Configuration designs are used for internal setup and are not visible to customers"}
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
    );
};

export default DesignsList;