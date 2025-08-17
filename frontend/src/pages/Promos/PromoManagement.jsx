import { Plus, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import PromoAPI from "./PromoAPI";
import PromoForm from "./PromoForm";
import { PromoList } from "./PromoList";

const PromoManagement = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const data = await PromoAPI.getPromos();
      setPromos(data);
    } catch (error) {
      console.error('Failed to fetch promos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromo = async (promoData) => {
    const newPromo = await PromoAPI.createPromo(promoData);
    setPromos(prev => [newPromo, ...prev]);
    setShowForm(false);
  };

  const handleUpdatePromo = async (promoData) => {
    const updatedPromo = await PromoAPI.updatePromo(editingPromo._id, promoData);
    setPromos(prev => prev.map(p => p._id === editingPromo._id ? updatedPromo : p));
    setEditingPromo(null);
    setShowForm(false);
  };

  const handleEditPromo = (promo) => {
    setEditingPromo(promo);
    setShowForm(true);
  };

  const handleDeletePromo = async (id) => {
    if (window.confirm('Are you sure you want to delete this promo?')) {
      await PromoAPI.deletePromo(id);
      setPromos(prev => prev.filter(p => p._id !== id));
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPromo(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Promo Management</h1>
              <p className="text-sm text-gray-500 mt-2">
                Create, manage, and monitor your promotional offers
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
                  <Plus className="w-4 h-4" />
                  Add Promo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <PromoForm
            promo={editingPromo}
            onSubmit={editingPromo ? handleUpdatePromo : handleCreatePromo}
            onCancel={handleCancelForm}
            isEdit={!!editingPromo}
          />
        )}

        {/* List Section */}
        <PromoList
          promos={promos}
          onEdit={handleEditPromo}
          onDelete={handleDeletePromo}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default PromoManagement;