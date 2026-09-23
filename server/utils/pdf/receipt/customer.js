module.exports.buildCustomerInfo = (customer) => {

    const formatAddress = (address) => {
        if (!address) return "_";

        const parts = [
            address.street,
            address.address,
            address.city,
            address.postalCode,
            address.country
        ].filter(Boolean); // drop empty/undefined parts

        return parts.length ? parts.join(", ") : "_";
    };

    return {
        stack: [
            {
                text: "CUSTOMER INFORMATION",
                fontSize: 11,
                bold: true,
                color: "#000",
                margin: [0, 0, 0, 8]
            },
            {
                columns: [
                    {
                        stack: [
                            {
                                columns: [
                                    { text: "Name:", fontSize: 9, bold: true, width: 80 },
                                    { text: customer.name ? `${customer.name}` : "_", fontSize: 9, width: '*' }
                                ],
                                columnGap: 10,
                                margin: [0, 0, 0, 4]
                            },
                            {
                                columns: [
                                    { text: "Email:", fontSize: 9, bold: true, width: 80 },
                                    { text: customer.email ? `${customer.email}` : "_", fontSize: 9, width: '*' }
                                ],
                                columnGap: 10,
                                margin: [0, 0, 0, 4]
                            },
                            {
                                columns: [
                                    { text: "Phone:", fontSize: 9, bold: true, width: 80 },
                                    { text: customer.phone ? `${customer.phone}` : "_", fontSize: 9, width: '*' }
                                ],
                                columnGap: 10,
                                margin: [0, 0, 0, 4]
                            },
                            {
                                columns: [
                                    { text: "Address:", fontSize: 9, bold: true, width: 80 },
                                    { text: formatAddress(customer.address), fontSize: 9, width: '*' }
                                ],
                                columnGap: 10,
                                margin: [0, 0, 0, 0]
                            }
                        ],
                        width: '*'
                    }
                ]
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
                margin: [0, 10, 0, 10]
            }
        ],
        margin: [0, 0, 0, 10]
    };
}