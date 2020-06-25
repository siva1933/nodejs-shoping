// const products = []
const fs = require('fs')
const path = require('path')

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
  constructor(title, imageURL, description, price) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price
  }

  save() {
    getProductsFromFile(products => {
      products.push({ title: this.title, imageURL: this.imageURL, description: this.description, price: this.price })
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err)
      })
    })

    // reads entier file into memory

  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }
}

//  Static is used to call method of class without instansiating it
