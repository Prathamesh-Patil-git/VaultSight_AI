/**
 * Calculates risk score for a transaction
 */
const calculateRiskScore = (transactionData, lastTransaction, userStats) => {
  let score = 0;
  const flags = [];

  const { amount, isNewDevice, isNewLocation, timestamp } = transactionData;
  const hour = new Date(timestamp).getHours();

  // 1. Amount thresholds
  if (amount > 100000) {
    score = 35; // Cap for amount part, or use higher weighted logic
    flags.push('HIGH_AMOUNT');
  } else if (amount > 50000) {
    score = 20;
    flags.push('MEDIUM_AMOUNT');
  }

  // 2. Beneficiary logic (simulated for simplicity)
  // In real case, check if receiverId is in user's past transactions
  if (transactionData.isNewBeneficiary) {
    score += 20;
    flags.push('NEW_BENEFICIARY');
  }

  // 3. Device anomaly
  if (isNewDevice) {
    score += 15;
    flags.push('NEW_DEVICE');
  }

  // 4. Location anomaly
  if (isNewLocation) {
    score += 20;
    flags.push('NEW_LOCATION');
  }

  // 5. Unusual hour (11pm - 5am IST is roughly hour 23 to 5)
  if (hour >= 23 || hour <= 5) {
    score += 10;
    flags.push('UNUSUAL_TIME');
  }

  // 6. Existing threats
  if (userStats.hasHighThreats) {
    score += 10;
    flags.push('EXISTING_THREATS');
  }

  // Cap at 100
  score = Math.min(score, 100);

  let level;
  if (score <= 30) level = 'LOW';
  else if (score <= 60) level = 'MEDIUM';
  else if (score <= 80) level = 'HIGH';
  else level = 'CRITICAL';

  return { score, level, flags };
};

module.exports = { calculateRiskScore };
