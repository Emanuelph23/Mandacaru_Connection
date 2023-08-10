const express = require('express');
const router = express.Router();
const ToughtController = require('../controllers/ToughtController');

//Controllers

router.get('/', ToughtController.showHome);

module.exports = router;