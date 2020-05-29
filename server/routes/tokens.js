const express = require('express');
const router = express.Router();

const tokenController = require('../controllers/tokenController');

router.post('/verify',tokenController.verify);

module.exports = router;