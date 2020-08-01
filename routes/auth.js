
const express = require('express');
const authController = require("../controllers/auth")
const router = express.Router();
const User = require("../models/user")

const { check, body } = require("express-validator/check")

// check will check in any part of the body

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignUp);
router.get('/new-password/:token', authController.getNewPassword);
router.get('/reset-password', authController.getReset);

router.post('/login',[check('email')
.isEmail()
.withMessage("Please enter a valid email.")
.normalizeEmail()
,
body('password', "Password should be of atleast 5 characters long and should be alpha numeric").isLength({ min: 5 }).isAlphanumeric()
], authController.postLogin);
router.post('/logout', authController.postLogOut);
router.post('/signup',
  [check('email')
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail()
    .custom((value, { req }) => {
      // if (value === "test@test.com") {
      //   throw new Error("This email is forbidden.")
      // }
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject("Email already exists.")
        }
      })
    }),
  body('password', "Passwords does not match.").isLength({ min: 5 }).isAlphanumeric(),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords Mismatch.")
    }
    return true
  })
  ]
  , authController.postSignUp);
router.post('/reset-password', authController.postReset);
router.get('/new-password', authController.postNewPassword);


module.exports = router;
