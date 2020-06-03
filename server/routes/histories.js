const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.post('/getHistory',auth,historyController.getHistory);

module.exports = router;