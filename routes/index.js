const router = require("express").Router();
const path = require('path');
const apiRoutes = require('./api.js');
const htmlRoutes = require('./html.js');

// const offlineRoutes = require('./offline.js');


router.use(apiRoutes);
router.use(htmlRoutes);


module.exports = router