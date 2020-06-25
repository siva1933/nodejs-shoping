const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
}

exports.postAddProduct = (req, res, next) => {

  const { title, imageURL, description, price } = req.body
  const product = new Product(title, imageURL, description, price)
  product.save()
  res.redirect('/');
}


exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products-list', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
}