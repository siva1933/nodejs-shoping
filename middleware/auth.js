const jwt = require("jsonwebtoken")

exports.isAuth = (req, res, next) => {

  const authenticated = req.get("Authorization")

  if (!authenticated) {
    const error = new Error("Not authenticated!")
    error.statusCode = 401
    throw error
  }

  const token = authenticated.split(" ")[1]

  let decoded;

  try {
    decoded = jwt.verify(token, 'supersecrettoken')
  } catch (error) {
    error.statusCode = 500
    throw error
  }

  if (!decoded) {
    const error = new Error("Not authenticated!")
    error.statusCode = 401
    throw error
  }

  req.userId = decoded.userId;
  next();
}