const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');

router.post('/', repairController.createRepairJob);
router.get('/', repairController.getRepairJobs);
router.put('/:id', repairController.updateRepairJob);

module.exports = router;
