const Product = require("../models/product")
const { ObjectId } = require("../util/db")
const { validationResult } = require("express-validator/check")
const { deleteFile } = require("../util/file")


exports.getAddProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    isAuthenticated: isLoggedIn,
    oldInput: {},
    validationErrors: [],
    errorMsg: "",
  });
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
          editing: editMode,
          validationErrors: []
        });
      }
    }).catch(err => {
      console.log(err)
    })
  }

}

exports.postEditProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  const image = req.file


  const { id, title, description, price } = req.body

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: false,
      isAuthenticated: isLoggedIn,
      product: {
        title, price, description, _id: id
      },
      validationErrors: errors.array(),
      errorMsg: errors.array()[0].msg,

    })
  }

  Product.findById(id).then((product) => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/")
    }
    product.title = title
    if (image) {
      deleteFile(imageUrl)
      product.imageUrl = imageUrl
    }
    product.description = description
    product.price = price
    product.save().then(() => {
      res.redirect("/")
    })
  }).catch((err) => {
    return next(new Error(err))
    // return res.status(422).render('admin/edit-product', {
    //   pageTitle: 'Edit Product',
    //   path: '/admin/edit-product',
    //   formsCSS: true,
    //   productCSS: true,
    //   activeAddProduct: true,
    //   isAuthenticated: isLoggedIn,
    //   product: {
    //     title, imageUrl, price, description, _id: id
    //   },
    //   validationErrors: [],
    //   errorMsg: "Database Error!",

    // })

    // return res.redirect("/500")

  })
}

const getAddProductObj = (msg, errors, obj) => {
  const { title, price, description, isLoggedIn } = obj
  return {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    isAuthenticated: isLoggedIn,
    oldInput: {
      title, price, description
    },
    validationErrors: (errors && errors.array()) || [],
    errorMsg: (errors && errors.array()[0].msg) || msg,

  }
}

exports.postAddProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  const image = req.file
  const { title, description, price } = req.body

  const errors = validationResult(req);

  console.log(image, req.file)

  if (!image) {
    return res.status(422).render('admin/add-product', getAddProductObj("Invalid File Type.", null, {
      title,
      description,
      price,
      isLoggedIn
    }))
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/add-product', getAddProductObj("", errors, {
      title,
      description,
      price,
      isLoggedIn
    }))
  }

  const imageUrl = image.path

  const prod = new Product(
    {
      title,
      description,
      imageUrl,
      price,
      userId: req.user._id
    }
  )

  prod.save().then(() => {
    res.redirect("/")
  }).catch((err) => {
    return next(new Error(err))
  }) // read more from docs associationsi
}

exports.deleteProduct = (req, res, next) => {

  const { productId: id } = req.params
  Product.findById(id).then((prod) => {
    if (!prod) {
      return next(new Error("Product Not Found."))
    }
    deleteFile(prod.imageUrl)
    return Product.deleteOne({ _id: id, userId: req.user._id })
  })
    .then(() => {
      // res.redirect('/admin/products');
      res.status(200).json({
        message:"Success."
      })
    }).catch((err) => {
      res.status(500).json({
        message:"Failed."
      })

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
      return next(new Error(err))
    });
}