const express = require('express');
const router = express.Router();

const drainageRoutes = require('./drainage.routes');
const userRoutes = require('./user.routes');
const aspectRoutes = require('./aspect.routes');
const indicatorRoutes = require('./indicator.routes');
const indicatorOptionRoutes = require('./indicatorOption.routes');

router.use('/drainages', drainageRoutes);
router.use('/users', userRoutes);
router.use('/aspects', aspectRoutes); 
router.use('/indicators', indicatorRoutes);
router.use('/indicator-options', indicatorOptionRoutes);


const regionRoutes = require('./region.routes');
router.use('/regions', regionRoutes);

const reportRoutes = require('./report.routes');
router.use('/drainage-reports', reportRoutes);

module.exports = router;
