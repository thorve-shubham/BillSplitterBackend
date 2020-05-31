const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/createExpense',expenseController.createExpense);
router.post('/getByGroupId',expenseController.getByGroupId);

module.exports = router;