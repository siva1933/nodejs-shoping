const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const errorController = require("./controllers/error")

const app = express();
const { mongoConnect } = require("./util/db");
// const Product = require("./models/product")
// const User = require("./models/user")
// const Cart = require("./models/cart")
// const CartItem = require("./models/cart-item")
// const Order = require("./models/order")
// const OrderItem = require("./models/order-item")



app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect((db, err) => {
  if (!err) {
    app.listen(3030)
  } else {
    console.log(err)
  }
})


