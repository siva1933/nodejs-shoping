const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = require("../util/db")
const Product = require("./product")
const Order = require("./order")


const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [{ productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" }, quantity: { type: Number, required: true } }]
  },
})

userSchema.methods.addToCart = function (product) {
  let updatedCartItems = [...this.cart.items]
  let cartProduct = updatedCartItems.findIndex(cp => {
    return cp.productId + "" === product._id + ""
  })

  if (cartProduct >= 0) {
    updatedCartItems[cartProduct].quantity = updatedCartItems[cartProduct].quantity + 1
  } else {
    updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1 })
  }

  const updatedCart = { items: updatedCartItems }
  this.cart = updatedCart
  return this.save()
}

userSchema.methods.getCart = function () {
  const productIds = this.cart.items.map(i => { return i.productId })
  return Product.find({ _id: { $in: productIds } }).then((prods) => {
    return prods.map(p => {
      return {
        ...p,
        quantity: this.cart.items.find(i => {
          return i.productId.toString() === p._id.toString()
        }).quantity
      }
    })
  }).catch(err => { console.log(err) })
}

userSchema.methods.delete = function (id) {

  let updatedCartItems = [...this.cart.items]
  let cartProduct = updatedCartItems.findIndex(cp => {
    return cp.productId + "" === id + ""
  })

  updatedCartItems.splice(cartProduct, 1)

  const updatedCart = { items: updatedCartItems }
  this.cart = updatedCart
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}


// const { getDB, ObjectId } = require("../util/db")

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items:[]}
//     this._id = id;
//   }

//   save() {
//     const db = getDB()
//     return db.collection('users').insertOne(this)
//   }

//   addOrder() {
//     const db = getDB()
//     const productIds = this.cart.items.map(i => { return i.productId })
//     return db.collection("products").find({ _id: { $in: productIds } }).toArray().then((prods) => {
//       prods = prods.map(p => {
//         return {
//           ...p,
//           quantity: this.cart.items.find(i => {
//             return i.productId.toString() === p._id.toString()
//           }).quantity
//         }
//       })

//       this.cart.items = prods

//       return db.collection('orders').insertOne({ ...this.cart, userId: new ObjectId(this._id) }).then(() => {

//         return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } })
//       })

//     }).catch(err => { console.log(err) })

//   }

//   addToCart(product) {
//     const db = getDB()


//     let updatedCartItems = [...this.cart.items]
//     let cartProduct = updatedCartItems.findIndex(cp => {
//       return cp.productId + "" === product._id + ""
//     })
//     console.log(cartProduct)
//     if (cartProduct >= 0) {
//       updatedCartItems[cartProduct].quantity = updatedCartItems[cartProduct].quantity + 1
//     } else {
//       updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1 })
//     }


//     const updatedCart = { items: updatedCartItems }
//     return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } })
//   }

//   getCart() {
//     const db = getDB()
//     const productIds = this.cart.items.map(i => { return i.productId })
//     return db.collection("products").find({ _id: { $in: productIds } }).toArray().then((prods) => {
//       return prods.map(p => {
//         return {
//           ...p,
//           quantity: this.cart.items.find(i => {
//             return i.productId.toString() === p._id.toString()
//           }).quantity
//         }
//       })
//     }).catch(err => { console.log(err) })
//   }

//   delete(id) {
//     const db = getDB()

//     let updatedCartItems = [...this.cart.items]
//     let cartProduct = updatedCartItems.findIndex(cp => {
//       return cp.productId + "" === id + ""
//     })

//     updatedCartItems.splice(cartProduct, 1)

//     const updatedCart = { items: updatedCartItems }
//     return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } })
//   }

//   getOrders() {
//     const db = getDB()
//     return db.collection('orders').find({ userId: new ObjectId(this._id) }).toArray()
//   }

//   static findById(id) {
//     const db = getDB()
//     return db.collection('users').findOne({ _id: new ObjectId(id) })
//   }
// }

module.exports = mongoose.model("User", userSchema)