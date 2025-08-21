const mongoose = require('mongoose');
const { Schema } = mongoose;
const { REACTION_TYPES } = require('./_subdocs');

const ReactionSchema = new Schema({
  targetType: { type: String, enum: ['post','comment'], required: true, index: true },
  targetId:   { type: Schema.Types.ObjectId, required: true, index: true },

  userId:  { type: Schema.Types.ObjectId, ref: 'User', index: true },
  deviceId:{ type: String, index: true }, // fallback identity

  type: { type: String, enum: REACTION_TYPES, required: true },

  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

// prevent multiple reactions of same user on same target (you can also allow replace)
ReactionSchema.index({ targetType: 1, targetId: 1, deviceId: 1 }, { unique: true, partialFilterExpression: { deviceId: { $exists: true } } });
ReactionSchema.index({ targetType: 1, targetId: 1, userId: 1 },   { unique: true, partialFilterExpression: { userId: { $exists: true } } });

module.exports = mongoose.models.Reaction || mongoose.model('Reaction', ReactionSchema);
