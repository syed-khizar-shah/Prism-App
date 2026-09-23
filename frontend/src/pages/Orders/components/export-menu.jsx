import { useState, useRef, useEffect } from 'react';
import { FileOutput, ChevronDown, Receipt, ClipboardList } from 'lucide-react';
import OrdersAPI from '../OrdersAPI';

/**
 * ExportMenu
 *
 * A split-button style dropdown for exporting an order in different
 * formats aimed at different audiences (customer vs internal).
 *
 * Usage:
 * <ExportMenu id={id} order={order} />
 *
 * `id` is the route/lookup id used to call the API; `order` is only used
 * to prefer `order.orderId` in the downloaded filename when available.
 * The receipt/order-sheet export logic lives inside this component since
 * it isn't reused elsewhere.
 */
export default function ExportMenu({
    id,
    order,
    triggerLabel = 'Export',
    triggerIcon: TriggerIcon = FileOutput,
    align = 'right',
    className = '',
}) {
    const [open, setOpen] = useState(false);
    const [exporting, setExporting] = useState(null); // 'receipt' | 'order-sheet' | null
    const containerRef = useRef(null);

    const displayId = order?.orderId || id;

    const downloadBlob = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleReceipt = async () => {
        setExporting('receipt');
        try {
            const blob = await OrdersAPI.downloadReceipt(id);
            downloadBlob(blob, `receipt-${displayId}.pdf`);
        } catch (e) {
            alert(e.message || 'Failed to download receipt');
        } finally {
            setExporting(null);
        }
    };

    const handleOrderDownload = async () => {
        setExporting('order-sheet');
        try {
            const blob = await OrdersAPI.downloadOrderDetail(id);
            downloadBlob(blob, `order-${displayId}.pdf`);
        } catch (e) {
            alert(e.message || 'Failed to download order sheet');
        } finally {
            setExporting(null);
        }
    };

    const options = [
        {
            key: 'receipt',
            label: 'Customer receipt',
            description: 'Printable copy for the customer',
            icon: Receipt,
            onSelect: handleReceipt,
        },
        {
            key: 'order-sheet',
            label: 'Order sheet',
            description: 'Full detail for internal use',
            icon: ClipboardList,
            onSelect: handleOrderDownload,
        },
    ];

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    const handleSelect = (option) => {
        option.onSelect?.();
        setOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                disabled={!!exporting}
                aria-haspopup="menu"
                aria-expanded={open}
                className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {exporting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-slate-600" />
                ) : (
                    <TriggerIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{exporting ? 'Exporting…' : triggerLabel}</span>
                {!exporting && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
                )}
            </button>

            {open && (
                <div
                    role="menu"
                    className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1`}
                >
                    {options.map((option) => {
                        const OptionIcon = option.icon;
                        return (
                            <button
                                key={option.key}
                                type="button"
                                role="menuitem"
                                onClick={() => handleSelect(option)}
                                className="w-full text-left px-3 py-2.5 hover:bg-slate-50 flex gap-2.5 transition-colors"
                            >
                                {OptionIcon && <OptionIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />}
                                <span>
                                    <span className="block text-sm font-medium text-slate-800">{option.label}</span>
                                    {option.description && (
                                        <span className="block text-xs text-slate-400">{option.description}</span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}