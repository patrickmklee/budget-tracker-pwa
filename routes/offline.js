const router = require("express").Router();
// const path = require('path');
// const Transaction = require("../models/transaction.js");

router.get('/', (req,res) => {
  res.status(200).send('OK')
});

module.exports = router;