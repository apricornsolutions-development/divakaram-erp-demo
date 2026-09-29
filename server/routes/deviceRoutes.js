const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

router.post('/', deviceController.createDevice);
router.get('/', deviceController.getDevices);
router.put('/:id', deviceController.updateDeviceStatus);
router.get('/search/:query', deviceController.searchDeviceByEPC);
router.put('/:id/sell', deviceController.sellDevice);
router.post('/gate-scan', deviceController.gateScan);
router.post('/rack-placement', deviceController.placeDeviceInRack);
router.get('/metrics/missing', deviceController.getMissingDevices);
router.get('/metrics/owner', deviceController.getOwnerMetrics);
router.get('/audit-logs', deviceController.getAuditLogs);
router.post('/audit/bulk-scan', deviceController.bulkAuditScan);
router.get('/:id/pricing', deviceController.getPricingRecommendation);

module.exports = router;
