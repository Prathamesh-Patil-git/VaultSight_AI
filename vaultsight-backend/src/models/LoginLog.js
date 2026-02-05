const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String },
  ipAddress: { type: String },
  device: { type: String },
  location: { type: String },
  status: { type: String, enum: ['SUCCESS', 'FAILED', 'SUSPICIOUS', 'BLOCKED'], required: true },
  failureReason: { type: String },
  riskScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('LoginLog', loginLogSchema);
