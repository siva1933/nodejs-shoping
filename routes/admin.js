const express = require('express');

// const rootDir = require('../util/path');
const adminController = require("../controllers/admin")

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);
// router.get('/edit-product/:id', adminController.getEditProduct);
// router.post('/edit-product', adminController.postEditProduct);
// router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);
// router.post('/delete-product', adminController.deleteProduct);

module.exports = router;
