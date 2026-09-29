const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: String, default: 'System/Demo Admin' },
  action: { type: String, required: true },
  entityId: { type: String },
  beforeValue: { type: mongoose.Schema.Types.Mixed },
  afterValue: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// Prevent deletion of audit logs (basic middleware)
auditLogSchema.pre('remove', function(next) {
  const err = new Error("Audit logs cannot be deleted.");
  next(err);
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
