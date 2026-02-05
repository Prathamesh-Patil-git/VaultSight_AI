const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Threat = require('../models/Threat');
const { calculateRiskScore } = require('../utils/riskScorer');
const { autoLock } = require('../services/lockService');
const { createAlert } = require('../services/alertService');
const { generateEmbedding } = require('../services/embeddingService');

const sendMoney = async (req, res, next) => {
  try {
    const { receiverUpiId, receiverAccountNumber, amount, note, device, location } = req.body;
    const sender = req.user;

    if (sender.isBlocked || sender.isLocked) {
      return res.status(403).json({ success: false, error: 'Account is restricted' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    // Step 1: Find receiver
    const receiver = await User.findOne({
      $or: [{ upiId: receiverUpiId }, { accountNumber: receiverAccountNumber }]
    });

    if (!receiver) {
      return res.status(404).json({ success: false, error: 'Recipient not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' });
    }

    // Step 2: Risk Scoring
    const riskInput = {
      amount,
      isNewDevice: device !== sender.lastLoginDevice,
      isNewLocation: location !== sender.lastLoginLocation,
      timestamp: new Date(),
      isNewBeneficiary: true // Simulated: check past txns for real implementation
    };
    
    const { score, level, flags } = calculateRiskScore(riskInput, null, { hasHighThreats: sender.riskScore > 50 });

    // Step 3: Create transaction record
    const txnId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
    const transaction = new Transaction({
      transactionId: txnId,
      userId: sender._id,
      receiverId: receiver._id,
      receiverUpiId: receiver.upiId,
      receiverAccountNumber: receiver.accountNumber,
      amount,
      type: 'send',
      note,
      location,
      device,
      ipAddress: req.ip,
      riskScore: score,
      riskLevel: level,
      riskFlags: flags,
      status: 'PENDING'
    });

    // Step 4: High Risk Handling
    if (level === 'HIGH' || level === 'CRITICAL') {
      const description = `High-value transfer of ₹${amount} to ${receiver.name} from ${device} in ${location}`;
      const embedding = await generateEmbedding(description);
      
      const threat = await Threat.create({
        threatId: 'TH' + Date.now(),
        description,
        embedding: embedding || Array(384).fill(0),
        riskLevel: level,
        riskScore: score,
        category: 'HIGH_VALUE_TRANSFER',
        affectedUserId: sender._id,
        relatedTransactionId: transaction._id,
        location,
        device,
        actionTaken: score > 75 ? 'LOCKED' : 'ALERTED'
      });

      await createAlert(
        level === 'CRITICAL' ? 'FRAUD_DETECTED' : 'HIGH_RISK_TRANSACTION',
        level === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        description,
        sender._id,
        transaction._id,
        threat._id
      );

      if (score > process.env.AUTO_LOCK_RISK_THRESHOLD || amount > process.env.AUTO_LOCK_AMOUNT_THRESHOLD) {
        await autoLock(sender._id, `Auto-locked due to high-risk transaction: ${score} risk points`);
        transaction.status = 'BLOCKED';
        await transaction.save();
        return res.status(403).json({ success: false, blocked: true, error: 'Transaction blocked and account locked for security', data: { score, level } });
      }

      transaction.status = 'FLAGGED';
    }

    // Step 5: Process Success/Flagged
    const transferAmount = Number(amount);
    
    // Refresh sender and receiver to be safe
    const latestSender = await User.findById(sender._id);
    const latestReceiver = await User.findById(receiver._id);

    latestSender.balance -= transferAmount;
    latestReceiver.balance += transferAmount;
    transaction.status = transaction.status === 'FLAGGED' ? 'FLAGGED' : 'COMPLETED';

    await latestSender.save();
    await latestReceiver.save();
    await transaction.save();

    res.status(200).json({ 
      success: true, 
      message: transaction.status === 'FLAGGED' ? 'Transaction completed but flagged for review' : 'Money sent successfully',
      data: transaction 
    });

  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({ success: true, data: req.user.toSafeObject() });
};

const getTransactions = async (req, res, next) => {
  try {
    const txns = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: txns });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMoney, getProfile, getTransactions };
