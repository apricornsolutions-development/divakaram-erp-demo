const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  serialNumber: { type: String, required: true },
  rfidEpc: { type: String, required: true, unique: true },
  brand: { type: String },
  model: { type: String },
  status: { 
    type: String, 
    enum: ['Received', 'QC Pending', 'Under Repair', 'Ready to Sell', 'Sold', 'Dispatched', 'Security Lockdown'], 
    default: 'Received' 
  },
  location: { type: String, default: 'Receiving Dock' },
  salePrice: { type: Number },
  buyer: { type: String },
  grade: { type: String, enum: ['A', 'B', 'C'] },
  landedCost: {
    purchaseCost: { type: Number, default: 0 },
    transportation: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    repairParts: { type: Number, default: 0 },
    labour: { type: Number, default: 0 },
    otherExpenses: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  warranty: {
    startDate: { type: Date },
    endDate: { type: Date },
    durationMonths: { type: Number, default: 6 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
