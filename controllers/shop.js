const Product = require("../models/product")


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
  res.render('shop/cart', {
    path: "/cart",
    pageTitle: "Your Cart"
  })
}

exports.postCart = (req, res, next) => {
  const { productId: prodId } = req.body

  Product.findById(prodId, product => {
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

