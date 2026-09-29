const Device = require('../models/Device');
const AuditLog = require('../models/AuditLog');

const logAudit = async (action, entityId, beforeValue, afterValue) => {
  try {
    await AuditLog.create({ action, entityId, beforeValue, afterValue });
  } catch (err) {
    console.error("Audit log error:", err);
  }
};
exports.createDevice = async (req, res) => {
  try {
    const { rfidEpc, landedCost, ...otherDetails } = req.body;

    const existingDevice = await Device.findOne({ rfidEpc });
    if (existingDevice) {
      return res.status(400).json({ message: 'Exception: Duplicate RFID EPC detected.' });
    }

    let purchaseCost = 0, transportation = 0, tax = 0, otherExpenses = 0;
    if (landedCost) {
      purchaseCost = landedCost.purchaseCost || 0;
      transportation = landedCost.transportation || 0;
      tax = landedCost.tax || 0;
      otherExpenses = landedCost.otherExpenses || 0;
    }

    const total = purchaseCost + transportation + tax + otherExpenses;

    const device = new Device({
      rfidEpc,
      ...otherDetails,
      landedCost: {
        purchaseCost,
        transportation,
        tax,
        otherExpenses,
        repairParts: 0,
        labour: 0,
        total
      }
    });

    await device.save();
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDeviceStatus = async (req, res) => {
  try {
    const { status, location, grade } = req.body;
    
    // Create an update object dynamically so we only update what's provided
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (location !== undefined) updateData.location = location;
    if (grade !== undefined) updateData.grade = grade;

    const oldDevice = await Device.findById(req.params.id);
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!device) return res.status(404).json({ message: 'Device not found' });
    
    await logAudit('DEVICE_STATUS_UPDATED', device.rfidEpc, oldDevice.status, device.status);
    
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchDeviceByEPC = async (req, res) => {
  try {
    const device = await Device.findOne({ 
      $or: [{ rfidEpc: req.params.query }, { serialNumber: req.params.query }] 
    });
    if (!device) {
      return res.status(404).json({ message: "Device not found in system." });
    }
    
    const RepairJob = require('../models/RepairJob');
    const activeRepair = await RepairJob.findOne({ device: device._id }).sort({ createdAt: -1 });
    
    const responseData = { 
      ...device.toObject(), 
      repairContext: activeRepair ? activeRepair.toObject() : null 
    };
    
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sellDevice = async (req, res) => {
  try {
    const oldDevice = await Device.findById(req.params.id);
    
    // Calculate Warranty Dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6); // 6 months warranty default
    
    const device = await Device.findByIdAndUpdate(
      req.params.id, 
      { 
        status: 'Dispatched', 
        salePrice: req.body.salePrice, 
        buyer: req.body.buyer,
        'warranty.startDate': startDate,
        'warranty.endDate': endDate,
        'warranty.durationMonths': 6
      }, 
      { new: true }
    );
    if (!device) return res.status(404).json({ message: 'Device not found' });
    
    await logAudit('DEVICE_DISPATCHED', device.rfidEpc, oldDevice.status, 'Dispatched');
    
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.gateScan = async (req, res) => {
  try {
    const device = await Device.findOne({ rfidEpc: req.body.epc });
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    if (device.status === 'Dispatched') {
      return res.status(200).json({ authorized: true, message: 'Gate Pass Approved' });
    } else {
      const lastLocation = device.location;
      device.location = 'Gate A (Unauthorized Exit Attempt)';
      device.status = 'Security Lockdown';
      await device.save();

      return res.status(403).json({ 
        authorized: false, 
        alert: { 
          device: device.model || device.brand || 'Unknown Device', 
          epc: device.rfidEpc, 
          time: new Date(), 
          gate: 'Main Exit - Gate A', 
          lastLocation: lastLocation, 
          securityStatus: 'BREACHED' 
        } 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.placeDeviceInRack = async (req, res) => {
  try {
    const { deviceEpc, rackId } = req.body;
    const device = await Device.findOne({ rfidEpc: deviceEpc });
    
    if (!device) {
      return res.status(404).json({ message: 'Device tag not recognized.' });
    }
    
    device.location = rackId;
    await device.save();
    
    res.status(200).json({ success: true, message: 'Device successfully mapped to location', device });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerMetrics = async (req, res) => {
  try {
    const devices = await Device.find();
    
    let totalInventory = devices.length;
    let readyToSell = 0;
    let repairCount = 0;
    let totalRevenue = 0;
    let totalCost = 0;
    
    devices.forEach(d => {
      if (d.status === 'Ready to Sell') readyToSell++;
      if (d.status === 'Under Repair') repairCount++;
      if (d.status === 'Dispatched' || d.status === 'Sold') totalRevenue += (d.salePrice || 0);
      totalCost += (d.landedCost?.total || 0);
    });

    const grossProfit = totalRevenue - totalCost;

    res.status(200).json({
      totalInventory,
      readyToSell,
      repairCount,
      financials: { totalRevenue, totalCost, grossProfit }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bulkAuditScan = async (req, res) => {
  try {
    const { expectedLocation, scannedTags } = req.body;
    
    // Find all devices expected in this location (excluding dispatched)
    const expectedDevices = await Device.find({ location: expectedLocation, status: { $ne: 'Dispatched' } });
    const expectedEpcs = expectedDevices.map(d => d.rfidEpc);
    
    // Find all scanned devices in the DB
    const scannedDevicesInDb = await Device.find({ rfidEpc: { $in: scannedTags } });
    
    const detected = [];
    const missing = [];
    const extraWrongLocation = [];
    const unknownTags = [];
    
    // Categorize expected devices
    expectedDevices.forEach(device => {
      if (scannedTags.includes(device.rfidEpc)) {
        detected.push(device);
      } else {
        missing.push(device);
      }
    });
    
    // Categorize scanned tags
    scannedTags.forEach(tag => {
      const dbDevice = scannedDevicesInDb.find(d => d.rfidEpc === tag);
      if (!dbDevice) {
        unknownTags.push(tag);
      } else if (dbDevice.location !== expectedLocation) {
        extraWrongLocation.push(dbDevice);
      }
    });

    res.status(200).json({
      expectedCount: expectedEpcs.length,
      detectedCount: detected.length,
      missingCount: missing.length,
      extraCount: extraWrongLocation.length,
      unknownCount: unknownTags.length,
      detected,
      missing,
      extraWrongLocation,
      unknownTags
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPricingRecommendation = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });
    
    const landedCost = device.landedCost?.total || 0;
    let markup = 1.30; 
    
    if (device.grade === 'A') markup = 1.50;
    if (device.grade === 'B') markup = 1.30;
    if (device.grade === 'C') markup = 1.10;
    
    const recommendedPrice = landedCost * markup;
    const projectedProfit = recommendedPrice - landedCost;
    
    res.status(200).json({
      landedCost,
      grade: device.grade || 'Ungraded',
      recommendedPrice: Math.round(recommendedPrice),
      projectedProfit: Math.round(projectedProfit),
      markupPercentage: Math.round((markup - 1) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMissingDevices = async (req, res) => {
  try {
    const missing = await Device.find({ status: 'Security Lockdown' });
    res.status(200).json(missing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
