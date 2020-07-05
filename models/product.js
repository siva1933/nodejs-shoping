const Sequelize = require('sequelize');
const sequelize = require("../util/db")


const Product = sequelize.define("product", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
  title: { type: Sequelize.STRING, allowNull: false },
  imageUrl: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING, allowNull: false },
  price: { type: Sequelize.DOUBLE, allowNull: false }
})


module.exports = Product



// const Cart = require('../models/cart')
// const db = require("../util/db")

// module.exports = class Product {
//   constructor(id, title, imageURL, description, price) {
//     this.id = id
//     this.title = title;
//     this.imageUrl = imageURL;
//     this.description = description;
//     this.price = price
//   }

//   save() {

//     return db.execute("INSERT INTO products (title, price, description, imageUrl) VALUES(?,?,?,?)", [this.title, this.price, this.description, this.imageUrl])


//     // reads entier file into memory

//   }

//   static fetchAll() {
//     return db.execute("SELECT * FROM products")

//   }

//   static delete(id) {

//   }

//   static findById(id) {
//     return db.execute("SELECT * FROM products WHERE products.id = ?", [id])
//   }
// }

// //  Static is used to call method of class without instansiating it
