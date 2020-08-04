const { validationResult } = require('express-validator/check')
const bcrypt = require("bcryptjs")
const User = require("../models/user")

exports.login = (req, res, next) => {
  const { email, password } = req.body

  Post.findById(postId).then((post) => {

    if (!post) {
      const err = new Error("No Post Found!")
      err.statusCode = 404
      throw err

      // throw err will take to catch from then
    }
    res.status(200).json({
      post
    });
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


