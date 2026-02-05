const User = require('../models/User');
const Alert = require('../models/Alert');
const { v4: uuidv4 } = require('uuid');

const autoLock = async (userId, reason) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.isLocked = true;
  user.lockReason = reason;
  user.lockedAt = new Date();
  await user.save();

  const alert = new Alert({
    alertId: 'AL' + Date.now(),
    type: 'AUTO_LOCK',
    severity: 'CRITICAL',
    message: `Account auto-locked: ${reason}`,
    affectedUserId: userId
  });
  await alert.save();

  return user;
};

const manualUnlock = async (userId, adminId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.isLocked = false;
  user.lockReason = null;
  user.lockedAt = null;
  await user.save();

  const alert = new Alert({
    alertId: 'AL' + Date.now(),
    type: 'ACCOUNT_LOCKED',
    severity: 'INFO',
    message: 'Account unlocked by admin',
    affectedUserId: userId,
    acknowledgedBy: adminId,
    isAcknowledged: true
  });
  await alert.save();

  return user;
};

module.exports = { autoLock, manualUnlock };
