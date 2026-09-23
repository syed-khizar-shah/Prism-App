const { formatCurrency } = require("../shared/helpers");

/**
 * Build totals section for detailed order PDF.
 *
 * This version is intentionally limited to order pricing totals.
 * It does not include payment transactions, amount paid,
 * balance due, or payment status.
 *
 * @param {Object} pricing - Order pricing object
 * @returns {Object|null} pdfmake content block
 */
module.exports.buildDetailedOrderTotals = (pricing) => {
    if (!pricing) {
        return null;
    }

    const subtotal =
        typeof pricing.subtotal === "number"
            ? pricing.subtotal
            : 0;

    const nhsgos3 =
        typeof pricing.discounts?.nhsgos3 === "number"
            ? pricing.discounts.nhsgos3
            : 0;

    const promo =
        typeof pricing.discounts?.promo === "number"
            ? pricing.discounts.promo
            : 0;

    const checkoutDiscount =
        typeof pricing.discounts?.checkout === "number"
            ? pricing.discounts.checkout
            : 0;

    const checkoutDiscountType =
        pricing.checkoutDiscountType;

    const checkoutDiscountValue =
        pricing.checkoutDiscountValue;

    const totalPrice =
        typeof pricing.totalPrice === "number"
            ? pricing.totalPrice
            : 0;

    const rows = [];

    // Subtotal
    rows.push([
        {
            text: "Subtotal",
            fontSize: 9,
            alignment: "right"
        },
        {
            text: formatCurrency(subtotal),
            fontSize: 9,
            alignment: "right"
        }
    ]);

    // Promo discount
    if (promo) {
        rows.push([
            {
                text: "Promo discount",
                fontSize: 9,
                alignment: "right"
            },
            {
                text: `-${formatCurrency(promo)}`,
                fontSize: 9,
                alignment: "right"
            }
        ]);
    }

    // NHS GOS3
    if (nhsgos3) {
        rows.push([
            {
                text: "NHS GOS3",
                fontSize: 9,
                alignment: "right"
            },
            {
                text: `-${formatCurrency(nhsgos3)}`,
                fontSize: 9,
                alignment: "right"
            }
        ]);
    }

    // Checkout discount
    if (checkoutDiscount) {
        let label = "Checkout discount";

        if (checkoutDiscountType === "percentage") {
            label += ` (${checkoutDiscountValue}% off)`;
        } else if (
            checkoutDiscountType &&
            checkoutDiscountValue != null
        ) {
            label += ` (${formatCurrency(checkoutDiscountValue)} off)`;
        }

        rows.push([
            {
                text: label,
                fontSize: 9,
                alignment: "right"
            },
            {
                text: `-${formatCurrency(checkoutDiscount)}`,
                fontSize: 9,
                alignment: "right"
            }
        ]);
    }

    // Total
    rows.push([
        {
            text: "Total",
            fontSize: 11,
            bold: true,
            alignment: "right",
            fillColor: "#f5f5f5"
        },
        {
            text: formatCurrency(totalPrice),
            fontSize: 11,
            bold: true,
            alignment: "right",
            fillColor: "#f5f5f5"
        }
    ]);

    return {
        table: {
            widths: ["*", 90],
            body: rows
        },

        layout: {
            hLineWidth: () => 1,
            hLineColor: () => "#ddd",

            vLineWidth: () => 1,
            vLineColor: () => "#ddd",

            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6
        },

        margin: [0, 20, 0, 0]
    };
};