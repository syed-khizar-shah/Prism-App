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


const { formatCurrency } = require("./helpers")

/**
 * Build totals section for receipt
 * @param {Object} pricing - Order pricing object
 * @returns {Object} Totals section for pdfmake
 */
module.exports.buildOrderTotals = (pricing) => {
    if (!pricing) {
        return {};
    }

    const subtotal = pricing.subtotal;
    const sightTestFee = pricing.sightTestFee || 0;
    const discount = pricing.discount;
    const tax = pricing.tax;
    const shipping = pricing.shipping;
    const nhsgos3 = pricing.discounts?.nhsgos3 || 0;
    const promo = pricing.discounts?.promo || 0;
    const checkoutDiscount = pricing.discounts?.checkout || 0;
    const checkoutDiscountType = pricing.checkoutDiscountType;
    const checkoutDiscountValue = pricing.checkoutDiscountValue;
    const totalPrice = pricing.totalPrice;

    const rows = [];

    // Subtotal
    rows.push([
        { text: 'Subtotal', fontSize: 9, alignment: 'right' },
        { text: formatCurrency(subtotal), fontSize: 9, alignment: 'right' }
    ]);

    // Sight test fee (only show if > 0)
    // if (sightTestFee > 0) {
    //     rows.push([
    //         { text: 'Sight test fee', fontSize: 9, alignment: 'right' },
    //         { text: formatCurrency(sightTestFee), fontSize: 9, alignment: 'right' }
    //     ]);
    // }

    // Discount (only show if > 0)
    // if (discount > 0) {
    //     rows.push([
    //         { text: 'Discount', fontSize: 9, alignment: 'right', color: '#28a745' },
    //         { text: '-' + formatCurrency(discount), fontSize: 9, alignment: 'right', color: '#28a745' }
    //     ]);
    // }

    // Tax (only show if > 0)
    // if (tax > 0) {
    //     rows.push([
    //         { text: 'Tax', fontSize: 9, alignment: 'right' },
    //         { text: formatCurrency(tax), fontSize: 9, alignment: 'right' }
    //     ]);
    // }

    // Shipping (only show if > 0)
    // if (shipping > 0) {
    //     rows.push([
    //         { text: 'Shipping', fontSize: 9, alignment: 'right' },
    //         { text: formatCurrency(shipping), fontSize: 9, alignment: 'right' }
    //     ]);
    // }

    if (promo) {
        rows.push([
            { text: 'Promotion', fontSize: 9, alignment: 'right' },
            { text: '-' + formatCurrency(promo), fontSize: 9, alignment: 'right' }
        ]);
    }

    if (nhsgos3) {
        rows.push([
            { text: 'NHS voucher', fontSize: 9, alignment: 'right' },
            { text: '-' + formatCurrency(nhsgos3), fontSize: 9, alignment: 'right' }
        ]);
    }

    if (checkoutDiscount) {
        const label = checkoutDiscountType === 'percentage'
            ? `Discount (${checkoutDiscountValue}% off)`
            : `Discount (${formatCurrency(checkoutDiscountValue)} off)`;

        rows.push([
            { text: label, fontSize: 9, alignment: 'right' },
            { text: '-' + formatCurrency(checkoutDiscount), fontSize: 9, alignment: 'right' }
        ]);
    }

    // Total
    rows.push([
        { text: 'Total', fontSize: 11, bold: true, alignment: 'right', fillColor: '#f5f5f5' },
        { text: formatCurrency(totalPrice), fontSize: 11, bold: true, alignment: 'right', fillColor: '#f5f5f5' }
    ]);

    return {
        table: {
            widths: ['*', 80],
            body: rows
        },
        layout: {
            hLineWidth: (i, node) => 1,
            hLineColor: () => '#ddd',
            vLineWidth: () => 1,
            vLineColor: () => '#ddd',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6
        },
        margin: [0, 20, 0, 0]
    };
};