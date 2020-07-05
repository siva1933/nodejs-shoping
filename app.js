const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const errorController = require("./controllers/error")

const app = express();
const db = require("./util/db");
const Product = require("./models/product")
const User = require("./models/user")
const Cart = require("./models/cart")
const CartItem = require("./models/cart-item")

// app.engine(
//   'hbs',
//   expressHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
//   })
// );

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1).then((user) => {
    req.user = user;
    next();
  }).catch((error) => {
    console.error(error)
  })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

// db.sync({ force: true }) // used to delete and cread db
db.sync()
  .then((result) => {
    // console.log(result)
    return User.findByPk(1)
  }).then((user) => {
    if (!user) {
      return User.create({ name: "Siva", email: "siva@vitwit.com" })
    }
    return user;
  }).then((user) => {
    return user.createCart()
  }).then(() => {
    app.listen(3000);
  }).catch((error) => {
    console.log("error", error)
  })

