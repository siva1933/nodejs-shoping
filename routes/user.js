const express = require('express');
const userController = require('../controllers/user');
const { isAuth } = require("../middleware/auth")

const router = express.Router();

// GET /feed/posts
router.put('/status', isAuth, userController.updateStatus);

// POST /feed/post
router.get('/status', isAuth, userController.getStatus);


module.exports = router;