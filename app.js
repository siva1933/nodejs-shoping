const path = require('path');

const express = require('express');
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

const app = express();
// const Product = require("./models/product")
const User = require("./models/user")
// const Cart = require("./models/cart")
// const CartItem = require("./models/cart-item")
// const Order = require("./models/order")
// const OrderItem = require("./models/order-item")


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

app.use((req, res, next) => {
  User.findById("5f054599df5f1730aaaa45b4").then((user) => {
    req.user = user
    
    next()
  }).catch((err) => {
    console.log(err)
  })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(uri).then(() => {
  User.findOne().then(user => {
    if (!user) {
      const user = new User({ name: "siva", email: "siva@vitwit.com", cart: { items: [] } })
      user.save()
    }
  });
  app.listen(3000)
}).catch((err) => {
  console.error(err)
})