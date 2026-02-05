const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  threatId: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  embedding: { type: [Number], required: true }, // 384 dimensions
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  riskScore: { type: Number, required: true },
  isCritical: { type: Boolean, default: false },
  category: { 
    type: String, 
    enum: ['FRAUD_TRANSACTION', 'LOGIN_ANOMALY', 'BRUTE_FORCE', 'ACCOUNT_TAKEOVER', 'UNUSUAL_PATTERN', 'HIGH_VALUE_TRANSFER'],
    required: true 
  },
  affectedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  location: { type: String },
  device: { type: String },
  actionTaken: { type: String, enum: ['NONE', 'ALERTED', 'LOCKED', 'BLOCKED', 'INVESTIGATING'], default: 'NONE' },
  resolvedAt: { type: Date },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Threat', threatSchema);
