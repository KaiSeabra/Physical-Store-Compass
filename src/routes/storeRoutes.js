const express = require('express');
const { findNearestStore } = require('../controllers/storeController');

const router = express.Router();

router.post('/lojasProximas', findNearestStore);

module.exports = router;