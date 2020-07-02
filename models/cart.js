// const products = []
const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json')


module.exports = class Cart {
  // Fetch the perious cart
  static addProduct(id, productPrice) {
    let cart = { products: [], totalPrice: 0 }
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cart = JSON.parse(fileContent)
      }
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      let updatedProduct;

      if (existingProductIndex >= 0) {

        updatedProduct = { ...cart.products[existingProductIndex], qty: cart.products[existingProductIndex].qty + 1 }
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct

      } else {

        updatedProduct = { id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]

      }

      cart.totalPrice = parseFloat(cart.totalPrice) + parseFloat(productPrice);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.error(err)
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      let cart = JSON.parse(fileContent)
      const existingProduct = cart.products.find(prod => prod.id === id);
      if (!existingProduct) {
        return
      }
      let updatedCart = { ...cart };
      let prodQty = existingProduct.qty;

      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
      updatedCart.totalPrice = updatedCart.totalPrice - (prodQty * productPrice);


      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.error(err)
      })
    })
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null)
      } else {
        let cart = JSON.parse(fileContent)
        cb(cart)
      }

    })
  }
}