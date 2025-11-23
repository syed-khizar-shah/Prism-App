import { Search, Check, X, Percent, DollarSign, Calendar, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import PromoAPI from "./PromoAPI";


export const PromoList = ({ promos = [], onEdit, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [validationCode, setValidationCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);

  const filteredPromos = promos.filter(promo =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleValidatePromo = async () => {
    if (!validationCode.trim()) return;

    setValidationLoading(true);

    try {
      const result = await PromoAPI.validatePromo(validationCode);

      // result already contains valid, discountType, discountValue, message
      setValidationResult(result);
    } catch (error) {
      setValidationResult({ valid: false, message: error.message });
    } finally {
      setValidationLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (promo) => {
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);

    if (!promo.isActive) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
    }
    if (now < start) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Upcoming</span>;
    }
    if (now > end) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>;
    }
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Limit Reached</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
  };

  // Only use filteredPromos, remove mockPromos logic
  const displayPromos = filteredPromos;

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-medium text-gray-900">Promo Codes</h2>
              <p className="text-sm text-gray-500 mt-1">Manage and monitor your promotional offers</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search promo codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Validate Promo */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Test promo code"
                value={validationCode}
                onChange={(e) => setValidationCode(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              />
              <button
                onClick={handleValidatePromo}
                disabled={validationLoading}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                {validationLoading ? '...' : 'Validate'}
              </button>
            </div>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div className={`p-4 rounded-md border-l-4 ${validationResult.valid
                ? 'bg-green-50 border-green-400 text-green-700'
                : 'bg-red-50 border-red-400 text-red-700'
              }`}>
              {validationResult.valid ? (
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Valid promo code! Discount: {validationResult.discountValue}{validationResult.discountType === 'percentage' ? '%' : '£'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">{validationResult.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Promos Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayPromos.map((promo) => (
              <tr key={promo._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {promo.code}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">{promo.description || '—'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    {promo.discountType === 'percentage' ? (
                      <>
                        <Percent className="w-4 h-4 mr-1 text-gray-500" />
                        {promo.discountValue}%
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-gray-500 mr-1">£</span>
                        {promo.discountValue}
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mr-1 mt-0.5 text-gray-400" />
                    <div className="space-y-1">
                      <div>{formatDate(promo.startDate)}</div>
                      <div className="text-xs">to {formatDate(promo.endDate)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{promo.usedCount}</div>
                    <div className="text-xs">of {promo.usageLimit || '∞'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(promo)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit && onEdit(promo)}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded transition-colors"
                      title="Edit promo"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(promo._id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded transition-colors"
                      title="Delete promo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {displayPromos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 text-sm">No promo codes found</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};