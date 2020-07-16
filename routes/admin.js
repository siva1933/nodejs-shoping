const express = require('express');

// const rootDir = require('../util/path');
const adminController = require("../controllers/admin")
const isAuth = require("../middleware/is-auth")

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/edit-product/:id', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);
router.post('/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;
