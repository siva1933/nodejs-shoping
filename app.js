const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uri = "mongodb+srv://siva_1933:C26qgYsY6Akb7QR@demoapps.qaxs4.mongodb.net/posts-db?retryWrites=true&w=majority";
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const multer = require('multer');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json


app.use("/images", express.static(path.join(__dirname, 'images')))


app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use(userRoutes);

app.use((error, req, res, next) => {
  res.status(error.statusCode || 422).json({
    message: error.message,
    errors: error.errors || []
  })
})

mongoose.connect(uri).then(() => {
  const server = app.listen(8080);
  const io = require("./socket").init(server);
  io.on('connection', socket => {
   console.log("Client Connect!")
  })
}).catch((err) => {
  console.error(err)
})
