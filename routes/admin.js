const express = require('express');
const { body } = require("express-validator/check")

// const rootDir = require('../util/path');
const adminController = require("../controllers/admin")
const isAuth = require("../middleware/is-auth")

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/edit-product/:id', isAuth, adminController.getEditProduct);
router.post('/edit-product', [
  body("title").isString().withMessage("Enter valid title").isLength({ min: 3 }),
  // body("imageUrl").isURL().withMessage("Enter a valid image URL."),
  body("price").isFloat().withMessage("Enter valid price"),
  body("description").isString().withMessage("Enter valid description.")
], isAuth, adminController.postEditProduct);
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
  body("title").isString().withMessage("Enter valid title").isLength({ min: 3 }),
  // body("imageUrl").isURL().withMessage("Enter a valid image URL."),
  body("price").isFloat().withMessage("Enter valid price"),
  body("description").isString().withMessage("Enter valid description.")
], isAuth, adminController.postAddProduct);
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
