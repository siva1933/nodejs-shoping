const Product = require("../models/product")
const { ObjectId } = require("../util/db")


exports.getAddProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    isAuthenticated: isLoggedIn
  });
}

exports.postAddProduct = (req, res, next) => {

  const { title, imageUrl, description, price } = req.body
  const product = new Product(title, imageUrl, description, price, req.user._id)

  product.save().then((result) => {
    // console.log(result)
    res.redirect("/")

  }).catch((err) => {
    console.error(err)
  })
}



exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit

  if (!editMode) {
    res.redirect("/")
  } else {
    Product.findById(req.params.id).then((prods) => {
      const isLoggedIn = req.session.isLoggedIn

      // Product.findByPk(req.params.id).then((prod) => {
      const prod = prods
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
          isAuthenticated: isLoggedIn,
          editing: editMode
        });
      }
    })
  }

}

exports.postEditProduct = (req, res, next) => {

  const { id, title, imageUrl, description, price } = req.body

  Product.findById(id).then((product) => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/")
    }
    product.title = title
    product.imageUrl = imageUrl
    product.description = description
    product.price = price
    product.save().then(() => {
      res.redirect("/")
    })
  }).catch((err) => {
    console.error(err)

  })
}

exports.postAddProduct = (req, res, next) => {

  const { title, imageUrl, description, price } = req.body
  const prod = new Product(
    {
      title,
      imageUrl,
      description,
      price,
      userId: req.user._id
    }
  )

  prod.save().then(() => {
    res.redirect("/")
  }).catch((err) => {
    console.error(err)
  }) // read more from docs associationsi
}

exports.deleteProduct = (req, res, next) => {

  const { id } = req.body
  Product.deleteOne({ _id: id, userId: req.user._id }).then(() => {
    res.redirect('/admin/products');
  }).catch((err) => {
    console.error(err)

  })
}


exports.getProducts = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn

  Product.find({ userId: new ObjectId(req.user._id) })
    // .select(" title price")
    // .populate('userId','name -_id')
    // .populate('userId')
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        isAuthenticated: isLoggedIn
      });
    }).catch((err) => {
      console.error(err)
    });
}