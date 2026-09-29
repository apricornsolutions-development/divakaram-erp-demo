const mongoose = require('mongoose');
require('dotenv').config();
const Device = require('./models/Device');
const RepairJob = require('./models/RepairJob');

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await Device.deleteMany();
    await RepairJob.deleteMany();

    const devicesData = [
      {
        deviceId: 'DEV-001',
        serialNumber: 'SN-001',
        rfidEpc: 'DEMO-TAG-001',
        brand: 'Dell',
        model: 'Latitude',
        status: 'Received',
        landedCost: { purchaseCost: 150, transportation: 0, tax: 0, repairParts: 0, labour: 0, otherExpenses: 0, total: 150 }
      },
      {
        deviceId: 'DEV-002',
        serialNumber: 'SN-002',
        rfidEpc: 'DEMO-TAG-002',
        brand: 'Dell',
        model: 'Latitude',
        status: 'Under Repair',
        landedCost: { purchaseCost: 150, transportation: 0, tax: 0, repairParts: 0, labour: 0, otherExpenses: 0, total: 150 }
      },
      {
        deviceId: 'DEV-003',
        serialNumber: 'SN-003',
        rfidEpc: 'DEMO-TAG-003',
        brand: 'Dell',
        model: 'Latitude',
        status: 'QC Pending',
        landedCost: { purchaseCost: 150, transportation: 0, tax: 0, repairParts: 40, labour: 20, otherExpenses: 0, total: 210 }
      },
      {
        deviceId: 'DEV-004',
        serialNumber: 'SN-004',
        rfidEpc: 'DEMO-TAG-004',
        brand: 'Dell',
        model: 'Latitude',
        status: 'Ready to Sell',
        landedCost: { purchaseCost: 120, transportation: 0, tax: 0, repairParts: 0, labour: 0, otherExpenses: 0, total: 120 }
      },
      {
        deviceId: 'DEV-005',
        serialNumber: 'SN-005',
        rfidEpc: 'DEMO-TAG-005',
        brand: 'Dell',
        model: 'Latitude',
        status: 'Ready to Sell',
        landedCost: { purchaseCost: 180, transportation: 0, tax: 0, repairParts: 0, labour: 0, otherExpenses: 0, total: 180 }
      }
    ];

    const createdDevices = await Device.insertMany(devicesData);

    const device2 = createdDevices.find(d => d.rfidEpc === 'DEMO-TAG-002');
    const device3 = createdDevices.find(d => d.rfidEpc === 'DEMO-TAG-003');

    const repairsData = [
      {
        device: device2._id,
        technician: 'Alice',
        status: 'Under Repair',
        partsUsed: [],
        labourCost: 0
      },
      {
        device: device3._id,
        technician: 'Bob',
        status: 'Completed',
        partsUsed: [{ name: 'Battery', cost: 40 }],
        labourCost: 20
      }
    ];

    await RepairJob.insertMany(repairsData);

    console.log('✅ Demo Data Imported Successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

importData();
