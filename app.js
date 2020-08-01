const path = require('path');

const express = require('express');
const csrf = require('csurf');
const flash = require('connect-flash');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const multer = require('multer');
const { uri } = require("./util/db");

const store = new MongoDBStore({
  uri,
  collection: "sessions"
})
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const errorController = require("./controllers/error")

const User = require("./models/user")

const app = express();

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true)
  } else {
    cb(null, false)
  }
}



app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

app.use(express.static(path.join(__dirname, 'public')));

app.use("/images", express.static(path.join(__dirname, 'images')));
app.use(session({
  secret: "my-secret",
  resave: false, // session is not saved on every request
  saveUninitialized: false, // 
  store
}))

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  next()
})


app.use((req, res, next) => {
  if (!req.session.user) {
    next()
  } else {
    User.findOne({ email: req.session.user.email }).then((user) => {
      if (!user) {
        next()
      }
      req.user = user
      next()
    }).catch((err) => {
      return next(new Error(err))
    })
  }

});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// app.get('/500', errorController.get500)

app.use(errorController.get404);

// Error handling middleware

app.use((error, req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  console.log(error)
  res.status(500).render('500', {
    pageTitle: 'Internal Server Error', path: "/500",
    isAuthenticated: isLoggedIn
  });

})

mongoose.connect(uri).then(() => {
  app.listen(3001)
}).catch((err) => {
  console.error(err)
})