const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  // Simulated identity (cookie or deviceId)
  deviceId: { type: String, index: true, unique: true },
  displayName: { type: String },           // optional nickname
  avatarUrl: { type: String },             // optional
  role: { type: String, enum: ['student','moderator','admin'], default: 'student' },
  badges: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now }
}, { versionKey: false });

UserSchema.index({ lastSeenAt: -1 });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
