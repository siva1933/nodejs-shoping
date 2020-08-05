const User = require("../models/user")

exports.updateStatus = (req, res, next) => {

  User.findById(req.userId).then(user => {
    if (!user) {
      const error = new Error("User not found!")
      error.statusCode = 422
      throw error
    }

    user.status = req.body.status
    return user.save()
  }).then(result => {
    res.status(200).json({
      message: "Status updated!"
    })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })

}

exports.getStatus = (req, res, next) => {
  User.findById(req.userId).then(user => {
    if (!user) {
      const error = new Error("User not found!")
      error.statusCode = 422
      throw error
    }
    res.status(200).json({
      status: user.status
    })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })
}