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
    req.user.getProducts({ where: { id: req.params.id } }).then((prods) => {
      // Product.findByPk(req.params.id).then((prod) => {
      const prod = prods[0]
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
  Product.findByPk(id).then((prod) => {
    console.log(prod)
    prod.title = title;
    prod.imageUrl = imageUrl;
    prod.description = description;
    prod.price = price;
    return prod.save()
  }).then(() => {
    res.redirect("/")
  }).catch((err) => {
    console.error(err)

  })
}

exports.postAddProduct = (req, res, next) => {

  const { title, imageUrl, description, price } = req.body
  req.user.createProduct({
    title,
    imageUrl,
    description,
    price
  }).then((result) => {
    // console.log(result)
    res.redirect("/")

  }).catch((err) => {
    console.error(err)
  }) // read more from docs associationsi
}
exports.deleteProduct = (req, res, next) => {

  const { id } = req.body
  Product.findByPk(id).then((prod) => {
    return prod.destroy()
  }).then(() => {
    res.redirect('/admin/products');
  }).catch((err) => {
    console.error(err)

  })
}


exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    // Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    }).catch((err) => {
      console.error(err)
    });
}