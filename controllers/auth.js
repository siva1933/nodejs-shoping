
const User = require("../models/user")
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false
  })
}

exports.getSignUp = (req, res, next) => {
  res.render('auth/signup', {
    path: "/signup",
    pageTitle: "Sign Up",
    isAuthenticated: false
  })
}

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-Cookie", "loggedIn=true")
  // res.setHeader("Set-Cookie", "loggedIn=true; Max-Age=30000; Expries=HTML Date; Secure; HTTPOnly")
  // Secure set only for https
  User.findById("5f054599df5f1730aaaa45b4").then((user) => {
    req.session.isLoggedIn = true
    req.session.user = user
    req.session.save((err) => {
      if (!err) {
        res.redirect("/")
      } else {
        console.log(err)
      }
    })
  }).catch((err) => {
    console.log(err)
  })
}

exports.postSignUp = (req, res, next) => {
  const { email, password, confirmPassword } = req.body

  User.findOne({ email }).then
}

exports.postLogOut = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login")
  })
}