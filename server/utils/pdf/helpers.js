/**
 * Helper function to format currency values
 * @param {Number} value - The value to format
 * @returns {String} Formatted currency string
 */
module.exports.formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '£0.00';
    }
    return `£${value.toFixed(2)}`;
};