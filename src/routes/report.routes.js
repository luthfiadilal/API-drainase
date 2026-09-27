const express = require('express');
const router = express.Router();
const controller = require('../controllers/report.controller');

router.post('/', controller.createReport);
router.get('/', controller.getAllReports);

module.exports = router;
