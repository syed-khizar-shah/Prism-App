const path = require("path");
const fs = require("fs")

const logoPath = path.join(__dirname, '../../../assets/logo.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');

module.exports.buildHeader = (order) => {
    return {
        stack: [
            // Top section: Logo + Company Info (LEFT) | Order Info (RIGHT)
            {
                columns: [
                    {
                        stack: [
                            {
                                columns: [
                                    {
                                        image: 'data:image/png;base64,' + logoBase64,
                                        width: 100,
                                        valign: "center"
                                    },
                                    // {
                                    //     stack: [
                                    //         {
                                    //             text: "2020 OPTIX",
                                    //             fontSize: 28,
                                    //             bold: true,
                                    //             color: "#000"
                                    //         },
                                    //         {
                                    //             text: "Professional Eyewear Solutions",
                                    //             fontSize: 12,
                                    //             color: "#111",
                                    //             margin: [0, 4, 0, 0]
                                    //         }
                                    //     ],
                                    //     margin: [16, 0, 0, 0],
                                    //     valign: "center"

                                    // }
                                ],
                                columnGap: 8,
                                valign: "center"
                            }
                        ],
                        width: '*'
                    },
                    {
                        stack: [
                            {
                                text: "RECEIPT",
                                fontSize: 12,
                                bold: true,
                                color: "#000",
                                alignment: "right",
                                margin: [0, 0, 0, 5]
                            },
                            {
                                columns: [
                                    { text: "Order ID:", fontSize: 9, bold: true, width: 100 },
                                    { text: `${order.orderId}`, fontSize: 9, width: '*', alignment: "right" }
                                ],
                                columnGap: 5,
                                margin: [0, 0, 0, 3]
                            },
                            {
                                columns: [
                                    { text: "Date:", fontSize: 9, bold: true, width: 100 },
                                    { text: `${new Date(order.orderDate).toLocaleDateString()}`, fontSize: 9, width: '*', alignment: "right" }
                                ],
                                columnGap: 5,
                                margin: [0, 0, 0, 3]
                            },
                            // {
                            //     columns: [
                            //         { text: "Time:", fontSize: 9, bold: true, width: 100 },
                            //         { text: `${new Date(order.orderDate).toLocaleTimeString()}`, fontSize: 9, width: '*', alignment: "right" }
                            //     ],
                            //     columnGap: 5,
                            //     margin: [0, 0, 0, 0]
                            // }
                        ],
                        width: 'auto',
                        alignment: "right",
                        valign: "center"
                    }
                ],
                columnGap: 40,
                margin: [0, 0, 0, 15]
            },

            // Divider line
            {
                canvas: [
                    {
                        type: 'line',
                        x1: 0,
                        y1: 0,
                        x2: 515,
                        y2: 0,
                        lineWidth: 1,
                        lineColor: "#dddddd"
                    }
                ],
                margin: [0, 0, 0, 10]
            }
        ],
        margin: [0, 20, 0, 10]
    };
}