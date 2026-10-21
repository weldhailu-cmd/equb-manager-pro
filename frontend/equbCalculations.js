/**
 * Calculates Equb service fee and net payout.
 * @param {number} poolAmount - Total money pool (e.g., 10000)
 * @param {number} feePercentage - Service fee rate in percentage (e.g., 0.6 for 0.6%)
 * @returns {{ serviceFee: number, netPayout: number, poolAmount: number, feePercentage: number }}
 */
export const calculateEqubPayout = (poolAmount = 0, feePercentage = 0.6) => {
  const numericPool = Number(poolAmount) || 0;
  const numericFeeRate = Number(feePercentage) || 0;

  // 10,000 * (0.6 / 100) = 60 ETB
  const serviceFee = (numericPool * numericFeeRate) / 100;

  // 10,000 - 60 = 9,940 ETB
  const netPayout = numericPool - serviceFee;

  return {
    poolAmount: numericPool,
    feePercentage: numericFeeRate,
    serviceFee: Math.round(serviceFee * 100) / 100, // Round to 2 decimal places
    netPayout: Math.round(netPayout * 100) / 100,
  };
};