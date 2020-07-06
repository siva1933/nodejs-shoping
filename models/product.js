// const Sequelize = require('sequelize');
// const sequelize = require("../util/db")


// const Product = sequelize.define("product", {
//   id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
//   title: { type: Sequelize.STRING, allowNull: false },
//   imageUrl: { type: Sequelize.STRING, allowNull: false },
//   description: { type: Sequelize.STRING, allowNull: false },
//   price: { type: Sequelize.DOUBLE, allowNull: false }
// })


// module.exports = Product


const mongoddb = require("mongodb")

const { getDB } = require("../util/db")

module.exports = class Product {
  constructor(title, imageURL, description, price) {
    this.title = title;
    this.imageUrl = imageURL;
    this.description = description;
    this.price = price
  }

  save() {
    const db = getDB()
    return db.collection('products').insertOne({
      title: this.title,
      imageUrl: this.imageUrl,
      description: this.description,
      price: this.price,
    })
  }

  static fetchAll() {
    const db = getDB()
    return db.collection('products').find().toArray()

  }

  static delete(id) {

  }

  static findById(id) {
    const db = getDB()
    return db.collection('products').find({ _id: new mongoddb.ObjectID(id) }).next().then(prod => {
      console.log(prod)
      return prod
    }).catch(err => {
      console.log("error", err)
    })
  }
}

// //  Static is used to call method of class without instansiating it
