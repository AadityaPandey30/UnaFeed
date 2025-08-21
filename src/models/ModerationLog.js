const mongoose = require('mongoose');
const { Schema } = mongoose;

const ModerationLogSchema = new Schema({
  actor: { type: String, enum: ['ai','human'], default: 'ai' },
  action: { type: String, enum: ['flag','hide','unhide','delete','warn','suggest_rewrite'], required: true },
  targetType: { type: String, enum: ['post','comment'], required: true },
  targetId: { type: Schema.Types.ObjectId, required: true, index: true },
  context: { type: Schema.Types.Mixed },  // AI scores, category labels, note
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

ModerationLogSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

module.exports = mongoose.models.ModerationLog || mongoose.model('ModerationLog', ModerationLogSchema);
