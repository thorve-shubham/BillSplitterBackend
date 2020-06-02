const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.post('/getHistory',historyController.getHistory);

module.exports = router;