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
  Download,
  FileOutput,
  ChevronDown,
  ClipboardList,
} from 'lucide-react';
import OrdersAPI from './OrdersAPI';
import axios from 'axios';
import { PRISM_URL } from '../../../constants/urls';
import { useRef } from 'react';
import ExportMenu from './components/export-menu';

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
        console.log({ res });
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

  console.log({ order })

  const handleSelectPrismPatient = (p) => {
    setOrder({
      ...order,
      customer: {
        ...order.customer,
        prismId: p._id,
        phone: p.phone,
        landline: p.landline,
        address: p.address
      },
    });
    setSearch('');
    setSelectedPatientLabel(`${p.name} (ID: ${p.ID})`);
    setResults([]);
    setIsSelectingPatient(false);
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              aria-label="Back to orders"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight truncate">
                  Order {order.orderId || id}
                </h1>
                <StatusPill label={order.status} styles={ORDER_STATUS_STYLES[order.status] || ORDER_STATUS_STYLES.pending} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                Placed {order.orderDate ? new Date(order.orderDate).toLocaleString() : '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 flex-wrap shrink-0">
            <ExportMenu id={id} order={order} />
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
                                onMouseDown={() => handleSelectPrismPatient(p)}
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
                <Field label="Landline" icon={Phone}>{order.customer?.landline}</Field>
                <div className="sm:col-span-2">
                  <div className='text-base font-medium text-slate-500'>
                    Address
                  </div>
                  <Field label="Street (address 1)" icon={MapPin}>{order.customer?.address?.street}</Field>
                  <Field label="Address 2" icon={MapPin}>{order.customer?.address?.address}</Field>
                  <Field label="City" icon={MapPin}>{order.customer?.address?.city}</Field>
                  <Field label="Country" icon={MapPin}>{order.customer?.address?.country}</Field>
                  <Field label="Postal Code" icon={MapPin}>{order.customer?.address?.postalCode}</Field>
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