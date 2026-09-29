const mongoose = require('mongoose');

const repairJobSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  technician: { type: String },
  partsUsed: [{ 
    name: { type: String }, 
    cost: { type: Number } 
  }],
  labourCost: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Assigned', 'Under Repair', 'Pending Approval', 'Completed'], 
    default: 'Assigned' 
  }
}, { timestamps: true });

module.exports = mongoose.model('RepairJob', repairJobSchema);
