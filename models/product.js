// const products = []
const fs = require('fs')
const path = require('path')
const Cart = require('../models/cart')

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([])
    } else {
      cb(JSON.parse(fileContent))
    }
  })
}

module.exports = class Product {
  constructor(id, title, imageURL, description, price) {
    this.id = id
    this.title = title;
    this.imageUrl = imageURL;
    this.description = description;
    this.price = price
  }

  save() {

    getProductsFromFile(products => {
      if (!this.id) {
        this.id = Math.random().toString()
        products.push(this)
      } else {
        const existingIndex = products.findIndex(prod => prod.id === this.id)
        products[existingIndex] = this
      }
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err)
      })
    })

    // reads entier file into memory

  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }

  static delete(id) {
    getProductsFromFile(products => {
      const existingIndex = products.findIndex(prod => prod.id === id)
      const product = products.find(prod => prod.id === id)
      products.splice(existingIndex, 1)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price)
        }
        console.log(err)
      })
    })
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(item => item.id === id)
      cb(product)
    })
  }
}

//  Static is used to call method of class without instansiating it
