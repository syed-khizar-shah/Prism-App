import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, FileText, User, CreditCard, Package, Calendar, DollarSign, Check, X } from 'lucide-react';
import OrdersAPI from './OrdersAPI';
import axios from 'axios';
import { PRISM_URL } from '../../../constants/urls';


export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [selectedPatientLabel, setSelectedPatientLabel] = useState('');
  const [results, setResults] = useState([]);
  const [prismLoading, setPrismLoading] = useState(false);
  const [isSelectingPatient, setIsSelectingPatient] = useState(false);

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


  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!isSelectingPatient || !search.trim()) {
        setResults([]);
        return;
      }

      try {
        setPrismLoading(true);

        const res = await axios.get(
          `${PRISM_URL}/api/patient/search-lite?value=${search}`
        );
        console.log({ res })

        setResults(res.data || []);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setPrismLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search, isSelectingPatient]);

  useEffect(() => {
    console.log("ORDER:", order);
    console.log("PRISM ID:", order?.customer?.prismId);
    if (!order?.customer?.prismId) return;

    const loadSelectedPatient = async () => {
      try {
        const res = await axios.get(
          `${PRISM_URL}/api/patient/${order.customer.prismId}`
        );

        const match = res.data;
        setSelectedPatientLabel(`${match.forename} ${match.surname} (ID: ${match.ID})`);
      } catch (err) {
        console.error(err);
        setSelectedPatientLabel(''); // optional fallback
      }
    };

    loadSelectedPatient();
  }, [order?.customer?.prismId]);

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
                  {['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'].map(s => (
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
                      disabled
                      onChange={(e) => setOrder({ ...order, payment: { ...order.payment, method: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                      <input
                        type="number"
                        disabled
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
                      disabled
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
                  disabled
                  onChange={(e) => setOrder({ ...order, customer: { ...order.customer, name: e.target.value } })}
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Prism Patient
                </label>

                {!isSelectingPatient ? (
                  <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer bg-gray-50"
                    onClick={() => setIsSelectingPatient(true)}
                  >
                    {order?.customer?.prismId ? selectedPatientLabel : "Select patient"}
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Search by name or ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      value={search}
                      autoFocus
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setIsSelectingPatient(false);
                          setResults([]);
                        }
                      }}
                    />

                    {(prismLoading || results.length > 0) && (
                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">

                        {prismLoading && (
                          <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            Searching...
                          </div>
                        )}

                        {!prismLoading && results.length === 0 && search && (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No results found
                          </div>
                        )}

                        {!prismLoading &&
                          results.map((p) => (
                            <div
                              key={p._id}
                              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setOrder({
                                  ...order,
                                  customer: {
                                    ...order.customer,
                                    prismId: p._id, // mapping Prism ID -> your prismId field
                                  },
                                });

                                setSearch(``);
                                setSelectedPatientLabel(`${p.name} (ID: ${p.ID})`);
                                setResults([]);
                                setIsSelectingPatient(false);
                              }}
                            >
                              {p.name} (ID: {p.ID})
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                  value={order.customer?.email || ''}
                  disabled
                  onChange={(e) => setOrder({ ...order, customer: { ...order.customer, email: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                  value={order.customer?.phone || ''}
                  disabled
                  onChange={(e) => setOrder({ ...order, customer: { ...order.customer, phone: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                  value={order.customer?.address.address || ''}
                  disabled
                  onChange={(e) => setOrder({ ...order, customer: { ...order.customer, address: { ...order.customer.address, address: e.target.value } } })}
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
                    disabled
                    onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, subtotal: Number(e.target.value) } })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Sight Test</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                  <input
                    type="number"
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                    value={order.pricing?.sightTestFee ?? ''}
                    disabled
                    onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, sightTestFee: Number(e.target.value) } })}
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
                    disabled
                    onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
                  />
                </div>
              </div>
              <div className='border border-gray-200 p-2 rounded-md space-y-2'>
                <label className="block text-xs font-medium text-gray-800 mb-1">Discounts</label>
                <div className='flex gap-2 align-middle'>
                  <div className='my-auto text-xs font-medium text-gray-800 w-1/4'>
                    Promos
                  </div>
                  <div className="relative w-3/4">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                    <input
                      type="number"
                      className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                      value={order.pricing?.discounts?.promo ?? ''}
                      disabled
                      onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
                    />
                  </div>
                </div>
                <div className='flex gap-2 align-middle'>
                  <div className='my-auto text-xs font-medium text-gray-800 w-1/4'>
                    NHS Gos3
                  </div>
                  <div className="relative w-3/4">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
                    <input
                      type="number"
                      className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                      value={order.pricing?.discounts?.nhsgos3 ?? ''}
                      disabled
                      onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
                    />
                  </div>
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
                    disabled
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
                    disabled
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
                    disabled
                    onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, totalPrice: Number(e.target.value) } })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
          </div>
          <div className="bg-gray-50 text-left border border-gray-200 rounded-lg py-4 px-8 text-gray-700 min-h-[60px]">
            {order.notes ? (
              <p className="whitespace-pre-line">{order.notes}</p>
            ) : (
              <span className="text-gray-400 italic">No notes added.</span>
            )}
          </div>
        </div>


        {/* Selections Section */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Order Selections</h3>
          </div>
          <SelectionsTable order={order} />
        </div>
      </div>
    </div>
  );
}


const SelectionsTable = ({ order }) => {
  if (!order?.selections?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {order.selections.map((selection, index) => (
        <div key={selection.id || index}>
          <SelectionTable data={selection} />
        </div>
      ))}
    </div>
  );
};


const SelectionTable = ({ data }) => {
  if (!data) return null;

  const rows = [
    { label: "Age Group", value: data.ageGroup?.name, price: data.ageGroup?.price },
    { label: "Lens Type", value: data.lensType?.name, price: data.lensType?.price },
    { label: "Lens Subtype", value: data.lensSubtype?.name, price: data.lensSubtype?.price },
    {
      label: "Power Range",
      value: data.powerMap?.min != null && data.powerMap?.max != null
        ? `${data.powerMap.min} to ${data.powerMap.max}`
        : null,
      price: null
    },
    { label: "Recommended Lens", value: data.recommendedLens?.name, price: data.recommendedLens?.price },
    { label: "Design", value: data.design?.name, price: data.design?.price },
    { label: "Extras", value: data.extras?.name, price: data.extras?.price },
    {
      label: "Color",
      value: data.color ? (
        <div className="flex items-center gap-2">
          {data.color.name}
          <span
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: data.color.code }}
          />
        </div>
      ) : null,
      price: null,
    },
  ];

  if (data.frameData) {
    Object.values(data.frameData).forEach((item) => {
      rows.push({
        label: item.name,
        value: item.value,
        price: null,
      });
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">{data.name || "Selection"}</h2>

      <table className="w-full text-left table-auto border-collapse">
        <thead>
          <tr className="border border-gray-300">
            <th className="py-2 px-3 text-gray-500 ">Item</th>
            <th className="py-2 px-3 text-gray-500">Value</th>
            <th className="py-2 px-3 text-gray-500">Price (£)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const isMissing = row.value === null || row.value === undefined;
            const textClass = isMissing ? "text-gray-400" : "text-gray-900";

            return (
              <tr key={idx} className={"bg-gray-50 border border-gray-300"}>
                <td className={`py-2 px-3 ${isMissing ? "text-gray-400" : "text-gray-700"}`}>
                  {row.label}
                </td>
                <td className={`py-2 px-3 ${textClass}`}>
                  {isMissing ? "-" : row.value}
                </td>
                <td className={`py-2 px-3 ${textClass}`}>
                  {row.price != null ? row.price : "-"}
                </td>
              </tr>
            );
          })}

          <tr className="border-t border-gray-300 font-semibold">
            <td className="py-2 px-3">Total</td>
            <td className="py-2 px-3"></td>
            <td className="py-2 px-3">{data.selectionPrice}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};



