const express = require('express');
const auth = require('../middleware/auth');

const userController = require('../controllers/userController');

const router = express.Router();

router.post('/create',userController.createUser);
router.post('/login',userController.login);
// router.post('/forgotPassword',userController.sendMail);
// router.post('/changePassword',userController.changePassword);
// router.post('/getUsers',auth,userController.getUsers);


module.exports = router;

