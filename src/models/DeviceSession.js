const mongoose = require('mongoose');
const { Schema } = mongoose;

const DeviceSessionSchema = new Schema({
  deviceId: { type: String, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  ua: String,
  ipHash: String,         // hash IP for privacy if needed
  createdAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now }
}, { versionKey: false });

DeviceSessionSchema.index({ deviceId: 1, lastSeenAt: -1 });

module.exports = mongoose.models.DeviceSession || mongoose.model('DeviceSession', DeviceSessionSchema);
