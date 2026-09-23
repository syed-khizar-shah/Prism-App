const PdfPrinter = require("pdfmake")
const path = require("path");
const { buildHeader } = require("./receipt/header");
const { buildCustomerInfo } = require("./receipt/customer");
const { buildOrderItems } = require("./receipt/order-table");
const { buildOrderTotals } = require("./receipt/total");
const { buildSightTests } = require("./receipt/sight-test");
const { getConfig } = require("../../controllers/reportConfigController");
const { buildOrderDetailHeader } = require("./order-detail/header");
const { buildDetailedOrderItems } = require("./order-detail/order-table");
const { buildDetailedOrderTotals } = require("./order-detail/detail-total");


const fonts = {
    Roboto: {
        normal: path.join(__dirname, "..", "..", "assets", "fonts", "Roboto-Regular.ttf"),
        bold: path.join(__dirname, "..", "..", "assets", "fonts", "Roboto-Medium.ttf"),
        italics: path.join(__dirname, "..", "..", "assets", "fonts", "Roboto-Italic.ttf"),
        bolditalics: path.join(__dirname, "..", "..", "assets", "fonts", "Roboto-MediumItalic.ttf")
    }
};

const printer = new PdfPrinter(fonts);

function generateReceiptBuffer(order,sections) {
    console.log({sections});

    return new Promise((resolve, reject) => {
        const docDefinition = {
            pageMargins: [40, 50, 40, 40],
            content: [
                buildHeader(order),
                buildCustomerInfo(order.customer),
                // buildSightTests(order.sightTest),
                buildOrderItems(order,sections.items),
                buildOrderTotals(order.pricing, order.payment, sections.totals)
            ]
        };

        try {
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            const chunks = [];

            pdfDoc.on("data", (c) => chunks.push(c));
            pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
            pdfDoc.on("error", reject);

            pdfDoc.end();
        } catch (err) {
            reject(err);
        }
    });
}

function generateOrderDetailPdfBuffer(order,sections) {
    console.log({sections});

    return new Promise((resolve, reject) => {
        const docDefinition = {
            pageMargins: [40, 50, 40, 40],
            content: [
                buildOrderDetailHeader(order),
                // buildCustomerInfo(order.customer),
                // buildSightTests(order.sightTest),
                buildDetailedOrderItems(order,sections.items),
                // buildOrderTotals(order.pricing, order.payment, sections.totals)
                buildDetailedOrderTotals(order.pricing)
            ]
        };

        try {
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            const chunks = [];

            pdfDoc.on("data", (c) => chunks.push(c));
            pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
            pdfDoc.on("error", reject);

            pdfDoc.end();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    generateReceiptBuffer,
    generateOrderDetailPdfBuffer
}