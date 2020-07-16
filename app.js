const path = require('path');

const express = require('express');
const csrf = require('csurf');
const flash = require('connect-flash');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
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



app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
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
      req.user = user
      next()
    }).catch((err) => {
      console.log(err)
    })
  }

});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(uri).then(() => {
  app.listen(3000)
}).catch((err) => {
  console.error(err)
})