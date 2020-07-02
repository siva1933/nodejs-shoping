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

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit

  if (!editMode) {
    res.redirect("/")
  } else {
    Product.findById(req.params.id, (prod) => {
      if (!prod) {
        res.redirect("/")
      } else {
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/add-product',
          formsCSS: true,
          productCSS: true,
          activeAddProduct: true,
          product: prod,
          editing: editMode
        });
      }
    })
  }

}

exports.postEditProduct = (req, res, next) => {

  const { id, title, imageUrl, description, price } = req.body
  const product = new Product(id, title, imageUrl, description, price)
  product.save()
  res.redirect('/admin/products');
}

exports.postAddProduct = (req, res, next) => {

  const { title, imageUrl, description, price } = req.body
  const product = new Product(null, title, imageUrl, description, price)
  product.save()
  res.redirect('/admin/products');
}
exports.deleteProduct = (req, res, next) => {

  const { id } = req.body
  Product.delete(id)
  res.redirect('/admin/products');
}


exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
}