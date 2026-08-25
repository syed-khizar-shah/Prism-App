// // import { useEffect, useState } from 'react';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import { ArrowLeft, Save, FileText, User, CreditCard, Package, Calendar, DollarSign, Check, X } from 'lucide-react';
// // import OrdersAPI from './OrdersAPI';
// // import axios from 'axios';
// // import { PRISM_URL } from '../../../constants/urls';


// // export default function OrderDetail() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [order, setOrder] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState('');

// //   const [search, setSearch] = useState('');
// //   const [selectedPatientLabel, setSelectedPatientLabel] = useState('');
// //   const [results, setResults] = useState([]);
// //   const [prismLoading, setPrismLoading] = useState(false);
// //   const [isSelectingPatient, setIsSelectingPatient] = useState(false);

// //   const fetchOrder = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
// //       const data = await OrdersAPI.getOrderById(id);
// //       console.log(data)
// //       setOrder(data.order);
// //     } catch (e) {
// //       setError(e.message || 'Failed to load order');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchOrder();
// //   }, [id]);


// //   useEffect(() => {
// //     const delay = setTimeout(async () => {
// //       if (!isSelectingPatient || !search.trim()) {
// //         setResults([]);
// //         return;
// //       }

// //       try {
// //         setPrismLoading(true);

// //         const res = await axios.get(
// //           `${PRISM_URL}/api/patient/search-lite?value=${search}`
// //         );
// //         console.log({ res })

// //         setResults(res.data || []);
// //       } catch (error) {
// //         console.error(error);
// //         setResults([]);
// //       } finally {
// //         setPrismLoading(false);
// //       }
// //     }, 300);

// //     return () => clearTimeout(delay);
// //   }, [search, isSelectingPatient]);

// //   useEffect(() => {
// //     console.log("ORDER:", order);
// //     console.log("PRISM ID:", order?.customer?.prismId);
// //     if (!order?.customer?.prismId) return;

// //     const loadSelectedPatient = async () => {
// //       try {
// //         const res = await axios.get(
// //           `${PRISM_URL}/api/patient/${order.customer.prismId}`
// //         );

// //         const match = res.data;
// //         setSelectedPatientLabel(`${match.forename} ${match.surname} (ID: ${match.ID})`);
// //       } catch (err) {
// //         console.error(err);
// //         setSelectedPatientLabel(''); // optional fallback
// //       }
// //     };

// //     loadSelectedPatient();
// //   }, [order?.customer?.prismId]);

// //   const handleSave = async () => {
// //     try {
// //       setSaving(true);
// //       await OrdersAPI.updateOrder(id, order);
// //       await fetchOrder();
// //       alert('Order updated');
// //     } catch (e) {
// //       alert(e.message || 'Failed to update order');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     try {
// //       setSaving(true);
// //       await OrdersAPI.deleteOrder(id);
// //       navigate(-1);
// //     } catch (e) {
// //       alert(e.message || 'Failed to update order');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleStatusChange = async (newStatus) => {
// //     try {
// //       await OrdersAPI.updateStatus(id, newStatus);
// //       await fetchOrder();
// //     } catch (e) {
// //       alert(e.message || 'Failed to update status');
// //     }
// //   };

// //   const handleReceipt = async () => {
// //     try {
// //       const blob = await OrdersAPI.downloadReceipt(id);
// //       const url = window.URL.createObjectURL(blob);
// //       const a = document.createElement('a');
// //       a.href = url;
// //       a.download = `order-${order?.orderId || id}.pdf`;
// //       document.body.appendChild(a);
// //       a.click();
// //       a.remove();
// //       window.URL.revokeObjectURL(url);
// //     } catch (e) {
// //       alert(e.message || 'Failed to download receipt');
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen">
// //         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-center items-center py-16">
// //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen">
// //         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
// //           <div className="bg-red-50 border border-red-200 rounded-md p-6">
// //             <p className="text-red-600 text-sm">{error}</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!order) return null;

// //   return (
// //     <div className="min-h-screen">
// //       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
// //               <p className="text-sm text-gray-500 mt-2">
// //                 Order {order.orderId || id} • Placed {order.orderDate ? new Date(order.orderDate).toLocaleString() : ''}
// //               </p>
// //             </div>
// //             <div className="flex gap-3">
// //               <button
// //                 onClick={() => navigate(-1)}
// //                 className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
// //               >
// //                 <ArrowLeft className="w-4 h-4" />
// //                 Back to Orders
// //               </button>
// //               <button
// //                 onClick={handleReceipt}
// //                 className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
// //               >
// //                 <FileText className="w-4 h-4" />
// //                 Download Receipt
// //               </button>
// //               <button
// //                 onClick={handleSave}
// //                 disabled={saving}
// //                 className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //               >
// //                 {saving ? (
// //                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
// //                 ) : (
// //                   <Save className="w-4 h-4" />
// //                 )}
// //                 {saving ? 'Saving...' : 'Save Changes'}
// //               </button>

// //               {/* <button
// //                 onClick={handleDelete}
// //                 className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //               >
// //                 Delete Order
// //               </button> */}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* Status and Payment Section */}
// //           <div className="bg-white border border-gray-200 rounded-lg p-6">
// //             <div className="flex items-center gap-3 mb-4">
// //               <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
// //                 <Package className="w-4 h-4 text-blue-600" />
// //               </div>
// //               <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
// //             </div>

// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
// //                 <select
// //                   value={order.status}
// //                   onChange={(e) => handleStatusChange(e.target.value)}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                 >
// //                   {['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'].map(s => (
// //                     <option key={s} value={s}>{s}</option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="pt-4 border-t border-gray-100">
// //                 <div className="flex items-center gap-3 mb-4">
// //                   <div className="h-6 w-6 bg-green-100 rounded-lg flex items-center justify-center">
// //                     <CreditCard className="w-3 h-3 text-green-600" />
// //                   </div>
// //                   <h4 className="text-sm font-medium text-gray-900">Payment Information</h4>
// //                 </div>

// //                 <div className="space-y-3">
// //                   <div>
// //                     <label className="block text-xs font-medium text-gray-600 mb-1">Method</label>
// //                     <input
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                       value={order.payment?.method || ''}
// //                       disabled
// //                       onChange={(e) => setOrder({ ...order, payment: { ...order.payment, method: e.target.value } })}
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
// //                     <div className="relative">
// //                       <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
// //                       <input
// //                         type="number"
// //                         disabled
// //                         className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                         value={order.payment?.amount ?? ''}
// //                         onChange={(e) => setOrder({ ...order, payment: { ...order.payment, amount: Number(e.target.value) } })}
// //                       />
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <label className="block text-xs font-medium text-gray-600 mb-1">Transaction ID</label>
// //                     <input
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                       value={order.payment?.transactionId || ''}
// //                       disabled
// //                       onChange={(e) => setOrder({ ...order, payment: { ...order.payment, transactionId: e.target.value } })}
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Customer Information Section */}
// //           <div className="bg-white border border-gray-200 rounded-lg p-6">
// //             <div className="flex items-center gap-3 mb-4">
// //               <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
// //                 <User className="w-4 h-4 text-purple-600" />
// //               </div>
// //               <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
// //             </div>

// //             <div className="space-y-3">
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
// //                 <input
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                   value={order.customer?.name || ''}
// //                   disabled
// //                   onChange={(e) => setOrder({ ...order, customer: { ...order.customer, name: e.target.value } })}
// //                 />
// //               </div>
// //               <div className="relative">
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">
// //                   Prism Patient
// //                 </label>

// //                 {!isSelectingPatient ? (
// //                   <div
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer bg-gray-50"
// //                     onClick={() => setIsSelectingPatient(true)}
// //                   >
// //                     {order?.customer?.prismId ? selectedPatientLabel : "Select patient"}
// //                   </div>
// //                 ) : (
// //                   <>
// //                     <input
// //                       type="text"
// //                       placeholder="Search by name or ID"
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
// //                       value={search}
// //                       autoFocus
// //                       onChange={(e) => setSearch(e.target.value)}
// //                       onKeyDown={(e) => {
// //                         if (e.key === "Escape") {
// //                           setIsSelectingPatient(false);
// //                           setResults([]);
// //                         }
// //                       }}
// //                     />

// //                     {(prismLoading || results.length > 0) && (
// //                       <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">

// //                         {prismLoading && (
// //                           <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
// //                             <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
// //                             Searching...
// //                           </div>
// //                         )}

// //                         {!prismLoading && results.length === 0 && search && (
// //                           <div className="px-3 py-2 text-sm text-gray-500">
// //                             No results found
// //                           </div>
// //                         )}

// //                         {!prismLoading &&
// //                           results.map((p) => (
// //                             <div
// //                               key={p._id}
// //                               className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
// //                               onClick={() => {
// //                                 setOrder({
// //                                   ...order,
// //                                   customer: {
// //                                     ...order.customer,
// //                                     prismId: p._id, // mapping Prism ID -> your prismId field
// //                                   },
// //                                 });

// //                                 setSearch(``);
// //                                 setSelectedPatientLabel(`${p.name} (ID: ${p.ID})`);
// //                                 setResults([]);
// //                                 setIsSelectingPatient(false);
// //                               }}
// //                             >
// //                               {p.name} (ID: {p.ID})
// //                             </div>
// //                           ))}
// //                       </div>
// //                     )}
// //                   </>
// //                 )}
// //               </div>
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
// //                 <input
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                   value={order.customer?.email || ''}
// //                   disabled
// //                   onChange={(e) => setOrder({ ...order, customer: { ...order.customer, email: e.target.value } })}
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
// //                 <input
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                   value={order.customer?.phone || ''}
// //                   disabled
// //                   onChange={(e) => setOrder({ ...order, customer: { ...order.customer, phone: e.target.value } })}
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
// //                 <input
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                   value={order.customer?.address.address || ''}
// //                   disabled
// //                   onChange={(e) => setOrder({ ...order, customer: { ...order.customer, address: { ...order.customer.address, address: e.target.value } } })}
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Pricing Section */}
// //           <div className="bg-white border border-gray-200 rounded-lg p-6">
// //             <div className="flex items-center gap-3 mb-4">
// //               <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
// //                 <DollarSign className="w-4 h-4 text-green-600" />
// //               </div>
// //               <h3 className="text-lg font-medium text-gray-900">Pricing Details</h3>
// //             </div>

// //             <div className="space-y-3">
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Subtotal</label>
// //                 <div className="relative">
// //                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
// //                   <input
// //                     type="number"
// //                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                     value={order.pricing?.subtotal ?? ''}
// //                     disabled
// //                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, subtotal: Number(e.target.value) } })}
// //                   />
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Sight Test</label>
// //                 <div className="relative">
// //                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
// //                   <input
// //                     type="number"
// //                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                     value={order.pricing?.sightTestFee ?? ''}
// //                     disabled
// //                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, sightTestFee: Number(e.target.value) } })}
// //                   />
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Discount</label>
// //                 <div className="relative">
// //                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
// //                   <input
// //                     type="number"
// //                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                     value={order.pricing?.discount ?? ''}
// //                     disabled
// //                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
// //                   />
// //                 </div>
// //               </div>
// //               <div className='border border-gray-200 p-2 rounded-md space-y-2'>
// //                 <label className="block text-xs font-medium text-gray-800 mb-1">Discounts</label>

// //                 <div className='flex gap-2 align-middle'>
// //                   <div className='my-auto text-left text-xs font-medium text-gray-800 w-3/4'>
// //                     Promos
// //                   </div>
// //                   <div className="relative w-1/4">
// //                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
// //                     <input
// //                       type="number"
// //                       className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                       value={order.pricing?.discounts?.promo ?? ''}
// //                       disabled
// //                       onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className='flex gap-2 align-middle'>
// //                   <div className='my-auto text-left text-xs font-medium text-gray-800 w-3/4'>
// //                     NHS Gos3
// //                   </div>
// //                   <div className="relative w-1/4">
// //                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
// //                     <input
// //                       type="number"
// //                       className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                       value={order.pricing?.discounts?.nhsgos3 ?? ''}
// //                       disabled
// //                       onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className='flex gap-2 align-middle'>
// //                   <div className='my-auto text-left text-xs font-medium text-gray-800 w-3/4'>
// //                     Checkout <span className='text-xs text-gray-400'>
// //                       ({(order.pricing?.checkoutDiscountType ?? 'fixed') === 'percentage'
// //                         ? `${order.pricing?.checkoutDiscountValue ?? 0}% off`
// //                         : `$${order.pricing?.checkoutDiscountValue ?? 0} off`})
// //                     </span>
// //                   </div>
// //                   <div className="relative w-1/4">
// //                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
// //                     <input
// //                       type="number"
// //                       className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                       value={order.pricing?.discounts?.checkout ?? ''}
// //                       disabled
// //                       onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
// //                     />
// //                   </div>
// //                 </div>

// //               </div>
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Tax</label>
// //                 <div className="relative">
// //                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
// //                   <input
// //                     type="number"
// //                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                     value={order.pricing?.tax ?? ''}
// //                     disabled
// //                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, tax: Number(e.target.value) } })}
// //                   />
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Shipping</label>
// //                 <div className="relative">
// //                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
// //                   <input
// //                     type="number"
// //                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                     value={order.pricing?.shipping ?? ''}
// //                     disabled
// //                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, shipping: Number(e.target.value) } })}
// //                   />
// //                 </div>
// //               </div>
// //               <div className="pt-2 border-t border-gray-100">
// //                 <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
// //                 <div className="relative">
// //                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
// //                   <input
// //                     type="number"
// //                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm font-medium bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
// //                     value={order.pricing?.totalPrice ?? ''}
// //                     disabled
// //                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, totalPrice: Number(e.target.value) } })}
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="mt-6">
// //           <div className="flex items-center gap-3 mb-4">
// //             <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
// //               <Package className="w-4 h-4 text-orange-600" />
// //             </div>
// //             <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
// //           </div>
// //           <div className="bg-gray-50 text-left border border-gray-200 rounded-lg py-4 px-8 text-gray-700 min-h-[60px]">
// //             {order.notes ? (
// //               <p className="whitespace-pre-line">{order.notes}</p>
// //             ) : (
// //               <span className="text-gray-400 italic">No notes added.</span>
// //             )}
// //           </div>
// //         </div>


// //         {/* Selections Section */}
// //         <div className="mt-6">
// //           <div className="flex items-center gap-3 mb-4">
// //             <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
// //               <Package className="w-4 h-4 text-orange-600" />
// //             </div>
// //             <h3 className="text-lg font-medium text-gray-900">Order Selections</h3>
// //           </div>
// //           <SelectionsTable order={order} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ArrowLeft, Save, FileText, User, CreditCard, Package, DollarSign, Plus } from 'lucide-react';
// import OrdersAPI from './OrdersAPI';
// import axios from 'axios';
// import { PRISM_URL } from '../../../constants/urls';

// const PAYMENT_METHODS = ['Cash', 'Card', 'Bank Transfer', 'Cheque', 'Other'];
// const PAYMENT_TYPES = ['deposit', 'balance', 'partial', 'full', 'refund'];

// const STATUS_STYLES = {
//   unpaid: 'bg-gray-100 text-gray-700',
//   deposit_paid: 'bg-blue-100 text-blue-700',
//   partially_paid: 'bg-yellow-100 text-yellow-700',
//   paid: 'bg-green-100 text-green-700',
//   refunded: 'bg-red-100 text-red-700',
// };

// export default function OrderDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   const [search, setSearch] = useState('');
//   const [selectedPatientLabel, setSelectedPatientLabel] = useState('');
//   const [results, setResults] = useState([]);
//   const [prismLoading, setPrismLoading] = useState(false);
//   const [isSelectingPatient, setIsSelectingPatient] = useState(false);

//   const [paymentForm, setPaymentForm] = useState({ type: 'balance', method: 'Cash', amount: '', notes: '' });
//   const [addingPayment, setAddingPayment] = useState(false);
//   const [paymentError, setPaymentError] = useState('');

//   const fetchOrder = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const data = await OrdersAPI.getOrderById(id);
//       setOrder(data.order);
//     } catch (e) {
//       setError(e.message || 'Failed to load order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();
//   }, [id]);

//   useEffect(() => {
//     const delay = setTimeout(async () => {
//       if (!isSelectingPatient || !search.trim()) {
//         setResults([]);
//         return;
//       }

//       try {
//         setPrismLoading(true);
//         const res = await axios.get(
//           `${PRISM_URL}/api/patient/search-lite?value=${search}`
//         );
//         setResults(res.data || []);
//       } catch (error) {
//         console.error(error);
//         setResults([]);
//       } finally {
//         setPrismLoading(false);
//       }
//     }, 300);

//     return () => clearTimeout(delay);
//   }, [search, isSelectingPatient]);

//   useEffect(() => {
//     if (!order?.customer?.prismId) return;

//     const loadSelectedPatient = async () => {
//       try {
//         const res = await axios.get(
//           `${PRISM_URL}/api/patient/${order.customer.prismId}`
//         );
//         const match = res.data;
//         setSelectedPatientLabel(`${match.forename} ${match.surname} (ID: ${match.ID})`);
//       } catch (err) {
//         console.error(err);
//         setSelectedPatientLabel('');
//       }
//     };

//     loadSelectedPatient();
//   }, [order?.customer?.prismId]);

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       await OrdersAPI.updateOrder(id, order);
//       await fetchOrder();
//       alert('Order updated');
//     } catch (e) {
//       alert(e.message || 'Failed to update order');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       setSaving(true);
//       await OrdersAPI.deleteOrder(id);
//       navigate(-1);
//     } catch (e) {
//       alert(e.message || 'Failed to update order');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleStatusChange = async (newStatus) => {
//     try {
//       await OrdersAPI.updateStatus(id, newStatus);
//       await fetchOrder();
//     } catch (e) {
//       alert(e.message || 'Failed to update status');
//     }
//   };

//   const handleReceipt = async () => {
//     try {
//       const blob = await OrdersAPI.downloadReceipt(id);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `order-${order?.orderId || id}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (e) {
//       alert(e.message || 'Failed to download receipt');
//     }
//   };

//   const handleAddPayment = async () => {
//     const amount = Number(paymentForm.amount);

//     if (!paymentForm.method || !amount || amount <= 0) {
//       setPaymentError('Enter a valid method and a positive amount');
//       return;
//     }

//     try {
//       setAddingPayment(true);
//       setPaymentError('');
//       await OrdersAPI.addPayment(id, {
//         type: paymentForm.type,
//         method: paymentForm.method,
//         amount,
//         notes: paymentForm.notes || undefined,
//       });
//       setPaymentForm({ type: 'balance', method: 'Cash', amount: '', notes: '' });
//       await fetchOrder();
//     } catch (e) {
//       setPaymentError(e.response?.data?.error || e.message || 'Failed to add payment');
//     } finally {
//       setAddingPayment(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-center items-center py-16">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <div className="bg-red-50 border border-red-200 rounded-md p-6">
//             <p className="text-red-600 text-sm">{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!order) return null;

//   const paymentStatus = order.payment?.paymentStatus || 'unpaid';
//   const amountPaid = order.payment?.amountPaid ?? 0;
//   const balanceDue = order.payment?.balanceDue ?? (order.pricing?.totalPrice ?? 0);
//   const transactions = order.payment?.transactions || [];

//   console.log(order.payment)

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
//               <p className="text-sm text-gray-500 mt-2">
//                 Order {order.orderId || id} • Placed {order.orderDate ? new Date(order.orderDate).toLocaleString() : ''}
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back to Orders
//               </button>
//               <button
//                 onClick={handleReceipt}
//                 className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
//               >
//                 <FileText className="w-4 h-4" />
//                 Download Receipt
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {saving ? (
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 ) : (
//                   <Save className="w-4 h-4" />
//                 )}
//                 {saving ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Status and Payment Section */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <Package className="w-4 h-4 text-blue-600" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                 <select
//                   value={order.status}
//                   onChange={(e) => handleStatusChange(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                 >
//                   {['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'].map(s => (
//                     <option key={s} value={s}>{s}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="pt-4 border-t border-gray-100">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="h-6 w-6 bg-green-100 rounded-lg flex items-center justify-center">
//                     <CreditCard className="w-3 h-3 text-green-600" />
//                   </div>
//                   <h4 className="text-sm font-medium text-gray-900">Payment</h4>
//                 </div>

//                 {/* Summary */}
//                 <div className="flex items-center justify-between mb-4">
//                   <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[paymentStatus] || STATUS_STYLES.unpaid}`}>
//                     {paymentStatus.replace('_', ' ')}
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3 mb-4">
//                   <div className="bg-gray-50 rounded-md p-3">
//                     <div className="text-xs text-gray-500 mb-1">Amount Paid</div>
//                     <div className="text-sm font-semibold text-gray-900">${amountPaid.toFixed(2)}</div>
//                   </div>
//                   <div className="bg-gray-50 rounded-md p-3">
//                     <div className="text-xs text-gray-500 mb-1">Balance Due</div>
//                     <div className={`text-sm font-semibold ${balanceDue > 0 ? 'text-red-600' : 'text-gray-900'}`}>
//                       ${balanceDue.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Transaction history */}
//                 <div className="mb-4">
//                   <div className="text-xs font-medium text-gray-600 mb-2">Transaction History</div>
//                   {transactions.length === 0 ? (
//                     <div className="text-xs text-gray-400 italic">No payments recorded.</div>
//                   ) : (
//                     <div className="space-y-2 max-h-48 overflow-y-auto">
//                       {transactions.map((t) => (
//                         <div key={t._id || `${t.paymentDate}-${t.amount}`} className="flex items-center justify-between border border-gray-100 rounded-md px-3 py-2">
//                           <div>
//                             <div className="text-sm text-gray-900 capitalize">
//                               {t.type} · {t.method}
//                             </div>
//                             <div className="text-xs text-gray-400">
//                               {t.paymentDate ? new Date(t.paymentDate).toLocaleString() : ''}
//                               {t.notes ? ` · ${t.notes}` : ''}
//                             </div>
//                           </div>
//                           <div className={`text-sm font-medium ${t.type === 'refund' ? 'text-red-600' : 'text-gray-900'}`}>
//                             {t.type === 'refund' ? '-' : ''}${Number(t.amount).toFixed(2)}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Add payment form */}
//                 <div className="border-t border-gray-100 pt-4">
//                   <div className="text-xs font-medium text-gray-600 mb-2">Add Payment</div>
//                   <div className="grid grid-cols-2 gap-2 mb-2">
//                     <select
//                       value={paymentForm.type}
//                       onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
//                       className="px-2 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
//                     >
//                       {PAYMENT_TYPES.map((t) => (
//                         <option key={t} value={t}>{t}</option>
//                       ))}
//                     </select>
//                     <select
//                       value={paymentForm.method}
//                       onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
//                       className="px-2 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
//                     >
//                       {PAYMENT_METHODS.map((m) => (
//                         <option key={m} value={m}>{m}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="relative mb-2">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
//                     <input
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       placeholder="Amount"
//                       value={paymentForm.amount}
//                       onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
//                       className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
//                     />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Notes (optional)"
//                     value={paymentForm.notes}
//                     onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
//                   />
//                   {paymentError && (
//                     <div className="text-xs text-red-600 mb-2">{paymentError}</div>
//                   )}
//                   <button
//                     onClick={handleAddPayment}
//                     disabled={addingPayment}
//                     className="inline-flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     {addingPayment ? (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     ) : (
//                       <Plus className="w-4 h-4" />
//                     )}
//                     {addingPayment ? 'Adding...' : 'Add Payment'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Customer Information Section */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <User className="w-4 h-4 text-purple-600" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
//             </div>

//             <div className="space-y-3">
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                   value={order.customer?.name || ''}
//                   disabled
//                   onChange={(e) => setOrder({ ...order, customer: { ...order.customer, name: e.target.value } })}
//                 />
//               </div>
//               <div className="relative">
//                 <label className="block text-xs font-medium text-gray-600 mb-1">
//                   Prism Patient
//                 </label>

//                 {!isSelectingPatient ? (
//                   <div
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer bg-gray-50"
//                     onClick={() => setIsSelectingPatient(true)}
//                   >
//                     {order?.customer?.prismId ? selectedPatientLabel : "Select patient"}
//                   </div>
//                 ) : (
//                   <>
//                     <input
//                       type="text"
//                       placeholder="Search by name or ID"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
//                       value={search}
//                       autoFocus
//                       onChange={(e) => setSearch(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Escape") {
//                           setIsSelectingPatient(false);
//                           setResults([]);
//                         }
//                       }}
//                     />

//                     {(prismLoading || results.length > 0) && (
//                       <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">

//                         {prismLoading && (
//                           <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
//                             <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
//                             Searching...
//                           </div>
//                         )}

//                         {!prismLoading && results.length === 0 && search && (
//                           <div className="px-3 py-2 text-sm text-gray-500">
//                             No results found
//                           </div>
//                         )}

//                         {!prismLoading &&
//                           results.map((p) => (
//                             <div
//                               key={p._id}
//                               className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//                               onClick={() => {
//                                 setOrder({
//                                   ...order,
//                                   customer: {
//                                     ...order.customer,
//                                     prismId: p._id,
//                                   },
//                                 });

//                                 setSearch(``);
//                                 setSelectedPatientLabel(`${p.name} (ID: ${p.ID})`);
//                                 setResults([]);
//                                 setIsSelectingPatient(false);
//                               }}
//                             >
//                               {p.name} (ID: {p.ID})
//                             </div>
//                           ))}
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                   value={order.customer?.email || ''}
//                   disabled
//                   onChange={(e) => setOrder({ ...order, customer: { ...order.customer, email: e.target.value } })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                   value={order.customer?.phone || ''}
//                   disabled
//                   onChange={(e) => setOrder({ ...order, customer: { ...order.customer, phone: e.target.value } })}
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                   value={order.customer?.address.address || ''}
//                   disabled
//                   onChange={(e) => setOrder({ ...order, customer: { ...order.customer, address: { ...order.customer.address, address: e.target.value } } })}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Pricing Section */}
//           <div className="bg-white border border-gray-200 rounded-lg p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
//                 <DollarSign className="w-4 h-4 text-green-600" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900">Pricing Details</h3>
//             </div>

//             <div className="space-y-3">
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Subtotal</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
//                   <input
//                     type="number"
//                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                     value={order.pricing?.subtotal ?? ''}
//                     disabled
//                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, subtotal: Number(e.target.value) } })}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Sight Test</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
//                   <input
//                     type="number"
//                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                     value={order.pricing?.sightTestFee ?? ''}
//                     disabled
//                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, sightTestFee: Number(e.target.value) } })}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Discount</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
//                   <input
//                     type="number"
//                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                     value={order.pricing?.discount ?? ''}
//                     disabled
//                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
//                   />
//                 </div>
//               </div>
//               <div className='border border-gray-200 p-2 rounded-md space-y-2'>
//                 <label className="block text-xs font-medium text-gray-800 mb-1">Discounts</label>

//                 <div className='flex gap-2 align-middle'>
//                   <div className='my-auto text-left text-xs font-medium text-gray-800 w-3/4'>
//                     Promos
//                   </div>
//                   <div className="relative w-1/4">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
//                     <input
//                       type="number"
//                       className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                       value={order.pricing?.discounts?.promo ?? ''}
//                       disabled
//                       onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
//                     />
//                   </div>
//                 </div>

//                 <div className='flex gap-2 align-middle'>
//                   <div className='my-auto text-left text-xs font-medium text-gray-800 w-3/4'>
//                     NHS Gos3
//                   </div>
//                   <div className="relative w-1/4">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
//                     <input
//                       type="number"
//                       className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                       value={order.pricing?.discounts?.nhsgos3 ?? ''}
//                       disabled
//                       onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
//                     />
//                   </div>
//                 </div>

//                 <div className='flex gap-2 align-middle'>
//                   <div className='my-auto text-left text-xs font-medium text-gray-800 w-3/4'>
//                     Checkout <span className='text-xs text-gray-400'>
//                       ({(order.pricing?.checkoutDiscountType ?? 'fixed') === 'percentage'
//                         ? `${order.pricing?.checkoutDiscountValue ?? 0}% off`
//                         : `$${order.pricing?.checkoutDiscountValue ?? 0} off`})
//                     </span>
//                   </div>
//                   <div className="relative w-1/4">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
//                     <input
//                       type="number"
//                       className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                       value={order.pricing?.discounts?.checkout ?? ''}
//                       disabled
//                       onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, discount: Number(e.target.value) } })}
//                     />
//                   </div>
//                 </div>

//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Tax</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
//                   <input
//                     type="number"
//                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                     value={order.pricing?.tax ?? ''}
//                     disabled
//                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, tax: Number(e.target.value) } })}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Shipping</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
//                   <input
//                     type="number"
//                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                     value={order.pricing?.shipping ?? ''}
//                     disabled
//                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, shipping: Number(e.target.value) } })}
//                   />
//                 </div>
//               </div>
//               <div className="pt-2 border-t border-gray-100">
//                 <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
//                   <input
//                     type="number"
//                     className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm font-medium bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
//                     value={order.pricing?.totalPrice ?? ''}
//                     disabled
//                     onChange={(e) => setOrder({ ...order, pricing: { ...order.pricing, totalPrice: Number(e.target.value) } })}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
//               <Package className="w-4 h-4 text-orange-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
//           </div>
//           <div className="bg-gray-50 text-left border border-gray-200 rounded-lg py-4 px-8 text-gray-700 min-h-[60px]">
//             {order.notes ? (
//               <p className="whitespace-pre-line">{order.notes}</p>
//             ) : (
//               <span className="text-gray-400 italic">No notes added.</span>
//             )}
//           </div>
//         </div>

//         {/* Selections Section */}
//         <div className="mt-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
//               <Package className="w-4 h-4 text-orange-600" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900">Order Selections</h3>
//           </div>
//           <SelectionsTable order={order} />
//         </div>
//       </div>
//     </div>
//   );
// }


// const SelectionsTable = ({ order }) => {
//   if (!order?.selections?.length) return null;

//   return (
//     <div className="grid grid-cols-2 gap-4">
//       {order.selections.map((selection, index) => (
//         <div key={selection.id || index}>
//           <SelectionTable data={selection} />
//         </div>
//       ))}
//     </div>
//   );
// };


// const SelectionTable = ({ data }) => {
//   if (!data) return null;

//   const rows = [
//     { label: "Age Group", value: data.ageGroup?.name, price: data.ageGroup?.price },
//     { label: "Lens Type", value: data.lensType?.name, price: data.lensType?.price },
//     { label: "Lens Subtype", value: data.lensSubtype?.name, price: data.lensSubtype?.price },
//     {
//       label: "Power Range",
//       value: data.powerMap?.min != null && data.powerMap?.max != null
//         ? `${data.powerMap.min} to ${data.powerMap.max}`
//         : null,
//       price: null
//     },
//     { label: "Recommended Lens", value: data.recommendedLens?.name, price: data.recommendedLens?.price },
//     { label: "Design", value: data.design?.name, price: data.design?.price },
//     { label: "Extras", value: data.extras?.name, price: data.extras?.price },
//     {
//       label: "Color",
//       value: data.color ? (
//         <div className="flex items-center gap-2">
//           {data.color.name}
//           <span
//             className="h-4 w-4 rounded-full border"
//             style={{ backgroundColor: data.color.code }}
//           />
//         </div>
//       ) : null,
//       price: null,
//     },

//     { label: "RE PD", value: data.rePd, price: null },
//     { label: "LE PD", value: data.lePd, price: null },
//     { label: "RE H", value: data.reH, price: null },
//     { label: "LE H", value: data.leH, price: null },
//   ];

//   if (data.frameData) {
//     Object.values(data.frameData).forEach((item) => {
//       rows.push({
//         label: item.name,
//         value: item.value,
//         price: null,
//       });
//     });
//   }

//   return (
//     <div className="w-full max-w-2xl mx-auto bg-white rounded-xl p-6 border border-gray-200">
//       <h2 className="text-xl font-semibold mb-4">{data.name || "Selection"}</h2>

//       <table className="w-full text-left table-auto border-collapse">
//         <thead>
//           <tr className="border border-gray-300">
//             <th className="py-2 px-3 text-gray-500 ">Item</th>
//             <th className="py-2 px-3 text-gray-500">Value</th>
//             <th className="py-2 px-3 text-gray-500">Price (£)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row, idx) => {
//             const isMissing = row.value === null || row.value === undefined;
//             const textClass = isMissing ? "text-gray-400" : "text-gray-900";

//             return (
//               <tr key={idx} className={"bg-gray-50 border border-gray-300"}>
//                 <td className={`py-2 px-3 ${isMissing ? "text-gray-400" : "text-gray-700"}`}>
//                   {row.label}
//                 </td>
//                 <td className={`py-2 px-3 ${textClass}`}>
//                   {isMissing ? "-" : row.value}
//                 </td>
//                 <td className={`py-2 px-3 ${textClass}`}>
//                   {row.price != null ? row.price : "-"}
//                 </td>
//               </tr>
//             );
//           })}

//           <tr className="border-t border-gray-300 font-semibold">
//             <td className="py-2 px-3">Total</td>
//             <td className="py-2 px-3"></td>
//             <td className="py-2 px-3">{data.selectionPrice}</td>
//           </tr>
//         </tbody>
//       </table>

//       {data.selectionNotes && (
//         <div className="mt-4">
//           <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
//           <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-3 whitespace-pre-line">
//             {data.selectionNotes}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };



import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Receipt,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  DollarSign,
  Plus,
  Search,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import OrdersAPI from './OrdersAPI';
import axios from 'axios';
import { PRISM_URL } from '../../../constants/urls';

const PAYMENT_METHODS = ['Cash', 'Card', 'Bank Transfer', 'Cheque', 'Other'];
const PAYMENT_TYPES = ['deposit', 'balance', 'partial', 'full', 'refund'];

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'];

const ORDER_STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  confirmed: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  processing: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  cancelled: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  refunded: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

const PAYMENT_STATUS_STYLES = {
  unpaid: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  deposit_paid: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  partially_paid: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  refunded: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

const currency = (value) => `£${Number(value || 0).toFixed(2)}`;

/* ---------------------------------- UI primitives --------------------------------- */

function SectionCard({ icon: Icon, iconClass, title, action, children, className = '' }) {
  return (
    <section className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${iconClass}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 min-h-[38px]">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        <span className="truncate">{children || <span className="text-slate-400">—</span>}</span>
      </div>
    </div>
  );
}

function StatusPill({ label, styles }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset capitalize ${styles}`}>
      {label}
    </span>
  );
}

function PriceRow({ label, value, sub, negative, bold }) {
  return (
    <div className={`flex items-center justify-between ${sub ? 'pl-3' : ''}`}>
      <span className={`text-sm ${bold ? 'font-semibold text-slate-900' : sub ? 'text-slate-500' : 'text-slate-600'}`}>
        {label}
      </span>
      <span className={`text-sm tabular-nums ${bold ? 'font-semibold text-slate-900' : negative ? 'text-rose-600' : 'text-slate-800'}`}>
        {negative && Number(value) > 0 ? '−' : ''}{currency(value)}
      </span>
    </div>
  );
}

/* ------------------------------------- Page ---------------------------------------- */

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

  const [paymentForm, setPaymentForm] = useState({ type: 'balance', method: 'Cash', amount: '', notes: '' });
  const [addingPayment, setAddingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await OrdersAPI.getOrderById(id);
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
        setSelectedPatientLabel('');
      }
    };

    loadSelectedPatient();
  }, [order?.customer?.prismId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await OrdersAPI.updateOrder(id, order);
      await fetchOrder();
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

  const handleAddPayment = async () => {
    const amount = Number(paymentForm.amount);

    if (!paymentForm.method || !amount || amount <= 0) {
      setPaymentError('Enter a valid method and a positive amount');
      return;
    }

    try {
      setAddingPayment(true);
      setPaymentError('');
      await OrdersAPI.addPayment(id, {
        type: paymentForm.type,
        method: paymentForm.method,
        amount,
        notes: paymentForm.notes || undefined,
      });
      setPaymentForm({ type: 'balance', method: 'Cash', amount: '', notes: '' });
      await fetchOrder();
    } catch (e) {
      setPaymentError(e.response?.data?.error || e.message || 'Failed to add payment');
    } finally {
      setAddingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white border border-rose-200 rounded-xl p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-sm font-medium text-slate-900 mb-1">Couldn't load this order</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const paymentStatus = order.payment?.paymentStatus || 'unpaid';
  const amountPaid = order.payment?.amountPaid ?? 0;
  const balanceDue = order.payment?.balanceDue ?? (order.pricing?.totalPrice ?? 0);
  const transactions = order.payment?.transactions || [];
  const discounts = order.pricing?.discounts || {};
  const checkoutDiscountLabel =
    (order.pricing?.checkoutDiscountType ?? 'fixed') === 'percentage'
      ? `${order.pricing?.checkoutDiscountValue ?? 0}% off`
      : `${currency(order.pricing?.checkoutDiscountValue ?? 0)} off`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              aria-label="Back to orders"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight truncate">
                  Order {order.orderId || id}
                </h1>
                <StatusPill label={order.status} styles={ORDER_STATUS_STYLES[order.status] || ORDER_STATUS_STYLES.pending} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Placed {order.orderDate ? new Date(order.orderDate).toLocaleString() : '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReceipt}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Receipt</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer */}
            <SectionCard icon={User} iconClass="bg-violet-50 text-violet-600" title="Customer details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" icon={User}>{order.customer?.name}</Field>

                <div className="relative">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Prism patient</label>
                  {!isSelectingPatient ? (
                    <button
                      type="button"
                      onClick={() => setIsSelectingPatient(true)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-left hover:border-slate-300 transition-colors min-h-[38px]"
                    >
                      <span className={order?.customer?.prismId ? 'text-slate-800 truncate' : 'text-slate-400'}>
                        {order?.customer?.prismId ? selectedPatientLabel || 'Loading…' : 'Select patient'}
                      </span>
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ) : (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search by name or ID"
                          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                          value={search}
                          autoFocus
                          onChange={(e) => setSearch(e.target.value)}
                          onBlur={() => setTimeout(() => setIsSelectingPatient(false), 150)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setIsSelectingPatient(false);
                              setResults([]);
                            }
                          }}
                        />
                      </div>

                      {(prismLoading || results.length > 0 || search) && (
                        <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-52 overflow-y-auto shadow-lg">
                          {prismLoading && (
                            <div className="px-3 py-2.5 text-sm text-slate-500 flex items-center gap-2">
                              <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                              Searching…
                            </div>
                          )}

                          {!prismLoading && results.length === 0 && search && (
                            <div className="px-3 py-2.5 text-sm text-slate-400">No results found</div>
                          )}

                          {!prismLoading &&
                            results.map((p) => (
                              <div
                                key={p._id}
                                className="px-3 py-2.5 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                                onMouseDown={() => {
                                  setOrder({
                                    ...order,
                                    customer: { ...order.customer, prismId: p._id },
                                  });
                                  setSearch('');
                                  setSelectedPatientLabel(`${p.name} (ID: ${p.ID})`);
                                  setResults([]);
                                  setIsSelectingPatient(false);
                                }}
                              >
                                <span className="font-medium text-slate-800">{p.name}</span>{' '}
                                <span className="text-slate-400">ID: {p.ID}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <Field label="Email" icon={Mail}>{order.customer?.email}</Field>
                <Field label="Phone" icon={Phone}>{order.customer?.phone}</Field>
                <div className="sm:col-span-2">
                  <Field label="Address" icon={MapPin}>{order.customer?.address?.address}</Field>
                </div>
              </div>
            </SectionCard>

            {/* Notes */}
            <SectionCard icon={Package} iconClass="bg-orange-50 text-orange-600" title="Notes">
              {order.notes ? (
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{order.notes}</p>
              ) : (
                <p className="text-sm text-slate-400 italic">No notes added.</p>
              )}
            </SectionCard>

            {/* Selections */}
            <SectionCard icon={Package} iconClass="bg-orange-50 text-orange-600" title="Order selections">
              <SelectionsTable order={order} />
            </SectionCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Status */}
            <SectionCard icon={Package} iconClass="bg-blue-50 text-blue-600" title="Order status">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 capitalize"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </SectionCard>

            {/* Payment */}
            <SectionCard
              icon={CreditCard}
              iconClass="bg-emerald-50 text-emerald-600"
              title="Payment"
              action={<StatusPill label={paymentStatus.replace('_', ' ')} styles={PAYMENT_STATUS_STYLES[paymentStatus] || PAYMENT_STATUS_STYLES.unpaid} />}
            >
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                  <div className="text-xs text-slate-500 mb-1">Amount paid</div>
                  <div className="text-base font-semibold text-slate-900 tabular-nums">{currency(amountPaid)}</div>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                  <div className="text-xs text-slate-500 mb-1">Balance due</div>
                  <div className={`text-base font-semibold tabular-nums ${balanceDue > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {currency(balanceDue)}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <div className="text-xs font-medium text-slate-500 mb-2">Transaction history</div>
                {transactions.length === 0 ? (
                  <div className="text-sm text-slate-400 italic">No payments recorded yet.</div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
                    {transactions.map((t) => (
                      <div
                        key={t._id || `${t.paymentDate}-${t.amount}`}
                        className="flex items-center justify-between gap-3 border border-slate-100 rounded-lg px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="text-sm text-slate-800 capitalize truncate">
                            {t.type} · {t.method}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {t.paymentDate ? new Date(t.paymentDate).toLocaleDateString() : ''}
                            {t.notes ? ` · ${t.notes}` : ''}
                          </div>
                        </div>
                        <div className={`text-sm font-medium tabular-nums shrink-0 ${t.type === 'refund' ? 'text-rose-600' : 'text-slate-900'}`}>
                          {t.type === 'refund' ? '−' : ''}{currency(t.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-3">
                  <Wallet className="w-3.5 h-3.5" />
                  Add payment
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select
                    value={paymentForm.type}
                    onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                    className="px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 capitalize"
                  >
                    {PAYMENT_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">{t}</option>
                    ))}
                  </select>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                    className="px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="relative mb-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">£</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
                {paymentError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 mb-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {paymentError}
                  </div>
                )}
                <button
                  onClick={handleAddPayment}
                  disabled={addingPayment}
                  className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {addingPayment ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {addingPayment ? 'Adding…' : 'Add payment'}
                </button>
              </div>
            </SectionCard>

            {/* Pricing summary */}
            <SectionCard
              icon={DollarSign}
              iconClass="bg-green-50 text-green-600"
              title="Pricing summary"
            >
              <div className="space-y-2.5">
                <PriceRow
                  label="Selections total"
                  value={
                    (order.pricing?.subtotal ?? 0) -
                    (order.pricing?.sightTestFee ?? 0)
                  }
                />

                <PriceRow
                  label="Sight test"
                  value={order.pricing?.sightTestFee}
                  sub
                />

                <div className="border-t border-slate-100 pt-2.5">
                  <PriceRow
                    label="Subtotal"
                    value={order.pricing?.subtotal}
                    bold
                  />
                </div>

                <PriceRow
                  label="Discount"
                  value={order.pricing?.discount}
                  negative
                />

                <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 space-y-1.5">
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Discounts breakdown
                  </div>

                  <PriceRow label="Promos" value={discounts.promo} negative sub />
                  <PriceRow label="NHS GOS3" value={discounts.nhsgos3} negative sub />
                  <PriceRow
                    label={`Checkout (${checkoutDiscountLabel})`}
                    value={discounts.checkout}
                    negative
                    sub
                  />
                </div>

                <PriceRow label="Tax" value={order.pricing?.tax} />
                <PriceRow label="Shipping" value={order.pricing?.shipping} />

                <div className="border-t border-slate-100 pt-2.5">
                  <PriceRow label="Total" value={order.pricing?.totalPrice} bold />
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Selections ---------------------------------- */

const SelectionsTable = ({ order }) => {
  if (!order?.selections?.length) {
    return <p className="text-sm text-slate-400 italic">No selections added to this order.</p>;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {order.selections.map((selection, index) => (
        <SelectionCard key={selection.id || index} data={selection} />
      ))}
    </div>
  );
};

const SelectionCard = ({ data }) => {
  if (!data) return null;

  const rows = [
    { label: 'Age group', value: data.ageGroup?.name, price: data.ageGroup?.price },
    { label: 'Lens type', value: data.lensType?.name, price: data.lensType?.price },
    { label: 'Lens subtype', value: data.lensSubtype?.name, price: data.lensSubtype?.price },
    {
      label: 'Power range',
      value: data.powerMap?.min != null && data.powerMap?.max != null
        ? `${data.powerMap.min} to ${data.powerMap.max}`
        : null,
      price: null,
    },
    { label: 'Recommended lens', value: data.recommendedLens?.name, price: data.recommendedLens?.price },
    { label: 'Design', value: data.design?.name, price: data.design?.price },
    { label: 'Extras', value: data.extras?.name, price: data.extras?.price },
    {
      label: 'Color',
      value: data.color ? (
        <span className="inline-flex items-center gap-2">
          {data.color.name}
          <span className="h-3.5 w-3.5 rounded-full border border-slate-200" style={{ backgroundColor: data.color.code }} />
        </span>
      ) : null,
      price: null,
    },
    { label: 'RE PD', value: data.rePd, price: null },
    { label: 'LE PD', value: data.lePd, price: null },
    { label: 'RE H', value: data.reH, price: null },
    { label: 'LE H', value: data.leH, price: null },
    ...(data.frameData
      ? Object.values(data.frameData).map((item) => ({ label: item.name, value: item.value, price: null }))
      : []),
  ];

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h4 className="text-sm font-semibold text-slate-900">{data.name || 'Selection'}</h4>
        <span className="text-sm font-semibold text-slate-900 tabular-nums">{currency(data.selectionPrice)}</span>
      </div>

      <dl className="divide-y divide-slate-100">
        {rows.map((row, idx) => {
          const isMissing = row.value === null || row.value === undefined || row.value === '';
          return (
            <div key={idx} className="flex items-center justify-between gap-4 px-4 py-2">
              <dt className="text-xs text-slate-500 shrink-0">{row.label}</dt>
              <dd className={`text-sm text-right ${isMissing ? 'text-slate-300' : 'text-slate-800'}`}>
                {isMissing ? '—' : row.value}
                {row.price != null && (
                  <span className="ml-2 text-slate-400 tabular-nums">{currency(row.price)}</span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      {data.selectionNotes && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs font-medium text-slate-500 mb-1">Notes</p>
          <p className="text-sm text-slate-700 whitespace-pre-line">{data.selectionNotes}</p>
        </div>
      )}
    </div>
  );
};