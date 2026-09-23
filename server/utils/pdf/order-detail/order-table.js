const { formatCurrency } = require("../shared/helpers");

/**
 * Validate order object structure
 */
const isValidOrder = (order) => {
    return order &&
        Array.isArray(order.selections) &&
        order.selections.length > 0;
};

/**
 * Safely extract a value from frameData.
 *
 * Supports:
 * {
 *   frame_model: {
 *      name: "Frame",
 *      value: "Ray-Ban RB123"
 *   }
 * }
 *
 * as well as:
 *
 * {
 *   frame_model: "Ray-Ban RB123"
 * }
 */
const getFrameValue = (item) => {
    if (item === undefined || item === null) {
        return null;
    }

    if (typeof item === "object" && "value" in item) {
        return item.value;
    }

    return item;
};

/**
 * Add a detail row.
 */
const addDetailRow = (rows, label, value, price = null) => {
    rows.push([
        {
            text: label,
            fontSize: 8.5,
            bold: true
        },
        {
            text:
                value === undefined ||
                    value === null ||
                    value === ""
                    ? "—"
                    : String(value),
            fontSize: 8.5,
            color:
                value === undefined ||
                    value === null ||
                    value === ""
                    ? "#aaaaaa"
                    : "#333333"
        },
        {
            text:
                price !== null &&
                    price !== undefined
                    ? formatCurrency(price)
                    : "—",
            fontSize: 8.5,
            alignment: "right",
            color:
                price !== null &&
                    price !== undefined
                    ? "#333333"
                    : "#aaaaaa"
        }
    ]);
};

/**
 * Build the detailed rows for one selection.
 *
 * Columns:
 * Label | Selected value | Price
 */
const buildSelectionRows = (selection) => {
    const rows = [];

    if (!selection || typeof selection !== "object") {
        return rows;
    }

    addDetailRow(
        rows,
        "Age group",
        selection.ageGroup?.name,
        selection.ageGroup?.price
    );

    addDetailRow(
        rows,
        "Lens type",
        selection.lensType?.name,
        selection.lensType?.price
    );

    addDetailRow(
        rows,
        "Lens subtype",
        selection.lensSubtype?.name,
        selection.lensSubtype?.price
    );

    // Power range
    const hasPowerRange =
        selection.powerMap?.min != null &&
        selection.powerMap?.max != null;

    addDetailRow(
        rows,
        "Power range",
        hasPowerRange
            ? `${selection.powerMap.min} to ${selection.powerMap.max}`
            : null,
        null
    );

    addDetailRow(
        rows,
        "Recommended lens",
        selection.recommendedLens?.name,
        selection.recommendedLens?.price
    );

    addDetailRow(
        rows,
        "Design",
        selection.design?.name,
        selection.design?.price
    );

    addDetailRow(
        rows,
        "Coatings",
        selection.coatings?.name,
        selection.coatings?.price
    );

    addDetailRow(
        rows,
        "Extras",
        selection.extras?.name,
        selection.extras?.price
    );

    addDetailRow(
        rows,
        "Color",
        selection.color?.name,
        null
    );

    addDetailRow(
        rows,
        "RE PD",
        selection.rePd,
        null
    );

    addDetailRow(
        rows,
        "LE PD",
        selection.lePd,
        null
    );

    addDetailRow(
        rows,
        "RE H",
        selection.reH,
        null
    );

    addDetailRow(
        rows,
        "LE H",
        selection.leH,
        null
    );

    // --------------------------------------------------------------
    // Frame data
    // --------------------------------------------------------------

    if (
        selection.frameData &&
        typeof selection.frameData === "object"
    ) {
        Object.values(selection.frameData).forEach((item) => {
            if (
                item === undefined ||
                item === null
            ) {
                return;
            }

            // frameData is expected to contain:
            // { name, value }
            //
            // Skip entries that don't have a meaningful value.
            const label =
                typeof item === "object" && item.name
                    ? item.name
                    : null;

            const value = getFrameValue(item);

            if (!label && (value === null || value === undefined)) {
                return;
            }

            addDetailRow(
                rows,
                label || "Frame",
                value,
                null
            );
        });
    }

    return rows;
};

/**
 * Build the detailed table body.
 */
const buildDetailedTableBody = (
    selections,
    sightTest
) => {
    const rows = [];

    // --------------------------------------------------------------
    // Sight test
    // --------------------------------------------------------------

if (sightTest && sightTest.hadTest) {
    rows.push([
        { text: 'Sight Test', fontSize: 9, bold: true },
        { text: `${sightTest.tier}`, fontSize: 9 },
        { text: formatCurrency(sightTest.price), fontSize: 9 },
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
        {},
        {}
    ]);
}

    // --------------------------------------------------------------
    // Selections
    // --------------------------------------------------------------

    selections.forEach((selection, index) => {
        // Selection heading
        rows.push([
            {
                text: `Item ${index + 1}`,
                fontSize: 9.5,
                bold: true,
                fillColor: "#f7eed2"
            },
            {
                text: "",
                fontSize: 9.5,
                bold: true,
                fillColor: "#f7eed2"
            },
            {
                text: "",
                fontSize: 9.5,
                bold: true,
                alignment: "right",
                fillColor: "#f7eed2"
            }
        ]);

        // Configuration rows
        const detailRows = buildSelectionRows(selection);

        detailRows.forEach(row => {
            rows.push(row);
        });

        // Notes
        if (selection.selectionNotes) {
            rows.push([
                {
                    text: "Notes",
                    fontSize: 8.5,
                    bold: true,
                    fillColor: "#f8f8f8"
                },
                {
                    text: selection.selectionNotes,
                    fontSize: 8.5,
                    colSpan: 2,
                    fillColor: "#f8f8f8"
                },
                {}
            ]);
        }

        // Item subtotal
        rows.push([
            {
                text: "Item Subtotal",
                fontSize: 9,
                bold: true,
                fillColor: "#f7eed2"
            },
            {
                text: "",
                fillColor: "#f7eed2"
            },
            {
                text: formatCurrency(
                    typeof selection.selectionPrice === "number"
                        ? selection.selectionPrice
                        : 0
                ),
                fontSize: 9,
                bold: true,
                alignment: "right",
                fillColor: "#f7eed2"
            }
        ]);

        // Separator between products
        if (index < selections.length - 1) {
            rows.push([
                {
                    colSpan: 3,
                    canvas: [
                        {
                            type: "line",
                            x1: 0,
                            y1: 0,
                            x2: 515,
                            y2: 0,
                            lineWidth: 0.8,
                            lineColor: "#dddddd"
                        }
                    ],
                    margin: [0, 10, 0, 10],
                    border: [false, false, false, false]
                },
                {},
                {}
            ]);
        }
    });

    return rows;
};

/**
 * Build detailed order items section.
 */
module.exports.buildDetailedOrderItems = (order) => {
    if (!isValidOrder(order)) {
        return {
            text: "No items in this order",
            fontSize: 9,
            color: "#999",
            alignment: "center",
            margin: [0, 20, 0, 20]
        };
    }

    const bodyRows = buildDetailedTableBody(
        order.selections,
        order.sightTest
    );

    if (bodyRows.length === 0) {
        return {
            text: "No order details available",
            fontSize: 9,
            color: "#999",
            alignment: "center"
        };
    }

    return {
        table: {
            headerRows: 1,
            widths: [130, "*", 80],
            body: bodyRows
        },

        layout: {
            hLineWidth: () => 0.4,
            hLineColor: () => '#DFBC58',

            vLineWidth: () => 0.5,
            vLineColor: () => '#E8C980',

            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6,
        },

        margin: [0, 0, 0, 12]
    };
};