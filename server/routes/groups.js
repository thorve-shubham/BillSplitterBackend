const express= require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');


router.post('/createGroup',auth,groupController.createGroup);
router.post('/getByUserId',auth,groupController.getByUserId);
router.post('/getByGroupId',auth,groupController.getByGroupId);

module.exports = router;