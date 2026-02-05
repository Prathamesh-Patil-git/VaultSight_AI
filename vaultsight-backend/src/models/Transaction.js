const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverUpiId: { type: String },
  receiverAccountNumber: { type: String },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['send', 'receive', 'upi'] },
  note: { type: String },
  location: { type: String },
  device: { type: String },
  ipAddress: { type: String },
  isNewDevice: { type: Boolean, default: false },
  isNewLocation: { type: Boolean, default: false },
  riskScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
  riskFlags: [{ type: String }],
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'FLAGGED', 'BLOCKED', 'FAILED'], default: 'PENDING' },
  isFraud: { type: Boolean, default: false },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
