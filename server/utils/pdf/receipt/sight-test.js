const { formatCurrency } = require("../shared/helpers")

/**
 * Build totals section for receipt
 * @param {Object} order - Complete order object with pricing details
 * @returns {Object} Totals section for pdfmake
 */
module.exports.buildSightTests = (test) => {
    console.log({ test })
    if (!test) {
        return {};
    }
    if (!test.hadTest) {
        return {};
    }

    const rows = [];

    // Subtotal
    rows.push([
        { text: 'Sight Test', fontSize: 9, bold:true },
        { text: `${test.tier}`, fontSize: 9 },
        { text: formatCurrency(test.price), fontSize: 9 },
    ]);


    return {
        stack: [
            {
                table: {
                    headerRows: 0,
                    widths: ['auto', '*', 90],           // you can try ['25%', '*', 100] or [140, '*', 100] too
                    body: rows
                },
                layout: {
                    hLineWidth: (i, node) => {
                        const row = node.table.body[i];
                        // Thicker line for product separators
                        if (row && row[0] && row[0].colSpan === 3 && row[0].border) {
                            return 1.6;           // ← still bold, but slightly thinner than before
                        }
                        // Normal rows — very light or zero if you prefer minimal lines
                        return i === 0 || i === node.table.body.length ? 0.7 : 0.4;
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
                    { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#DFBC58' }
                ],
                margin: [0, 12, 0, 12]                    // slightly more space around the underline
            }
        ],
        margin: [0, 0, 0, 12]
    };
};