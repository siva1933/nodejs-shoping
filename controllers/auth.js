
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const { validationResult } = require("express-validator/check")

const sgMail = require("@sendgrid/mail")

sgMail.setApiKey("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")

exports.getLogin = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0]
  } else {
    msg = null
  }
  res.render('auth/login', {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMsg: msg,
    validationErrors: [],
    oldInput: {}
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0]
  } else {
    msg = null
  }

  User.findOne({
    resetToken: token, resetTokenExpiration: {
      $gt: Date.now()
    }
  }).then(user => {
    res.render('auth/password', {
      path: "/new-password",
      pageTitle: "Login",
      isAuthenticated: false,
      errorMsg: msg,
      userId: user._id.toString(),
      passwordToken: token
    })
  }).catch(err => {
    console.log(err)
  })

}

exports.getReset = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0]
  } else {
    msg = null
  }
  res.render('auth/reset', {
    path: "/reset-password",
    pageTitle: "Reset Password",
    isAuthenticated: false,
    errorMsg: msg
  })
}

exports.getSignUp = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0]
  } else {
    msg = null
  }
  res.render('auth/signup', {
    path: "/signup",
    pageTitle: "Sign Up",
    errorMsg: msg,
    isAuthenticated: false,
    oldInput: {},
    validationErrors: []
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body

  // res.setHeader("Set-Cookie", "loggedIn=true")
  // res.setHeader("Set-Cookie", "loggedIn=true; Max-Age=30000; Expries=HTML Date; Secure; HTTPOnly")
  // Secure set only for https

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: "/login",
      pageTitle: "Login",
      errorMsg: errors.array()[0].msg,
      isAuthenticated: false,
      oldInput: {
        email, password
      },
      validationErrors: errors.array()

    })
  }

  User.findOne({ email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password).then((bool) => {
        // console.log(password, user.password, bool)
        if (bool) {
          req.session.isLoggedIn = true
          req.session.user = user
          req.session.save((err) => {
            if (!err) {
              return res.redirect("/")
            } else {
              console.log(err)
            }
          })
        } else {
          req.flash("error", "Invalid email or password.")
          return res.redirect("/login")
        }
      })
    } else {
      req.flash("error", "User Do Not Exist.")

      res.redirect("/signup")
    }


  }).catch((err) => {
    console.log(err)
  })

}

exports.postSignUp = (req, res, next) => {
  const { email, password, confirmPassword } = req.body

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: "/signup",
      pageTitle: "Sign Up",
      errorMsg: errors.array()[0].msg,
      isAuthenticated: false,
      oldInput: {
        email, password, confirmPassword
      },
      validationErrors: errors.array()
    })
  }
  bcrypt.hash(password, 12)
    .then((hashedPwd) => {
      const user = new User({ email, password: hashedPwd, cart: { items: [] } })
      return user.save()
    }).then(() => {

      res.redirect("/login")
      return sgMail.send({
        to: email,
        from: "shop@nodejsapp.com",
        subject: "Signup Successfull!",
        html: '<h1>Welcome to shop.</h1>'
      })
    }).catch(err => {
      console.log(err)
    })
}

exports.postLogOut = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login")
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect("reset-password");
    }
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        req.flash("error", "no User Found")
        return res.redirect("/reset-password")
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;

      return user.save()
    }).then(() => {
      sgMail.send({
        to: req.body.email,
        from: "shop@nodejsapp.com",
        subject: "Signup Successfull!",
        html: `
        <p>You requested a password reset.</p>
        <p> Click this <a href="http://localhost:3000/reset/${token}">Link</a></p>
        `
      })
      res.redirect("/login")
    }).catch(err => {
      return next(new Error(err))
    })
  })
}

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body
  let resetUser;
  User.findOne({
    resetToken: passwordToken, resetTokenExpiration: {
      $gt: Date.now()
    }
  }).then((user) => {

    resetUser = user

    return bcrypt.hash(password, 12)
  }).then((hashedPwd) => {
    resetUser.password = hashedPwd;
    resetUser.resetTokenExpiration = undefined;
    resetUser.resetToken = undefined;
    return resetUser.save()
  }).then(() => {
    res.redirect("/login")
  }).catch(err => {
    return next(new Error(err))
  })
}