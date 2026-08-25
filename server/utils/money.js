// --- Money helpers ---
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const MONEY_EPSILON = 0.01; // 1 cent tolerance for equality/overpayment 

module.exports = {
    round2,
    MONEY_EPSILON
}