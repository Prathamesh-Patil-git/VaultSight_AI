const Alert = require('../models/Alert');

const createAlert = async (type, severity, message, userId, transactionId = null, threatId = null) => {
  const alert = new Alert({
    alertId: 'AL' + Date.now() + Math.floor(Math.random() * 1000),
    type,
    severity,
    message,
    affectedUserId: userId,
    relatedTransactionId: transactionId,
    relatedThreatId: threatId
  });
  return await alert.save();
};

module.exports = { createAlert };
