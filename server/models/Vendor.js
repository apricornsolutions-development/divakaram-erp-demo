const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gstNumber: { type: String },
  panNumber: { type: String },
  rating: { type: Number, default: 5 }, // 1 to 5
  defectivePercentage: { type: Number, default: 0 },
  contactPerson: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
