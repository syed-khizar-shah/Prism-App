// const { formatCurrency } = require("./helpers")

// /**
//  * Helper function to validate order object structure
//  * @param {Object} order - Order object to validate
//  * @returns {Boolean} True if order has required properties
//  */
// const isValidOrder = (order) => {
//     return order &&
//         Array.isArray(order.selections) &&
//         order.selections.length > 0;
// };

// /**
//  * Extract configuration details without prices
//  * @param {Object} selection - Order selection object
//  * @returns {Array} Array of {label, name, price} objects
//  */
// const getConfigItems = (selection) => {
//     if (!selection || typeof selection !== 'object') {
//         return [];
//     }

//     const items = [];

//     if (selection.ageGroup?.name) {
//         items.push({ label: 'Age Group', name: selection.ageGroup.name, price: selection.ageGroup.price });
//     }
//     if (selection.lensType?.name) {
//         items.push({ label: 'Lens Type', name: selection.lensType.name, price: selection.lensType.price });
//     }
//     if (selection.lensSubtype?.name) {
//         items.push({ label: 'Lens Subtype', name: selection.lensSubtype.name, price: selection.lensSubtype.price });
//     }
//     if (selection.recommendedLens?.name) {
//         items.push({ label: 'Recommended Lens', name: selection.recommendedLens.name, price: selection.recommendedLens.price });
//     }
//     if (selection.design?.name) {
//         items.push({ label: 'Design', name: selection.design.name, price: selection.design.price });
//     }
//     if (selection.coatings?.name) {
//         items.push({ label: 'Coatings', name: selection.coatings.name, price: selection.coatings.price });
//     }
//     if (selection.extras?.name) {
//         items.push({ label: 'Extras', name: selection.extras.name, price: selection.extras.price });
//     }
//     if (selection.color?.name) {
//         items.push({ label: 'Color', name: selection.color.name, price: 0 });
//     }
//     if (selection.frameData && selection.frameData['frame_price'] && selection.frameData['frame_model']) {
//         items.push({ label: 'Frame', name: selection.frameData['frame_model'].value, price: parseFloat(selection.frameData['frame_price'].value) });
//     }

//     return items;
// };
// /**
//  * Build table header
//  * @returns {Array} Header row
//  */
// const buildTableHeader = () => {
//     return [
//         { text: 'Item', fontSize: 10, bold: true, fillColor: '#f5f5f5' },
//         { text: 'Description', fontSize: 10, bold: true, fillColor: '#f5f5f5' },
//         { text: 'Price', fontSize: 10, bold: true, alignment: 'right', fillColor: '#f5f5f5' }
//     ];
// };

// /**
//  * Build table body with all selections and configurations
//  * @param {Array} selections - Array of selections
//  * @returns {Array} Array of rows
//  */
// const buildTableBody = (selections) => {
//     const rows = [buildTableHeader()];

//     selections.forEach((selection, selIdx) => {
//         const configItems = getConfigItems(selection);
//         const selectionPrice = typeof selection.selectionPrice === 'number' ? selection.selectionPrice : 0;

//         if (configItems.length === 0) {
//             // No configs, just show product
//             rows.push([
//                 { text: selection.name || 'Product', fontSize: 9, bold: true },
//                 { text: '-', fontSize: 8, color: '#999' },
//                 { text: formatCurrency(selectionPrice), fontSize: 9, alignment: 'right', bold: true }
//             ]);
//         } else {
//             // First config row with product name
//             const firstConfigTable = {
//                 table: {
//                     widths: ['*', '*'],
//                     body: [
//                         [
//                             { text: configItems[0].label, fontSize: 8, bold: true },
//                             { text: configItems[0].name, fontSize: 8 }
//                         ]
//                     ]
//                 },
//                 layout: 'noBorders'
//             };

//             rows.push([
//                 { text: selection.name || 'Product', fontSize: 9, bold: true, rowSpan: configItems.length + 1 },
//                 firstConfigTable,
//                 { text: formatCurrency(configItems[0].price || 0), fontSize: 8, alignment: 'right', color: '#222' }
//             ]);

//             // Remaining config rows
//             for (let i = 1; i < configItems.length; i++) {
//                 const configTable = {
//                     table: {
//                         widths: ['*', '*'],
//                         body: [
//                             [
//                                 { text: configItems[i].label, fontSize: 8, bold: true },
//                                 { text: configItems[i].name, fontSize: 8 }
//                             ]
//                         ]
//                     },
//                     layout: 'noBorders'
//                 };

//                 rows.push([
//                     {},
//                     configTable,
//                     { text: formatCurrency(configItems[i].price || 0), fontSize: 8, alignment: 'right', color: '#222' }
//                 ]);
//             }

//             // Total row
//             rows.push([
//                 { text: '', fillColor: '#f7eed2' },
//                 { text: 'Subtotal', fontSize: 8, bold: true, fillColor: '#f7eed2' },
//                 { text: formatCurrency(selectionPrice), fontSize: 9, alignment: 'right', bold: true, fillColor: '#f7eed2' }
//             ]);
//         }
//     });

//     return rows;
// };

// /**
//  * Main function to build the order items section
//  * @param {Object} order - Complete order object from database
//  * @returns {Object} Complete order items section for pdfmake
//  */
// module.exports.buildOrderItems = (order) => {
//     if (!isValidOrder(order)) {
//         return {
//             text: 'No items in this order',
//             fontSize: 9,
//             color: '#999',
//             alignment: 'center',
//             margin: [0, 20, 0, 20]
//         };
//     }

//     return {
//         stack: [
//             {
//                 text: 'ORDER ITEMS',
//                 fontSize: 11,
//                 bold: true,
//                 color: '#000',
//                 margin: [0, 0, 0, 10]
//             },
//             {
//                 table: {
//                     headerRows: 1,
//                     widths: ['auto', '*', 80],
//                     body: buildTableBody(order.selections)
//                 },
//                 layout: {
//                     hLineWidth: (i, node) => 1,
//                     hLineColor: () => '#ddd',
//                     vLineWidth: () => 1,
//                     vLineColor: () => '#ddd',
//                     paddingLeft: () => 8,
//                     paddingRight: () => 8,
//                     paddingTop: () => 6,
//                     paddingBottom: () => 6
//                 }
//             },
//             {
//                 canvas: [
//                     { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#dddddd' }
//                 ],
//                 margin: [0, 10, 0, 10]
//             }
//         ],
//         margin: [0, 0, 0, 10]
//     };
// };
// /**
//  * Get text summary of items
//  * @param {Object} order - Complete order object from database
//  * @returns {String} Plain text summary
//  */
// module.exports.getItemsSummary = (order) => {
//     if (!isValidOrder(order)) {
//         return 'No items';
//     }

//     return order.selections
//         .map((sel, idx) => {
//             const configs = getConfigItems(sel)
//                 .map(c => `${c.label}: ${c.name}`)
//                 .join(', ');
//             const price = typeof sel.selectionPrice === 'number' ?
//                 formatCurrency(sel.selectionPrice) : '£0.00';
//             return `${idx + 1}. ${sel.name || 'Product'} (${configs}) - ${price}`;
//         })
//         .join('\n');
// };

// ----------------------------------------------------------------------------------------------
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
 * Extract configuration details
 * @param {Object} selection - Order selection object
 * @returns {Array} Array of {label, name, price} objects
 */
const getConfigItems = (selection, itemRowConfiguration) => {
    if (!selection || typeof selection !== 'object') {
        return [];
    }

    const {rows} = itemRowConfiguration;

    const items = [];

    // Frame first (as you originally had it)
    if (rows.get('frame')?.enabled && selection.frameData && selection.frameData['frame_price'] && selection.frameData['frame_model']) {
        items.push({
            label: rows.get('frame')?.label || 'Frame',
            name: selection.frameData['frame_model'].value,
            price: parseFloat(selection.frameData['frame_price'].value)
        });
    }
    if (rows.get('ageGroup')?.enabled && selection.ageGroup?.name) {
        items.push({ label: rows.get('ageGroup')?.label || 'Age Group', name: selection.ageGroup.name, price: selection.ageGroup.price });
    }
    if (rows.get('lensType')?.enabled && selection.lensType?.name) {
        items.push({ label: rows.get('lensType')?.label || 'Lens Type', name: selection.lensType.name, price: selection.lensType.price });
    }
    if (rows.get('lensSubtype')?.enabled && selection.lensSubtype?.name) {
        items.push({ label: rows.get('lensSubtype')?.label || 'Lens Subtype', name: selection.lensSubtype.name, price: selection.lensSubtype.price });
    }
    if (rows.get('lensIndex')?.enabled && selection.recommendedLens?.name) {
        items.push({ label: rows.get('lensIndex')?.label || 'Lens Index', name: selection.recommendedLens.name, price: selection.recommendedLens.price });
    }
    if (rows.get('design')?.enabled && selection.design?.name && selection.design?.isVisible) {
        items.push({ label: rows.get('design')?.label || 'Design', name: selection.design.name, price: selection.design.price });
    }
    if (rows.get('coatings')?.enabled && selection.coatings?.name) {
        items.push({ label: rows.get('coatings')?.label || 'Coatings', name: selection.coatings.name, price: selection.coatings.price });
    }
    if (rows.get('extras')?.enabled && selection.extras?.name) {
        items.push({ label: rows.get('extras')?.label || 'Extras', name: selection.extras.name, price: selection.extras.price });
    }
    if (rows.get('color')?.enabled && selection.color?.name) {    
        items.push({ label: rows.get('color')?.label || 'Color', name: selection.color.name, price: 0 });
    }

    return items;
};

/**
 * Build table body – 3 columns: Label | Selection | Price
 * Adds a bold separator line between products
 * @param {Array} selections - Array of selections
 * @returns {Array} Array of rows
 */
const buildTableBody = (selections, sighTest, itemRowConfiguration) => {
    const rows = [];

    if (sighTest && sighTest.hadTest) {
        rows.push([
            { text: 'Sight Test', fontSize: 9, bold: true },
            { text: `${sighTest.tier}`, fontSize: 9 },
            { text: formatCurrency(sighTest.price), fontSize: 9 },
        ]);
        rows.push([
            {
                colSpan: 3,
                canvas: [
                    {
                        type: 'line',
                        x1: -8,
                        y1: 0,
                        x2: 507,
                        y2: 0,
                        lineWidth: 1,
                        lineColor: "#dddddd"
                    }
                ],
                margin: [0, 10, 0, 10],
                border: [false, false, false, false],
            },
            {}, {}
        ]);
    }

    selections.forEach((selection, index) => {
        const configItems = getConfigItems(selection, itemRowConfiguration);
        const selectionPrice = typeof selection.selectionPrice === 'number' ? selection.selectionPrice : 0;

        // Optional product title (you can remove this block if not wanted)

        // Config rows
        configItems.forEach(item => {
            rows.push([
                { text: item.label, fontSize: 9, bold: true },
                { text: item.name || '-', fontSize: 9 },
                {
                    text: formatCurrency(item.price || 0),
                    fontSize: 9,
                    // alignment: 'right' 
                }
            ]);
        });

        if(itemRowConfiguration.rows.get('subtotal')?.enabled)
        // Subtotal row
        rows.push([
            { text: itemRowConfiguration.rows.get('subtotal')?.label || 'Subtotal', fontSize: 9, bold: true, fillColor: '#f7eed2' },
            { text: '', fillColor: '#f7eed2' },
            {
                text: formatCurrency(selectionPrice),
                fontSize: 10,
                bold: true,
                // alignment: 'right', 
                fillColor: '#f7eed2'
            }
        ]);

        // Add bold separator line between products (except after the last one)
        // if (index < selections.length - 1) {
        //     rows.push([
        //         { 
        //             text: '', 
        //             colSpan: 3, 
        //             border: [false, true, false, false],
        //             borderColor: '#000000',
        //             // We control thickness via layout below
        //         },
        //         {}, {}
        //     ]);
        // }
        if (index < selections.length - 1) {
            // rows.push([
            //     {
            //         text: '',
            //         colSpan: 3,
            //         border: [false, true, false, false],
            //         borderColor: '#000000',
            //     },
            //     {}, {}
            // ]);
            rows.push([
            {
                colSpan: 3,
                canvas: [
                    {
                        type: 'line',
                        x1: -8,
                        y1: 0,
                        x2: 507,
                        y2: 0,
                        lineWidth: 1,
                        lineColor: "#dddddd"
                    }
                ],
                margin: [0, 10, 0, 10],
                border: [false, false, false, false],
            },
            {}, {}
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
module.exports.buildOrderItems = (order, itemRowConfiguration) => {
    if (!isValidOrder(order)) {
        return {
            text: 'No items in this order',
            fontSize: 9,
            color: '#999',
            alignment: 'center',
            margin: [0, 20, 0, 20]
        };
    }

    const bodyRows = buildTableBody(order.selections, order.sightTest, itemRowConfiguration);

    if (bodyRows.length === 0) {
        return { text: 'No configurable items' };
    }

    return {
        stack: [
            {
                table: {
                    headerRows: 0,
                    widths: ['auto', '*', 90],           // you can try ['25%', '*', 100] or [140, '*', 100] too
                    body: bodyRows
                },
                layout: {
                    hLineWidth: (i, node) => {
                        const row = node.table.body[i];
                        return 0.4;
                        //                         // Thicker line for product separators
                        // if (row && row[0] && row[0].colSpan === 3 && row[0].border) {
                        //     return 0.4;           // ← still bold, but slightly thinner than before
                        // }
                        // // Normal rows — very light or zero if you prefer minimal lines
                        // return i === 0 || i === node.table.body.length ? 0.7 : 0.4;
                    },
                    hLineColor: () => '#DFBC58',          // ← all horizontal lines use your color

                    vLineWidth: () => 0.5,                // a bit stronger than before
                    vLineColor: () => '#E8C980',          // slightly darker/lighter variant of #DFBC58
                    //          or use '#DFBC58' if you want perfect match

                    // ─── Increased padding ───
                    paddingLeft: () => 8,               // was 6
                    paddingRight: () => 8,               // was 6
                    paddingTop: () => 6,               // was 5
                    paddingBottom: () => 6,               // was 5
                }
            },
            {
                canvas: [
                    { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#dddddd' }
                ],
                margin: [0, 12, 0, 12]                    // slightly more space around the underline
            }
        ],
        margin: [0, 0, 0, 12]
    };
};

// getItemsSummary remains the same
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