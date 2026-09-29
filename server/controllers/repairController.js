const RepairJob = require('../models/RepairJob');
const Device = require('../models/Device');

exports.createRepairJob = async (req, res) => {
  try {
    const { device, technician, partsUsed, labourCost, status } = req.body;
    
    // Create new repair job
    const repairJob = new RepairJob({
      device,
      technician,
      partsUsed,
      labourCost,
      status
    });
    
    await repairJob.save();

    // Update associated device status
    await Device.findByIdAndUpdate(device, { status: 'Under Repair' });

    res.status(201).json(repairJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRepairJobs = async (req, res) => {
  try {
    const repairJobs = await RepairJob.find().populate('device');
    res.status(200).json(repairJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRepairJob = async (req, res) => {
  try {
    const { partsUsed, labourCost, status } = req.body;
    const repairId = req.params.id;

    // Update RepairJob
    const repairJob = await RepairJob.findById(repairId);
    if (!repairJob) return res.status(404).json({ message: 'Repair job not found' });

    if (partsUsed !== undefined) repairJob.partsUsed = partsUsed;
    if (labourCost !== undefined) repairJob.labourCost = labourCost;
    if (status !== undefined) repairJob.status = status;

    await repairJob.save();

    // Trigger Landed Cost Recalculation
    const device = await Device.findById(repairJob.device);
    if (device) {
      let repairPartsTotal = 0;
      if (repairJob.partsUsed && repairJob.partsUsed.length > 0) {
        repairPartsTotal = repairJob.partsUsed.reduce((sum, part) => sum + (part.cost || 0), 0);
      }

      device.landedCost.repairParts = repairPartsTotal;
      device.landedCost.labour = repairJob.labourCost || 0;

      const { purchaseCost, transportation, tax, otherExpenses } = device.landedCost;
      
      device.landedCost.total = 
        (purchaseCost || 0) + 
        (transportation || 0) + 
        (tax || 0) + 
        device.landedCost.repairParts + 
        device.landedCost.labour + 
        (otherExpenses || 0);

      if (repairJob.status === 'Completed') {
        device.status = 'QC Pending';
      }

      await device.save();
    }

    res.status(200).json(repairJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
