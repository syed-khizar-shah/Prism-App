// const { formatCurrency } = require("./helpers")

// /**
//  * Build totals section for receipt
//  * @param {Object} order - Complete order object with pricing details
//  * @returns {Object} Totals section for pdfmake
//  */
// module.exports.buildOrderTotals = (pricing) => {
//     console.log({ pricing })
//     if (!pricing) {
//         return {};
//     }

//     const subtotal = pricing.subtotal;
//     const discount = pricing.discount;
//     const tax = pricing.tax;
//     const shipping = pricing.shipping;
//     const nhsgos3 = pricing.discounts?.nhsgos3 || 0;
//     const promo = pricing.discounts?.promo || 0;
//     const checkoutDiscount = pricing.discounts?.checkout || 0;
//     const checkoutDiscountType = pricing.checkoutDiscountType;
//     const checkoutDiscountValue = pricing.checkoutDiscountValue;
//     const totalPrice = pricing.totalPrice;

//     const rows = [];

//     // Subtotal
//     rows.push([
//         { text: 'Subtotal', fontSize: 9, alignment: 'right' },
//         { text: formatCurrency(subtotal), fontSize: 9, }
//     ]);

//     // Discount (only show if > 0)
//     // if (discount > 0) {
//     //     rows.push([
//     //         { text: 'Discount', fontSize: 9, alignment: 'right', color: '#28a745' },
//     //         { text: '-' + formatCurrency(discount), fontSize: 9, color: '#28a745' }
//     //     ]);
//     // }

//     // Tax (only show if > 0)
//     // if (tax > 0) {
//     //     rows.push([
//     //         { text: 'Tax', fontSize: 9, alignment: 'right' },
//     //         { text: formatCurrency(tax), fontSize: 9, }
//     //     ]);
//     // }

//     // Shipping (only show if > 0)
//     // if (shipping > 0) {
//     //     rows.push([
//     //         { text: 'Shipping', fontSize: 9, alignment: 'right' },
//     //         { text: formatCurrency(shipping), fontSize: 9 }
//     //     ]);
//     // }
//     if (promo) {

//         rows.push([
//             { text: 'Promotion', fontSize: 9, alignment: 'right' },
//             { text: '-' + formatCurrency(promo), fontSize: 9 }
//         ]);
//     }
//     if (nhsgos3) {

//         rows.push([
//             { text: 'NHS voucher', fontSize: 9, alignment: 'right' },
//             { text: '-' + formatCurrency(nhsgos3), fontSize: 9 }
//         ]);
//     }

//     if (checkoutDiscount) {
//         const label = checkoutDiscountType === 'percentage'
//             ? `Discount (${checkoutDiscountValue}% off)`
//             : `Discount (${formatCurrency(checkoutDiscountValue)} off)`;

//         rows.push([
//             { text: label, fontSize: 9, alignment: 'right' },
//             { text: '-' + formatCurrency(checkoutDiscount), fontSize: 9 }
//         ]);
//     }

//     // Total
//     rows.push([
//         { text: 'Total', fontSize: 11, bold: true, alignment: 'right', fillColor: '#f5f5f5' },
//         { text: formatCurrency(totalPrice), fontSize: 11, bold: true, alignment: 'right', fillColor: '#f5f5f5' }
//     ]);

//     return {
//         table: {
//             widths: ['*', 80],
//             body: rows
//         },
//         layout: {
//             hLineWidth: (i, node) => 1,
//             hLineColor: () => '#ddd',
//             vLineWidth: () => 1,
//             vLineColor: () => '#ddd',
//             paddingLeft: () => 8,
//             paddingRight: () => 8,
//             paddingTop: () => 6,
//             paddingBottom: () => 6
//         },
//         margin: [0, 20, 0, 0]
//     };
// };


// const { formatCurrency } = require("./helpers")

// /**
//  * Build totals section for receipt
//  * @param {Object} pricing - Order pricing object
//  * @returns {Object} Totals section for pdfmake
//  */
// module.exports.buildOrderTotals = (pricing) => {
//     if (!pricing) {
//         return {};
//     }

//     const subtotal = pricing.subtotal;
//     const sightTestFee = pricing.sightTestFee || 0;
//     const discount = pricing.discount;
//     const tax = pricing.tax;
//     const shipping = pricing.shipping;
//     const nhsgos3 = pricing.discounts?.nhsgos3 || 0;
//     const promo = pricing.discounts?.promo || 0;
//     const checkoutDiscount = pricing.discounts?.checkout || 0;
//     const checkoutDiscountType = pricing.checkoutDiscountType;
//     const checkoutDiscountValue = pricing.checkoutDiscountValue;
//     const totalPrice = pricing.totalPrice;

//     const rows = [];

//     // Subtotal
//     rows.push([
//         { text: 'Subtotal', fontSize: 9, alignment: 'right' },
//         { text: formatCurrency(subtotal), fontSize: 9, alignment: 'right' }
//     ]);

//     // Sight test fee (only show if > 0)
//     // if (sightTestFee > 0) {
//     //     rows.push([
//     //         { text: 'Sight test fee', fontSize: 9, alignment: 'right' },
//     //         { text: formatCurrency(sightTestFee), fontSize: 9, alignment: 'right' }
//     //     ]);
//     // }

//     // Discount (only show if > 0)
//     // if (discount > 0) {
//     //     rows.push([
//     //         { text: 'Discount', fontSize: 9, alignment: 'right', color: '#28a745' },
//     //         { text: '-' + formatCurrency(discount), fontSize: 9, alignment: 'right', color: '#28a745' }
//     //     ]);
//     // }

//     // Tax (only show if > 0)
//     // if (tax > 0) {
//     //     rows.push([
//     //         { text: 'Tax', fontSize: 9, alignment: 'right' },
//     //         { text: formatCurrency(tax), fontSize: 9, alignment: 'right' }
//     //     ]);
//     // }

//     // Shipping (only show if > 0)
//     // if (shipping > 0) {
//     //     rows.push([
//     //         { text: 'Shipping', fontSize: 9, alignment: 'right' },
//     //         { text: formatCurrency(shipping), fontSize: 9, alignment: 'right' }
//     //     ]);
//     // }

//     if (promo) {
//         rows.push([
//             { text: 'Promotion', fontSize: 9, alignment: 'right' },
//             { text: '-' + formatCurrency(promo), fontSize: 9, alignment: 'right' }
//         ]);
//     }

//     if (nhsgos3) {
//         rows.push([
//             { text: 'NHS voucher', fontSize: 9, alignment: 'right' },
//             { text: '-' + formatCurrency(nhsgos3), fontSize: 9, alignment: 'right' }
//         ]);
//     }

//     if (checkoutDiscount) {
//         const label = checkoutDiscountType === 'percentage'
//             ? `Discount (${checkoutDiscountValue}% off)`
//             : `Discount (${formatCurrency(checkoutDiscountValue)} off)`;

//         rows.push([
//             { text: label, fontSize: 9, alignment: 'right' },
//             { text: '-' + formatCurrency(checkoutDiscount), fontSize: 9, alignment: 'right' }
//         ]);
//     }

//     // Total
//     rows.push([
//         { text: 'Total', fontSize: 11, bold: true, alignment: 'right', fillColor: '#f5f5f5' },
//         { text: formatCurrency(totalPrice), fontSize: 11, bold: true, alignment: 'right', fillColor: '#f5f5f5' }
//     ]);

//     return {
//         table: {
//             widths: ['*', 80],
//             body: rows
//         },
//         layout: {
//             hLineWidth: (i, node) => 1,
//             hLineColor: () => '#ddd',
//             vLineWidth: () => 1,
//             vLineColor: () => '#ddd',
//             paddingLeft: () => 8,
//             paddingRight: () => 8,
//             paddingTop: () => 6,
//             paddingBottom: () => 6
//         },
//         margin: [0, 20, 0, 0]
//     };
// };

// const { formatCurrency } = require("./helpers")

// /**
//  * Build totals section for receipt
//  * @param {Object} pricing - Order pricing object
//  * @param {Object} payment - Order payment object (optional)
//  * @returns {Array} Array of pdfmake content blocks (totals table + payment table)
//  */
// module.exports.buildOrderTotals = (pricing, payment) => {
//     if (!pricing) {
//         return {};
//     }

//     const subtotal = pricing.subtotal;
//     const nhsgos3 = pricing.discounts?.nhsgos3 || 0;
//     const promo = pricing.discounts?.promo || 0;
//     const checkoutDiscount = pricing.discounts?.checkout || 0;
//     const checkoutDiscountType = pricing.checkoutDiscountType;
//     const checkoutDiscountValue = pricing.checkoutDiscountValue;
//     const totalPrice = pricing.totalPrice;

//     const rows = [];

//     // Subtotal
//     rows.push([
//         { text: 'Subtotal', fontSize: 9, alignment: 'right' },
//         { text: formatCurrency(subtotal), fontSize: 9, alignment: 'right' }
//     ]);

//     if (promo) {
//         rows.push([
//             { text: 'Promotion', fontSize: 9, alignment: 'right' },
//             { text: '-' + formatCurrency(promo), fontSize: 9, alignment: 'right' }
//         ]);
//     }

//     if (nhsgos3) {
//         rows.push([
//             { text: 'NHS voucher', fontSize: 9, alignment: 'right' },
//             { text: '-' + formatCurrency(nhsgos3), fontSize: 9, alignment: 'right' }
//         ]);
//     }

//     if (checkoutDiscount) {
//         const label = checkoutDiscountType === 'percentage'
//             ? `Discount (${checkoutDiscountValue}% off)`
//             : `Discount (${formatCurrency(checkoutDiscountValue)} off)`;

//         rows.push([
//             { text: label, fontSize: 9, alignment: 'right' },
//             { text: '-' + formatCurrency(checkoutDiscount), fontSize: 9, alignment: 'right' }
//         ]);
//     }

//     // Total
//     rows.push([
//         { text: 'Total', fontSize: 11, bold: true, alignment: 'right', fillColor: '#f5f5f5' },
//         { text: formatCurrency(totalPrice), fontSize: 11, bold: true, alignment: 'right', fillColor: '#f5f5f5' }
//     ]);

//     const totalsTable = {
//         table: {
//             widths: ['*', 80],
//             body: rows
//         },
//         layout: {
//             hLineWidth: () => 1,
//             hLineColor: () => '#ddd',
//             vLineWidth: () => 1,
//             vLineColor: () => '#ddd',
//             paddingLeft: () => 8,
//             paddingRight: () => 8,
//             paddingTop: () => 6,
//             paddingBottom: () => 6
//         },
//         margin: [0, 20, 0, 0]
//     };

//     const content = [totalsTable];

//     const paymentSection = buildPaymentSection(payment, totalPrice);
//     if (paymentSection) {
//         content.push(paymentSection);
//     }

//     return content;
// };

// /**
//  * Build the payment / deposit breakdown section
//  * @param {Object} payment - Order payment object
//  * @param {Number} totalPrice - Order total, used as a fallback if balanceDue isn't set
//  * @returns {Object|null} pdfmake content block, or null if there's nothing to show
//  */
// function buildPaymentSection(payment, totalPrice) {
//     if (!payment) {
//         return null;
//     }

//     const amountPaid = payment.amountPaid || 0;
//     const balanceDue = payment.balanceDue != null
//         ? payment.balanceDue
//         : Math.max((totalPrice || 0) - amountPaid, 0);
//     const status = payment.paymentStatus || 'unpaid';

//     const statusStyles = {
//         unpaid: { label: 'Unpaid', color: '#c0392b' },
//         deposit_paid: { label: 'Deposit Paid', color: '#b8860b' },
//         partially_paid: { label: 'Partially Paid', color: '#b8860b' },
//         paid: { label: 'Paid in Full', color: '#28a745' },
//         refunded: { label: 'Refunded', color: '#6c757d' }
//     };
//     const statusStyle = statusStyles[status] || { label: status, color: '#333' };

//     const rows = [];

//     // Itemize individual transactions (deposits, part-payments, etc.)
//     const transactions = Array.isArray(payment.transactions) ? payment.transactions : [];
//     if (transactions.length) {
//         transactions.forEach((txn) => {
//             const typeLabel = {
//                 deposit: 'Deposit',
//                 balance: 'Balance Payment',
//                 partial: 'Payment',
//                 full: 'Payment (in full)',
//                 refund: 'Refund'
//             }[txn.type] || 'Payment';

//             const dateStr = txn.paymentDate
//                 ? new Date(txn.paymentDate).toLocaleDateString('en-GB')
//                 : '';

//             const label = [typeLabel, txn.method, dateStr].filter(Boolean).join(' · ');
//             const sign = txn.type === 'refund' ? '-' : '';

//             rows.push([
//                 { text: label, fontSize: 9, alignment: 'right', color: '#555' },
//                 { text: sign + formatCurrency(txn.amount), fontSize: 9, alignment: 'right', color: '#555' }
//             ]);
//         });
//     }

//     // Amount paid
//     rows.push([
//         { text: 'Amount Paid', fontSize: 9, alignment: 'right' },
//         { text: formatCurrency(amountPaid), fontSize: 9, alignment: 'right', color: '#28a745' }
//     ]);

//     // Balance due — emphasized if outstanding
//     rows.push([
//         {
//             text: 'Balance Due',
//             fontSize: 11,
//             bold: true,
//             alignment: 'right',
//             fillColor: balanceDue > 0 ? '#fdf2f2' : '#f5f5f5'
//         },
//         {
//             text: formatCurrency(balanceDue),
//             fontSize: 11,
//             bold: true,
//             alignment: 'right',
//             color: balanceDue > 0 ? '#c0392b' : '#28a745',
//             fillColor: balanceDue > 0 ? '#fdf2f2' : '#f5f5f5'
//         }
//     ]);

//     return {
//         stack: [
//             {
//                 text: statusStyle.label,
//                 fontSize: 9,
//                 bold: true,
//                 color: statusStyle.color,
//                 alignment: 'right',
//                 margin: [0, 14, 0, 4]
//             },
//             {
//                 table: {
//                     widths: ['*', 80],
//                     body: rows
//                 },
//                 layout: {
//                     hLineWidth: () => 1,
//                     hLineColor: () => '#ddd',
//                     vLineWidth: () => 1,
//                     vLineColor: () => '#ddd',
//                     paddingLeft: () => 8,
//                     paddingRight: () => 8,
//                     paddingTop: () => 6,
//                     paddingBottom: () => 6
//                 }
//             }
//         ]
//     };
// }

const { formatCurrency } = require("./helpers")

/**
 * Reads a Map or plain object of row configs into a plain lookup object.
 * No defaults are applied here — whatever is (or isn't) in the config is
 * exactly what gets used. The config document is expected to already carry
 * full row definitions (see ReportConfig schema defaults).
 */
function toPlainRows(rows) {
    if (!rows) return {};
    const isMap = typeof rows.get === 'function' && typeof rows.entries === 'function';
    return isMap ? Object.fromEntries(rows) : rows;
}

/**
 * Build totals section for receipt
 * @param {Object} pricing - Order pricing object
 * @param {Object} payment - Order payment object (optional)
 * @param {Object} totalsConfig - sections.totals from ReportConfig
 *        Shape: { enabled: Boolean, rows: Map|Object }
 * @returns {Array} Array of pdfmake content blocks
 */
module.exports.buildOrderTotals = (pricing, payment, totalsConfig) => {
    if (!pricing) {
        return [];
    }

    if (!totalsConfig || totalsConfig.enabled === false) {
        return [];
    }

    const rowCfg = toPlainRows(totalsConfig.rows);

    const subtotal = pricing.subtotal;
    const nhsgos3 = pricing.discounts?.nhsgos3 || 0;
    const promo = pricing.discounts?.promo || 0;
    const checkoutDiscount = pricing.discounts?.checkout || 0;
    const checkoutDiscountType = pricing.checkoutDiscountType;
    const checkoutDiscountValue = pricing.checkoutDiscountValue;
    const totalPrice = pricing.totalPrice;

    const rows = [];

    if (rowCfg.subtotal?.enabled) {
        rows.push([
            { text: rowCfg.subtotal.label, fontSize: 9, alignment: 'right' },
            { text: formatCurrency(subtotal), fontSize: 9, alignment: 'right' }
        ]);
    }

    if (rowCfg.promo?.enabled && promo) {
        rows.push([
            { text: rowCfg.promo.label, fontSize: 9, alignment: 'right' },
            { text: '-' + formatCurrency(promo), fontSize: 9, alignment: 'right' }
        ]);
    }

    if (rowCfg.nhsgos3?.enabled && nhsgos3) {
        rows.push([
            { text: rowCfg.nhsgos3.label, fontSize: 9, alignment: 'right' },
            { text: '-' + formatCurrency(nhsgos3), fontSize: 9, alignment: 'right' }
        ]);
    }

    if (rowCfg.checkoutDiscount?.enabled && checkoutDiscount) {
        const label = checkoutDiscountType === 'percentage'
            ? `${rowCfg.checkoutDiscount.label} (${checkoutDiscountValue}% off)`
            : `${rowCfg.checkoutDiscount.label} (${formatCurrency(checkoutDiscountValue)} off)`;

        rows.push([
            { text: label, fontSize: 9, alignment: 'right' },
            { text: '-' + formatCurrency(checkoutDiscount), fontSize: 9, alignment: 'right' }
        ]);
    }

    if (rowCfg.total?.enabled) {
        rows.push([
            { text: rowCfg.total.label, fontSize: 11, bold: true, alignment: 'right', fillColor: '#f5f5f5' },
            { text: formatCurrency(totalPrice), fontSize: 11, bold: true, alignment: 'right', fillColor: '#f5f5f5' }
        ]);
    }

    const content = [];

    if (rows.length) {
        content.push({
            table: {
                widths: ['*', 80],
                body: rows
            },
            layout: {
                hLineWidth: () => 1,
                hLineColor: () => '#ddd',
                vLineWidth: () => 1,
                vLineColor: () => '#ddd',
                paddingLeft: () => 8,
                paddingRight: () => 8,
                paddingTop: () => 6,
                paddingBottom: () => 6
            },
            margin: [0, 20, 0, 0]
        });
    }

    const paymentSection = buildPaymentSection(payment, totalPrice, rowCfg);
    if (paymentSection) {
        content.push(paymentSection);
    }

    return content;
};

/**
 * Build the payment / deposit breakdown section
 * @param {Object} payment - Order payment object
 * @param {Number} totalPrice - Order total, used as a fallback if balanceDue isn't set
 * @param {Object} rowCfg - plain rows object from the totals config
 * @returns {Object|null} pdfmake content block, or null if there's nothing to show
 */
function buildPaymentSection(payment, totalPrice, rowCfg) {
    if (!payment) {
        return null;
    }

    const amountPaid = payment.amountPaid || 0;
    const balanceDue = payment.balanceDue != null
        ? payment.balanceDue
        : Math.max((totalPrice || 0) - amountPaid, 0);
    const status = payment.paymentStatus || 'unpaid';

    const statusStyles = {
        unpaid: { label: 'Unpaid', color: '#c0392b' },
        deposit_paid: { label: 'Deposit Paid', color: '#b8860b' },
        partially_paid: { label: 'Partially Paid', color: '#b8860b' },
        paid: { label: 'Paid in Full', color: '#28a745' },
        refunded: { label: 'Refunded', color: '#6c757d' }
    };
    const statusStyle = statusStyles[status] || { label: status, color: '#333' };

    const rows = [];

    if (rowCfg.transactions?.enabled) {
        const transactions = Array.isArray(payment.transactions) ? payment.transactions : [];
        transactions.forEach((txn) => {
            const typeLabel = {
                deposit: 'Deposit',
                balance: 'Balance Payment',
                partial: 'Payment',
                full: 'Payment (in full)',
                refund: 'Refund'
            }[txn.type] || 'Payment';

            const dateStr = txn.paymentDate
                ? new Date(txn.paymentDate).toLocaleDateString('en-GB')
                : '';

            const label = [typeLabel, txn.method, dateStr].filter(Boolean).join(' \u00b7 ');
            const sign = txn.type === 'refund' ? '-' : '';

            rows.push([
                { text: label, fontSize: 9, alignment: 'right', color: '#555' },
                { text: sign + formatCurrency(txn.amount), fontSize: 9, alignment: 'right', color: '#555' }
            ]);
        });
    }

    if (rowCfg.amountPaid?.enabled) {
        rows.push([
            { text: rowCfg.amountPaid.label, fontSize: 9, alignment: 'right' },
            { text: formatCurrency(amountPaid), fontSize: 9, alignment: 'right', color: '#28a745' }
        ]);
    }

    if (rowCfg.balanceDue?.enabled) {
        rows.push([
            {
                text: rowCfg.balanceDue.label,
                fontSize: 11,
                bold: true,
                alignment: 'right',
                fillColor: balanceDue > 0 ? '#fdf2f2' : '#f5f5f5'
            },
            {
                text: formatCurrency(balanceDue),
                fontSize: 11,
                bold: true,
                alignment: 'right',
                color: balanceDue > 0 ? '#c0392b' : '#28a745',
                fillColor: balanceDue > 0 ? '#fdf2f2' : '#f5f5f5'
            }
        ]);
    }

    if (!rows.length) {
        return null;
    }

    const stackItems = [];

    if (rowCfg.paymentStatus?.enabled) {
        stackItems.push({
            text: statusStyle.label,
            fontSize: 9,
            bold: true,
            color: statusStyle.color,
            alignment: 'right',
            margin: [0, 14, 0, 4]
        });
    }

    stackItems.push({
        table: {
            widths: ['*', 80],
            body: rows
        },
        layout: {
            hLineWidth: () => 1,
            hLineColor: () => '#ddd',
            vLineWidth: () => 1,
            vLineColor: () => '#ddd',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6
        }
    });

    return { stack: stackItems };
}