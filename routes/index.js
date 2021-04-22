const router = require("express").Router();
const path = require('path');
const apiRoutes = require('./api.js');
const offlineRoutes = require('./offline.js');


router.use('/api', apiRoutes);

router.use('/offline', offlineRoutes);

// router.get('/offline', (req,res) => res.sendFile()
module.exports = router