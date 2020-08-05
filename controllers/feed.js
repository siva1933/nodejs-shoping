const { validationResult } = require('express-validator/check')
const path = require("path")
const fs = require("fs")
const Post = require("../models/post")
const User = require("../models/user")

exports.getPost = (req, res, next) => {
  const { postId } = req.params

  Post.findById(postId).then((post) => {

    if (!post) {
      const err = new Error("No Post Found!")
      err.statusCode = 404
      throw err

      // throw err will take to catch from then
    }
    res.status(200).json({
      post
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })
};

exports.getPosts = (req, res, next) => {
  const page = req.query.page || 1
  const perPage = 2;
  let totalItems;
  Post.find().countDocuments().then(count => {
    totalItems = count

    return Post.find().skip((page - 1) * perPage).limit(2)

  }).then((posts) => {
    res.status(200).json({
      posts,
      totalItems
    });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })

};

exports.createPost = (req, res, next) => {

  const errors = validationResult(req)
  const title = req.body.title;
  const content = req.body.content;
  let posts;
  let creator;
  // Create post in db
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed")
    error.errors = errors.array()
    error.statusCode = 422
    throw error
  }

  if (!req.file) {
    const error = new Error("Image not provided")
    error.statusCode = 422
    throw error

  }

  const post = new Post({
    title: title,
    content: content,
    imageUrl: req.file.path,
    creator: req.userId
  })

  post.save().then((data) => {
    posts = data
    return User.findById(req.userId)
  }).then(user => {
    creator = user
    user.posts.push(posts)
    return user.save()
  }).then(result => {
    res.status(201).json({
      message: "Post created!",
      post: post,
      creator: {
        _id: creator._id,
        name: creator.name
      }
    })

  }).catch((err) => {
    // db error status code must be 500
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })

};


exports.updatePosts = (req, res, next) => {
  const errors = validationResult(req)
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  const postId = req.params.postId
  // Create post in db
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed")
    error.errors = errors.array()
    error.statusCode = 422
    throw error
  }



  if (req.file) {
    imageUrl = req.file.path
  }

  if (!imageUrl) {
    const error = new Error("Image not provided")
    error.statusCode = 422
    throw error
  }


  Post.findById(postId).then(post => {
    if (!post) {
      const err = new Error("No Post Found!")
      err.statusCode = 404
      throw err

      // throw err will take to catch from then
    }

    if (post.creator.toString() !== req.userId) {
      const err = new Error("Unauthorized!")
      err.statusCode = 403
      throw err
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl)
    }


    post.title = title
    post.content = content
    post.imageUrl = imageUrl

    return post.save()
  }).then((result) => {
    res.status(200).json({
      message: "Post updated!",
      post: result
    })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })
}

exports.deletePost = (req, res, next) => {
  const { postId } = req.params

  Post.findById(postId).then(post => {
    if (!post) {
      const err = new Error("No Post Found!")
      err.statusCode = 404
      throw err

      // throw err will take to catch from then
    }

    if (post.creator.toString() !== req.userId) {
      const err = new Error("Unauthorized!")
      err.statusCode = 403
      throw err
    }

    // check the logged in user
    clearImage(post.imageUrl)

    return Post.findByIdAndRemove(postId)
  }).then((result) => {
    return User.findById(req.userId)
  }).then((user) => {
    user.posts.pull(postId)
    return user.save()
  }).then((result) => {
    res.status(200).json({
      message: "Post deleted!",
    })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })
}

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "-", filePath)

  fs.unlink(filePath, err => console.log(err))

}

