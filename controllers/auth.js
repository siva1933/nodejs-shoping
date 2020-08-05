const { validationResult } = require('express-validator/check')
const bcrypt = require("bcryptjs")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

exports.login = (req, res, next) => {
  const { email, password } = req.body
  let loadedUser
  User.findOne({ email }).then((user) => {

    if (!user) {
      const err = new Error("No User Found!")
      err.statusCode = 404
      throw err

      // throw err will take to catch from then
    }

    loadedUser = user
    return bcrypt.compare(password, user.password)
  }).then(isEqual => {
    if (!isEqual) {
      const err = new Error("Passwords Mismatch!")
      err.statusCode = 422
      throw err

      // throw err will take to catch from then
    }

    const token = jwt.sign({
      email: loadedUser.email,
      userId: loadedUser._id.toString()
    }, "supersecrettoken", {
      expiresIn: '1h'
    })

    res.status(200).json({
      token,
      userId: loadedUser._id.toString()
    })

  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })
};

exports.signup = (req, res, next) => {
  const { email, password, name } = req.body

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let error = new Error("Validation Failed")
    error.statusCode = 422
    error.errors = errors.array()
    throw error
  }

  bcrypt.hash(password, 12).then(pwd => {
    const user = new User({
      email,
      password: pwd,
      name,
    })

    return user.save()

  }).then(user => {
    res.status(201).json({
      message: "User created!",
      userId: user._id
    })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })


};


