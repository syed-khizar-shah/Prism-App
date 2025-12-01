const { formatCurrency } = require("./helpers")

/**
 * Helper function to validate order object structure
 * @param {Object} order - Order object to validate
 * @returns {Boolean} True if order has required properties
 */
const isValidOrder = (order) => {
    return order &&
        Array.isArray(order.selections) &&
        order.selections.length > 0;
};

/**
 * Extract configuration details without prices
 * @param {Object} selection - Order selection object
 * @returns {Array} Array of {label, name, price} objects
 */
const getConfigItems = (selection) => {
    if (!selection || typeof selection !== 'object') {
        return [];
    }

    const items = [];

    if (selection.ageGroup?.name) {
        items.push({ label: 'Age Group', name: selection.ageGroup.name, price: selection.ageGroup.price });
    }
    if (selection.lensType?.name) {
        items.push({ label: 'Lens Type', name: selection.lensType.name, price: selection.lensType.price });
    }
    if (selection.lensSubtype?.name) {
        items.push({ label: 'Lens Subtype', name: selection.lensSubtype.name, price: selection.lensSubtype.price });
    }
    if (selection.recommendedLens?.name) {
        items.push({ label: 'Recommended Lens', name: selection.recommendedLens.name, price: selection.recommendedLens.price });
    }
    if (selection.design?.name) {
        items.push({ label: 'Design', name: selection.design.name, price: selection.design.price });
    }
    if (selection.coatings?.name) {
        items.push({ label: 'Coatings', name: selection.coatings.name, price: selection.coatings.price });
    }
    if (selection.extras?.name) {
        items.push({ label: 'Extras', name: selection.extras.name, price: selection.extras.price });
    }
    if (selection.color?.name) {
        items.push({ label: 'Color', name: selection.color.name, price: 0 });
    }
    if (selection.frameData && selection.frameData['frame_price'] && selection.frameData['frame_model']) {
        items.push({ label: 'Frame', name: selection.frameData['frame_model'].value, price: parseFloat(selection.frameData['frame_price'].value) });
    }

    return items;
};
/**
 * Build table header
 * @returns {Array} Header row
 */
const buildTableHeader = () => {
    return [
        { text: 'Item', fontSize: 10, bold: true, fillColor: '#f5f5f5' },
        { text: 'Description', fontSize: 10, bold: true, fillColor: '#f5f5f5' },
        { text: 'Price', fontSize: 10, bold: true, alignment: 'right', fillColor: '#f5f5f5' }
    ];
};

/**
 * Build table body with all selections and configurations
 * @param {Array} selections - Array of selections
 * @returns {Array} Array of rows
 */
const buildTableBody = (selections) => {
    const rows = [buildTableHeader()];

    selections.forEach((selection, selIdx) => {
        const configItems = getConfigItems(selection);
        const selectionPrice = typeof selection.selectionPrice === 'number' ? selection.selectionPrice : 0;

        if (configItems.length === 0) {
            // No configs, just show product
            rows.push([
                { text: selection.name || 'Product', fontSize: 9, bold: true },
                { text: '-', fontSize: 8, color: '#999' },
                { text: formatCurrency(selectionPrice), fontSize: 9, alignment: 'right', bold: true }
            ]);
        } else {
            // First config row with product name
            const firstConfigTable = {
                table: {
                    widths: ['*', '*'],
                    body: [
                        [
                            { text: configItems[0].label, fontSize: 8, bold: true },
                            { text: configItems[0].name, fontSize: 8 }
                        ]
                    ]
                },
                layout: 'noBorders'
            };

            rows.push([
                { text: selection.name || 'Product', fontSize: 9, bold: true, rowSpan: configItems.length + 1 },
                firstConfigTable,
                { text: formatCurrency(configItems[0].price || 0), fontSize: 8, alignment: 'right', color: '#222' }
            ]);

            // Remaining config rows
            for (let i = 1; i < configItems.length; i++) {
                const configTable = {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                { text: configItems[i].label, fontSize: 8, bold: true },
                                { text: configItems[i].name, fontSize: 8 }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                };

                rows.push([
                    {},
                    configTable,
                    { text: formatCurrency(configItems[i].price || 0), fontSize: 8, alignment: 'right', color: '#222' }
                ]);
            }

            // Total row
            rows.push([
                { text: '', fillColor: '#f7eed2' },
                { text: 'Subtotal', fontSize: 8, bold: true, fillColor: '#f7eed2' },
                { text: formatCurrency(selectionPrice), fontSize: 9, alignment: 'right', bold: true, fillColor: '#f7eed2' }
            ]);
        }
    });

    return rows;
};

/**
 * Main function to build the order items section
 * @param {Object} order - Complete order object from database
 * @returns {Object} Complete order items section for pdfmake
 */
module.exports.buildOrderItems = (order) => {
    if (!isValidOrder(order)) {
        return {
            text: 'No items in this order',
            fontSize: 9,
            color: '#999',
            alignment: 'center',
            margin: [0, 20, 0, 20]
        };
    }

    return {
        stack: [
            {
                text: 'ORDER ITEMS',
                fontSize: 11,
                bold: true,
                color: '#000',
                margin: [0, 0, 0, 10]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', 80],
                    body: buildTableBody(order.selections)
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
                }
            },
            {
                canvas: [
                    { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#dddddd' }
                ],
                margin: [0, 10, 0, 10]
            }
        ],
        margin: [0, 0, 0, 10]
    };
};
/**
 * Get text summary of items
 * @param {Object} order - Complete order object from database
 * @returns {String} Plain text summary
 */
module.exports.getItemsSummary = (order) => {
    if (!isValidOrder(order)) {
        return 'No items';
    }

    return order.selections
        .map((sel, idx) => {
            const configs = getConfigItems(sel)
                .map(c => `${c.label}: ${c.name}`)
                .join(', ');
            const price = typeof sel.selectionPrice === 'number' ?
                formatCurrency(sel.selectionPrice) : '£0.00';
            return `${idx + 1}. ${sel.name || 'Product'} (${configs}) - ${price}`;
        })
        .join('\n');
};