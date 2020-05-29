const express = require('express');


const userController = require('../controllers/userController');

const router = express.Router();

router.post('/create',userController.createUser);
router.post('/login',userController.login);
router.post('/forgotPassword',userController.sendMail);


module.exports = router;

