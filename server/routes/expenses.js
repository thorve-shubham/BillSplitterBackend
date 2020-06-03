const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

router.post('/createExpense',auth,expenseController.createExpense);
router.post('/getByGroupId',auth,expenseController.getByGroupId);
router.post('/deleteExpense',auth,expenseController.deleteExpense);
router.post('/getByExpenseId',auth,expenseController.getExpenseById);
router.post('/updateExpense',auth,expenseController.updateExpense);

module.exports = router;