const Product = require("../models/product")
const Cart = require("../models/cart")


exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
}

exports.getProduct = (req, res, next) => {
  const { productId: prodId } = req.params
  Product.findById(prodId, product => {
    res.render('shop/product-detail', { product, pageTitle: product.title, path: "/products" })
  })
  // res.redirect("/")
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
}

exports.getCart = (req, res, next) => {

  Cart.getCart(cart => {
    if (!cart) {
      res.redirect("/")
    } else {
      Product.fetchAll(products => {
        const cartProducts = []
        for (prod of products) {
          const cartProdData = cart.products.find(i => i.id === prod.id)
          if (cartProdData) {
            cartProducts.push({ productData: prod, qty: cartProdData.qty })
          }
        }

        res.render('shop/cart', {
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartProducts,
          totalPrice: cart.totalPrice
        })
      })
    }

  })

}
exports.postCartDeleteProduct = (req, res, next) => {
  Cart.deleteProduct(req.body.prodId, req.body.prodPrice)
  res.redirect("/cart")
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price)
    res.redirect("/cart")
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: "/orders",
    pageTitle: "Your Orders"
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: "/checkout",
    pageTitle: "Checkout"
  })
}

