const Product = require("../models/product")
const Order = require("../models/order")
const fs = require("fs")
const path = require("path")
const PDFDoc = require("pdfkit")

const ITEMS_PER_PAGE = 1

exports.getProducts = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn

  let totalNum;
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page)
  }
  Product.find().countDocuments().then(totalCount => {
    totalNum = totalCount
    return Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
  })
    .then((rows) => {
      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/products',
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true,
        isAuthenticated: isLoggedIn,
        totalProducts: totalNum,
        hasNextPage: ITEMS_PER_PAGE * page < totalNum,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalNum / ITEMS_PER_PAGE),
        isLastPage: page === Math.ceil(totalNum / ITEMS_PER_PAGE),
        currentPage: page
      });
    }).catch((err) => {
      return next(new Error(err))
    });
}

exports.getProduct = (req, res, next) => {
  const { productId: prodId } = req.params
  const isLoggedIn = req.session.isLoggedIn

  Product.findById(prodId).then((product) => {
    if (product) {
      res.render('shop/product-detail', {
        product: product, pageTitle: product.title, path: "/products",
        isAuthenticated: isLoggedIn
      })
    }
  })
  // res.redirect("/")
}

exports.getIndex = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  let totalNum;
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page)
  }
  Product.find().countDocuments().then(totalCount => {
    totalNum = totalCount
    return Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
  })
    .then((rows) => {
      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true,
        isAuthenticated: isLoggedIn,
        totalProducts: totalNum,
        hasNextPage: ITEMS_PER_PAGE * page < totalNum,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalNum / ITEMS_PER_PAGE),
        isLastPage: page === Math.ceil(totalNum / ITEMS_PER_PAGE),
        currentPage: page
      });
    }).catch((err) => {
      return next(new Error(err))
    });
}

exports.getCart = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn

  req.user.populate("cart.items.productId").execPopulate().then((user) => {
    let products = user.cart.items
    res.render('shop/cart', {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
      isAuthenticated: isLoggedIn
      // totalPrice: cart.totalPrice
    })
  }).catch(err => {
    return next(new Error(err))
  })
  // Cart.getCart(cart => {
  //   if (!cart) {
  //     res.redirect("/")
  //   } else {
  //     Product.findAll().then((products) => {
  //       const cartProducts = []
  //       for (prod of products) {
  //         const cartProdData = cart.products.find(i => i.id === prod.id)
  //         if (cartProdData) {
  //           cartProducts.push({ productData: prod, qty: cartProdData.qty })
  //         }
  //       }

  //       res.render('shop/cart', {
  //         path: "/cart",
  //         pageTitle: "Your Cart",
  //         products: cartProducts,
  //         totalPrice: cart.totalPrice
  //       })
  //     }).catch((err) => {
  //       return next(new Error(err))
  //     })

  //   }
  // });
}



exports.postCartDeleteProduct = (req, res, next) => {
  req.user.delete(req.body.prodId)
    .then(() => {
      res.redirect("/cart")
    })
    .catch(err => {
      return next(new Error(err))
    })
}



exports.postCart = (req, res, next) => {
  const { productId } = req.body
  Product.findById(productId).then(prod => {

    return req.user.addToCart(prod)
    // req.user.getCart().then(cart => {
    //   fetchedCart = cart
    //   return cart.getProducts({ where: { id: productId } })
    // }).then((products) => {
    //   let prod;
    //   if (products.length > 0) {
    //     prod = products[0]
    //   }

    //   let newQuantity = 1
    //   if (prod) {
    //     newQuantity = prod.cartItem.quantity + 1
    //   }

    //   return Product.findByPk(productId)
    //     .then((product) => {
    //       return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    //     }).then(() => {
    //       res.redirect("/cart")
    //     })
    //     .catch((err) => {
    //       return next(new Error(err))

    //     })

  }).then(() => {
    res.redirect("/cart")
  }).catch(err => {
    return next(new Error(err))
  })
}

exports.getOrders = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn

  Order.find({ "user.userId": req.user._id }).then(orders => {
    res.render('shop/orders', {
      path: "/orders",
      pageTitle: "Your Orders",
      orders,
      isAuthenticated: isLoggedIn
    })
  }).catch(err => {
    return next(new Error(err))
  })

}

exports.getCheckout = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn

  res.render('shop/checkout', {
    path: "/checkout",
    pageTitle: "Checkout",
    isAuthenticated: isLoggedIn
  })
}

exports.postOrder = (req, res, next) => {
  req.user.populate("cart.items.productId").execPopulate().then((user) => {
    let products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc } }
    })
    const order = new Order({
      products,
      user: {
        userId: req.user,
        email: req.user.email
      }
    })

    return order.save()
  }).then(() => {
    return req.user.clearCart()

  }).then(() => {
    res.redirect("/orders")

  }).catch(err => {
    return next(new Error(err))
  })
}

exports.getInvoice = (req, res, user) => {
  const orderId = req.params.orderId

  const pdfDoc = new PDFDoc()
  Order.findById(orderId).then(order => {
    if (!order) {
      return next(new Error("Order not found."))
    }

    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized!"))
    }

    const invoiceName = 'invoice-' + orderId + ".pdf"
    const invoicePath = path.join('data', 'invoices', invoiceName)
    pdfDoc.pipe(fs.createWriteStream(invoicePath))


    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

    pdfDoc.pipe(res)
    pdfDoc.fontSize(26).text("Invoice", {
      underline: true
    })

    pdfDoc.fontSize(16).text("------------------------------------------")

    let total = 0
    order.products.forEach(element => {
      total = total + (element.quantity * element.product.price)
      pdfDoc.fontSize(14).text(`${element.product.title} - Price $${element.quantity * element.product.price}`)
    });
    pdfDoc.fontSize(16).text("Total Price ---- > $" + total)
    pdfDoc.end()


    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err)
    //   }
    //   res.setHeader("Content-Type", "application/pdf")
    //   res.setHeader("Content-Disposition", `attachment; filename="${invoiceName}"`)
    //   res.send(data)
    // })

    // const file = fs.createReadStream(invoicePath);
    // res.setHeader("Content-Type", "application/pdf")
    // res.setHeader("Content-Disposition", `attachment; filename="${invoiceName}"`);
    // file.pipe(res)


  }).catch(err => next(err))

  // res.send(data)
}


exports.getCheckout = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn

  req.user.populate("cart.items.productId").execPopulate().then((user) => {
    let products = user.cart.items
    let total = 0
    products.forEach((p) => {
      totat += p.quantity * p.productId.price
    })
    res.render('shop/checkout', {
      path: "/checkout",
      pageTitle: "Checkout",
      products: products,
      isAuthenticated: isLoggedIn,
      totalSum: total
      // totalPrice: cart.totalPrice
    })
  }).catch(err => {
    return next(new Error(err))
  })
}