const Product = require("../models/product")

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  }).catch((err) => {
    console.error(err)
  });
}

exports.getProduct = (req, res, next) => {
  const { productId: prodId } = req.params
  Product.findById(prodId).then((product) => {
    if (product) {
      res.render('shop/product-detail', { product: product, pageTitle: product.title, path: "/products" })
    }
  })
  // res.redirect("/")
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then((rows) => {
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: rows.length > 0,
      activeShop: true,
      productCSS: true
    });
  }).catch((err) => {
    console.error(err)
  });
}

exports.getCart = (req, res, next) => {
  req.user.getCart().then((products) => {
    console.log(products)
    res.render('shop/cart', {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
      // totalPrice: cart.totalPrice
    })
  }).catch(err => {
    console.error(err)
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
  //       console.error(err)
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
      console.error(err)
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
    //       console.error(err)

    //     })

  }).then(() => {
    res.redirect("/cart")
  }).catch(err => {
    console.error(err)
  })
}

exports.getOrders = (req, res, next) => {

  req.user.getOrders().then(orders => {
    res.render('shop/orders', {
      path: "/orders",
      pageTitle: "Your Orders",
      orders
    }).catch(err => {
      console.error(err)
    })
  })

}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: "/checkout",
    pageTitle: "Checkout"
  })
}

exports.postOrder = (req, res, next) => {

  req.user.addOrder().then(() => {

    res.redirect("/orders")

  }).catch(err => {
    console.error(err)
  })
}
