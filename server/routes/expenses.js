const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/createExpense',expenseController.createExpense);
router.post('/getByGroupId',expenseController.getByGroupId);
router.post('/deleteExpense',expenseController.deleteExpense);
router.post('/getByExpenseId',expenseController.getExpenseById);
router.post('/updateExpense',expenseController.updateExpense);

module.exports = router;