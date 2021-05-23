const router = require("express").Router();
const path = require('path');

router.use(require('express').static(path.join(__dirname, '..','public','assets')));
router.get('/static/:assetType/vendor/:filename', (req,res) => {
  // console.log('@@@@@@@@@@@@@@@\n%s %s',(req.params.assetType, req.params.filename));
  res.sendFile(path.join(__dirname, '..','public',req.params.assetType, 'vendor', req.params.filename));
});
router.get('/static/:assetType/:filename', (req,res) => {
  // console.log('@@@@@@@@@@@@@@@\n%s %s',(req.params.assetType, req.params.filename));
  res.sendFile(path.join(req.params.assetType, req.params.filename));
});

module.exports = router;