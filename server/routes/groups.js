const express= require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');


router.post('/createGroup',groupController.createGroup);
router.post('/getByUserId',groupController.getByUserId);
router.post('/getByGroupId',groupController.getByGroupId);

module.exports = router;