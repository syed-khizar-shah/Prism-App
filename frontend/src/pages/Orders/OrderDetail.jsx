import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, FileText, User, CreditCard, Package, Calendar, DollarSign, Check, X } from 'lucide-react';
import OrdersAPI from './OrdersAPI';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await OrdersAPI.getOrderById(id);
      console.log(data)
      setOrder(data.order);
    } catch (e) {
      setError(e.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await OrdersAPI.updateOrder(id, order);
      await fetchOrder();
      alert('Order updated');
    } catch (e) {
      alert(e.message || 'Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await OrdersAPI.updateStatus(id, newStatus);
      await fetchOrder();
    } catch (e) {
      alert(e.message || 'Failed to update status');
    }
  };

  const handleReceipt = async () => {
    try {
      const blob = await OrdersAPI.downloadReceipt(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order-${order?.orderId || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message || 'Failed to download receipt');
    }
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

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-sm text-gray-500 mt-2">
                Order {order.orderId || id} • Placed {order.orderDate ? new Date(order.orderDate).toLocaleString() : ''}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate(-1)} 
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </button>
              <button 
                onClick={handleReceipt} 
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Download Receipt
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status and Payment Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                >
                  {['pending','confirmed','processing','completed','cancelled','refunded'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-6 w-6 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-3 h-3 text-green-600" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">Payment Information</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Method</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                      value={order.payment?.method || ''}
                      onChange={(e) => setOrder({ ...order, payment: { ...order.payment, method: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                      <input
                        type="number"
                        className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        value={order.payment?.amount ?? ''}
                        onChange={(e) => setOrder({ ...order, payment: { ...order.payment, amount: Number(e.target.value) } })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Transaction ID</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                      value={order.payment?.transactionId || ''}
                      onChange={(e) => setOrder({ ...order, payment: { ...order.payment, transactionId: e.target.value } })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                  value={order.customer?.name || ''}
                  onChange={(e) => setOrder({ ...order, customer: { ...order.customer, name: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                  value={order.customer?.email || ''}
                  onChange={(e) => setOrder({ ...order, customer: { ...order.customer, email: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                  value={order.customer?.phone || ''}
                  onChange={(e) => setOrder({ ...order, customer: { ...order.customer, phone: e.target.value } })}
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Pricing Details</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Subtotal</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                  <input
                    type="number"
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                    value={order.pricing?.subtotal ?? ''}
                    onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, subtotal: Number(e.target.value) } })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Discount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                  <input
                    type="number"
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                    value={order.pricing?.discount ?? ''}
                    onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tax</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                  <input
                    type="number"
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                    value={order.pricing?.tax ?? ''}
                    onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, tax: Number(e.target.value) } })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Shipping</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                  <input
                    type="number"
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                    value={order.pricing?.shipping ?? ''}
                    onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, shipping: Number(e.target.value) } })}
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                  <input
                    type="number"
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm font-medium bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                    value={order.pricing?.totalPrice ?? ''}
                    onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, totalPrice: Number(e.target.value) } })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selections Section */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Order Selections</h3>
          </div>
          
          <div className="space-y-4">
            {(order.selections || []).map((selection, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-gray-900">{selection.name || selection.id || `Selection ${idx + 1}`}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {typeof selection.selectionPrice === 'number' ? `$${selection.selectionPrice.toFixed(2)}` : ''}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-gray-600">Age:</span> {selection.ageGroup?.name || 'N/A'}</div>
                  <div><span className="text-gray-600">Type:</span> {selection.lensType?.name || 'N/A'}</div>
                  <div><span className="text-gray-600">Subtype:</span> {selection.lensSubtype?.name || 'N/A'}</div>
                  <div><span className="text-gray-600">Design:</span> {selection.design?.name || 'N/A'}</div>
                  <div><span className="text-gray-600">Coatings:</span> {selection.coatings?.name || 'N/A'}</div>
                  <div><span className="text-gray-600">Extras:</span> {selection.extras?.name || 'N/A'}</div>
                  <div><span className="text-gray-600">Color:</span> {selection.color?.name || 'N/A'}</div>
                  {selection.powerMap && (
                    <div><span className="text-gray-600">Power:</span> {selection.powerMap.min} - {selection.powerMap.max}</div>
                  )}
                </div>
              </div>
            ))}
            {(!order.selections || order.selections.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No selections found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
