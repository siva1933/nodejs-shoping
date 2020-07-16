
const express = require('express');
const authController = require("../controllers/auth")
const router = express.Router();

const { check } = require("express-validator/check")

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignUp);
router.get('/new-password/:token', authController.getNewPassword);
router.get('/reset-password', authController.getReset);

router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogOut);
router.post('/signup',check('email').isEmail().withMessage("Please enter a valid email."), authController.postSignUp);
router.post('/reset-password', authController.postReset);
router.get('/new-password', authController.postNewPassword);


module.exports = router;
