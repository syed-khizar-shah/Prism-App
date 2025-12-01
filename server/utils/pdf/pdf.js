const PdfPrinter = require("pdfmake")
const path = require("path");
const { buildHeader } = require("./header");
const { buildCustomerInfo } = require("./customer");
const { buildOrderItems } = require("./order-table");
const { buildOrderTotals } = require("./total");


const fonts = {
    Roboto: {
        normal: path.join(__dirname, "..","..", "assets", "fonts", "Roboto-Regular.ttf"),
        bold: path.join(__dirname, "..","..", "assets", "fonts", "Roboto-Medium.ttf"),
        italics: path.join(__dirname, "..","..", "assets", "fonts", "Roboto-Italic.ttf"),
        bolditalics: path.join(__dirname, "..","..", "assets", "fonts", "Roboto-MediumItalic.ttf")
    }
};

const printer = new PdfPrinter(fonts);

function generateReceiptBuffer(order) {
    return new Promise((resolve, reject) => {
        const docDefinition = {
            pageMargins: [40, 50, 40, 40],
            content: [
                buildHeader(order),
                buildCustomerInfo(order.customer),
                buildOrderItems(order),
                buildOrderTotals(order.pricing)
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
}