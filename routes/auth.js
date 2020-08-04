const express = require('express');
const { body } = require('express-validator/check')
const authController = require('../controllers/auth');
const User = require("../models/user")

const router = express.Router();

// GET /feed/posts
router.post('/login', authController.login);

// POST /feed/post
router.post('/signup', [
  body('email').trim().isEmail().withMessage("Please enter valid email.")
  .custom((value, { req }) => {
    return User.findOne({ email: value }).then(user => {
      if (user) {
        return Promise.reject("Email already exists.")
      }
    })
  }).normalizeEmail()
  ,
  body('password').trim().isLength({ min: 5 }),
  body("name").trim().not().isEmpty()
], authController.signup);


module.exports = router;